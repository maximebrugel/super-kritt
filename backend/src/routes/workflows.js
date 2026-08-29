import { Router } from 'express';
import { prisma } from '../db.js';
import { validateWorkflow } from '../lib/validation.js';
import { assembleWorkflows, assembleWorkflow } from '../lib/repo.js';
import { VULNERABILITIES_TABLE, STEP_RESULTS_TABLE } from '../lib/constants.js';
import { ensureDefaultWorkflows, isDefaultWorkflowName } from '../lib/defaultWorkflows.js';
import { lockWorkflowForEdit } from '../lib/workflowLocks.js';

const router = Router();

// GET /api/workflows — all workflows with their steps + scan meta.
router.get('/', async (req, res, next) => {
  try {
    await ensureDefaultWorkflows();
    const workflows = await prisma.workflow.findMany({ orderBy: { insertedAt: 'desc' } });
    res.json(await assembleWorkflows(workflows));
  } catch (e) {
    next(e);
  }
});

// GET /api/workflows/:id — a single workflow with its full step tree.
router.get('/:id', async (req, res, next) => {
  try {
    const workflow = await prisma.workflow.findUnique({ where: { id: BigInt(req.params.id) } });
    if (!workflow) return res.status(404).json({ error: 'Workflow not found.' });
    res.json(await assembleWorkflow(workflow));
  } catch (e) {
    next(e);
  }
});

export function workflowStepRows(valid) {
  return valid.levels.flatMap((level) => {
    const isLast = level.depth === valid.maxDepth;
    const outputFormat = JSON.stringify(level.outputFormat);
    return level.steps.map((step) => ({
      clientId: step.clientId,
      boundSourceStepId: step.boundSourceStepId,
      content: step.content,
      outputFormat,
      name: step.name?.trim() || null,
      depth: level.depth,
      multiOutput: level.multiOutput,
      consumesAll: level.consumesAll,
      isLastStep: isLast,
      outputTable: isLast ? VULNERABILITIES_TABLE : STEP_RESULTS_TABLE,
    }));
  });
}

export function stepsMatch(existingSteps, valid) {
  const rows = workflowStepRows(valid);
  if (existingSteps.length !== rows.length) return false;
  const createdByClientId = new Map(rows.map((row, index) => [row.clientId, existingSteps[index]?.id]));
  return rows.every(({ clientId: _clientId, boundSourceStepId, ...row }, index) => {
    const step = existingSteps[index];
    const expectedBoundSourceStepId = boundSourceStepId ? createdByClientId.get(boundSourceStepId) : null;
    return (
      !!step &&
      step.boundSourceStepId === expectedBoundSourceStepId &&
      Object.keys(row).every((key) => step[key] === row[key])
    );
  });
}

// Persist a validated workflow (steps first, then the workflow row).
async function createWorkflowSteps(tx, valid) {
  const stepIds = [];
  const createdByClientId = new Map();
  for (const { clientId, boundSourceStepId, ...data } of workflowStepRows(valid)) {
    const created = await tx.step.create({
      data: {
        ...data,
        boundSourceStepId: boundSourceStepId ? createdByClientId.get(boundSourceStepId) : null,
      },
    });
    stepIds.push(created.id);
    createdByClientId.set(clientId, created.id);
  }
  return stepIds;
}

async function orderedSteps(tx, stepIds) {
  const ids = stepIds || [];
  if (ids.length === 0) return [];
  const steps = await tx.step.findMany({ where: { id: { in: ids } } });
  const byId = new Map(steps.map((step) => [step.id.toString(), step]));
  return ids.map((id) => byId.get(id.toString())).filter(Boolean);
}

async function persistWorkflow(valid) {
  return prisma.$transaction(async (tx) => {
    const stepIds = await createWorkflowSteps(tx, valid);
    return tx.workflow.create({
      data: { name: valid.name, description: valid.description, stepIds, extra: valid.extraKeys },
    });
  });
}

export function workflowInUseResponse(scanCount) {
  return {
    error: `Cannot edit: ${scanCount} scan(s) use this workflow. Duplicate it to make changes safely.`,
    code: 'workflow_in_use',
    scanCount,
  };
}

export async function replaceWorkflowIfUnused(tx, id, valid) {
  await lockWorkflowForEdit(tx, id);
  const existing = await tx.workflow.findUnique({ where: { id } });
  if (!existing) return { kind: 'not-found' };
  const scanCount = await tx.scan.count({ where: { workflowId: id } });
  if (scanCount > 0) {
    if (!stepsMatch(await orderedSteps(tx, existing.stepIds), valid)) return { kind: 'in-use', scanCount };
    const workflow = await tx.workflow.update({
      where: { id },
      data: { name: valid.name, description: valid.description, extra: valid.extraKeys },
    });
    return { kind: 'updated', workflow };
  }

  const stepIds = await createWorkflowSteps(tx, valid);
  const workflow = await tx.workflow.update({
    where: { id },
    data: { name: valid.name, description: valid.description, stepIds, extra: valid.extraKeys },
  });
  if (existing.stepIds?.length) {
    await tx.step.deleteMany({ where: { id: { in: existing.stepIds } } });
  }
  return { kind: 'updated', workflow };
}

export async function deleteWorkflowIfUnused(tx, id) {
  await lockWorkflowForEdit(tx, id);
  const existing = await tx.workflow.findUnique({ where: { id } });
  if (!existing) return { kind: 'not-found' };
  if (isDefaultWorkflowName(existing.name)) return { kind: 'default' };
  const scanCount = await tx.scan.count({ where: { workflowId: id } });
  if (scanCount > 0) return { kind: 'in-use', scanCount };

  await tx.workflow.delete({ where: { id } });
  if (existing.stepIds?.length) {
    await tx.step.deleteMany({ where: { id: { in: existing.stepIds } } });
  }
  return { kind: 'deleted' };
}

// POST /api/workflows — create a new workflow blueprint.
router.post('/', async (req, res, next) => {
  try {
    const valid = validateWorkflow(req.body);
    const workflow = await persistWorkflow(valid);
    res.status(201).json(await assembleWorkflow(workflow));
  } catch (e) {
    next(e);
  }
});

// PUT /api/workflows/:id — replace a workflow's steps + metadata.
router.put('/:id', async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);
    const existing = await prisma.workflow.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Workflow not found.' });
    const valid = validateWorkflow(req.body);
    const result = await prisma.$transaction((tx) => replaceWorkflowIfUnused(tx, id, valid));
    if (result.kind === 'not-found') return res.status(404).json({ error: 'Workflow not found.' });
    if (result.kind === 'in-use') {
      return res.status(409).json(workflowInUseResponse(result.scanCount));
    }

    res.json(await assembleWorkflow(result.workflow));
  } catch (e) {
    next(e);
  }
});

// DELETE /api/workflows/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);
    const result = await prisma.$transaction((tx) => deleteWorkflowIfUnused(tx, id));
    if (result.kind === 'not-found') return res.status(404).json({ error: 'Workflow not found.' });
    if (result.kind === 'default') return res.status(409).json({ error: 'Default workflows cannot be deleted.' });
    if (result.kind === 'in-use') {
      return res.status(409).json({ error: `Cannot delete: ${result.scanCount} scan(s) use this workflow.` });
    }
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
