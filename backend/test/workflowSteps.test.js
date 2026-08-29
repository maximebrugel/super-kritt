import assert from 'node:assert/strict';
import { test } from 'node:test';

import { stepsMatch, workflowStepRows } from '../src/routes/workflows.js';
import { validateWorkflow } from '../src/lib/validation.js';
import { REQUIRED_KEY_TYPES, REQUIRED_VULN_KEYS } from '../src/lib/constants.js';

const terminalFormat = Object.fromEntries(REQUIRED_VULN_KEYS.map((key) => [key, REQUIRED_KEY_TYPES[key]]));

const payload = (overrides = {}) => ({
  name: 'demo',
  description: 'first description',
  levels: [
    {
      depth: 0,
      multiOutput: false,
      outputFormat: { hotspot: 'string' },
      steps: [{ name: 'scan', content: 'Look at {{repo_full}}' }],
    },
    {
      depth: 1,
      multiOutput: true,
      outputFormat: terminalFormat,
      steps: [{ name: 'report', content: 'Report on {{hotspot}}' }],
    },
  ],
  ...overrides,
});

test('a description-only edit leaves the step tree untouched', () => {
  const existing = workflowStepRows(validateWorkflow(payload()));
  const edited = validateWorkflow(payload({ description: 'second description' }));

  assert.equal(stepsMatch(existing, edited), true);
});

test('renaming the workflow leaves the step tree untouched', () => {
  const existing = workflowStepRows(validateWorkflow(payload()));
  const edited = validateWorkflow(payload({ name: 'renamed' }));

  assert.equal(stepsMatch(existing, edited), true);
});

test('editing a prompt, a schema, or the step count is a step change', () => {
  const existing = workflowStepRows(validateWorkflow(payload()));

  const changedPrompt = payload();
  changedPrompt.levels[0].steps[0].content = 'Look somewhere else at {{repo_full}}';
  assert.equal(stepsMatch(existing, validateWorkflow(changedPrompt)), false);

  const changedSchema = payload();
  changedSchema.levels[0].outputFormat = { hotspot: 'array' };
  assert.equal(stepsMatch(existing, validateWorkflow(changedSchema)), false);

  const addedStep = payload();
  addedStep.levels[0].steps.push({ name: 'scan-2', content: 'Also look at {{repo_full}}' });
  assert.equal(stepsMatch(existing, validateWorkflow(addedStep)), false);
});

test('a missing step row never counts as a match', () => {
  const existing = workflowStepRows(validateWorkflow(payload()));
  existing[1] = undefined; // step id present in stepIds but the row is gone

  assert.equal(stepsMatch(existing, validateWorkflow(payload())), false);
});

test('bound steps compare their persisted source ids', () => {
  const valid = {
    maxDepth: 1,
    levels: [
      {
        depth: 0,
        multiOutput: true,
        consumesAll: false,
        outputFormat: { candidate: 'string' },
        steps: [{ clientId: 'source', name: 'scan', content: 'Scan', boundSourceStepId: null }],
      },
      {
        depth: 1,
        multiOutput: false,
        consumesAll: false,
        outputFormat: terminalFormat,
        steps: [{ clientId: 'report', name: 'report', content: 'Report', boundSourceStepId: 'source' }],
      },
    ],
  };
  const existing = workflowStepRows(valid).map((row, index) => ({
    ...row,
    id: BigInt(index + 10),
    boundSourceStepId: index ? 10n : null,
  }));

  assert.equal(stepsMatch(existing, valid), true);
  existing[1].boundSourceStepId = 99n;
  assert.equal(stepsMatch(existing, valid), false);
});
