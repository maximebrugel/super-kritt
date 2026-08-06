# out-of-the-box

An agent skill for smart contract auditors: find exploit paths that arise **outside** the immediate codebase — composability, external markets, economic conditions, and protocol integrations.

Locally correct code is routinely unsafe at the system level. This skill expands an auditing agent's threat model beyond the contracts in scope:

- What external systems can influence this protocol?
- Which assumptions fail when the protocol is composed with the wider ecosystem?
- What external capital, liquidity, assets, actors, or market conditions could an attacker use?
- Can a locally correct implementation still be unsafe at the system level?

## Contents

```
SKILL.md                          the skill — this is what the agent loads
references/
  auditvault-evidence.md          pattern → representative AuditVault issue IDs (grounding/citations)
  exploit-playbooks.md            11 real-world exploit archetypes from confirmed-loss hacks
```

The skill provides:

- **64 externality/composability patterns in 9 clusters** — price-source manipulation, oracle integrity & liveness, peg/unit/derivative assumptions, share & balance accounting vs token reality, external capital & thresholds, timing/ordering/multi-step windows, cross-protocol & integration trust, economic incentives & solvency, governance & operational lifecycle. Each pattern gives: the assumption to challenge, relevance signals, audit questions, and generic attack paths to test.
- **10 mental-model rules** — e.g. "capital is not a security parameter", "the protocol is its own exit liquidity", "rational inaction breaks protocols".
- **An 8-step audit workflow** — dependency inventory → value decision points → cross-product challenge → hypothesis generation → 6-axis assessment → lifecycle review → attacking the defenses → write-up with preconditions.
- **A hypothesis assessment rubric** — protocol impact, attacker profitability, capital required, privileges required, external preconditions, atomic vs non-atomic execution.
- **A 20-item final checklist.**

Example patterns: `spot-as-oracle`, `donation-share-inflation`, `temporary-capital-thresholds`, `funded-persistent-manipulation`, `read-only-reentrancy`, `oracle-misconfig-harvest`, `partner-registry-abuse`, `liquidation-incentive-failure`, `epoch-boundary-drift`, `lifecycle-deploy-window`.

## Usage

Standard agent-skill format (YAML frontmatter with `name`/`description`, markdown body, `references/` for progressive disclosure). Clone it into your agent's skills directory:

```bash
# user scope
git clone git@github.com:maximebrugel/out-of-the-box.git ~/.claude/skills/out-of-the-box

# project scope
git clone git@github.com:maximebrugel/out-of-the-box.git .claude/skills/out-of-the-box
```

The agent loads `SKILL.md` when an audit starts; the `references/` files stay on disk and are read only when grounding or citations are needed, keeping the working context clean.

## Methodology

Grounded in [AuditVault](https://github.com/Auditware/AuditVault) — 2,383 HIGH/CRITICAL audit findings and 293 confirmed-loss hack post-mortems — analyzed across seven perspectives: economic attacks, oracle/pricing, liquidity/leverage, cross-protocol composability, token/accounting behavior, timing/ordering, and external integrations. Recurring reasoning patterns were extracted, deduplicated, and generalized into the taxonomy; every pattern maps back to representative real issues in `references/auditvault-evidence.md`.

## License

[MIT](LICENSE)
