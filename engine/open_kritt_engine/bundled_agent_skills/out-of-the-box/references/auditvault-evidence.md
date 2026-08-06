# AuditVault evidence per pattern

Representative issues from [AuditVault](https://github.com/Auditware/AuditVault) (`findings/` = audit findings, `hacks/` = rekt.news post-mortems), mapped to the SKILL.md pattern cards. IDs are the numeric file prefixes in `findings/`; hack files are full basenames in `hacks/`. Load this only when you need grounding or citations for a hypothesis — not during initial triage.

## A. Price-source manipulation

- **spot-as-oracle** — findings: 19134, 42333, 27688, 19138, 53326, 55274, 61790, 64079, 64517. hacks: rekt-2020-12-18-warp-finance.md, rekt-2022-06-16-inverse-finance.md, rekt-2024-11-16-polter-finance.md, rekt-2026-02-22-yieldblox.md
- **pool-selection-abuse** — findings: 15978, 44767, 36318
- **twap-window-gaming** — findings: 37168, 40579, 18432, 41031. hacks: rekt-2022-04-02-inverse-finance.md, rekt-2022-04-28-deus-dao.md, rekt-2023-12-13-levana-protocol.md
- **weakest-source-aggregation** — findings: 61790, 55409, 64791
- **lp-mechanics-side-channel** — findings: 54984, 63651, 63650, 62349, 56954
- **read-only-reentrancy** — findings: 18434, 27689. hacks: rekt-2023-01-15-midas-capital.md, rekt-2023-02-09-dforce-network.md, rekt-2023-06-12-sturdy-finance.md, rekt-2023-07-21-conic-finance.md

## B. Oracle integrity & liveness

- **oracle-write-abuse** — findings: 17624, 19293, 35262, 15981, 47982, 57694, 58836, 53998, 63079. hacks: rekt-2023-02-01-bonqdao.md, rekt-2025-04-14-kiloex.md, rekt-2025-04-26-loopscale.md
- **staleness-heartbeat-mismatch** — findings: 61525, 64773, 60244, 59250, 20748, 46890
- **stale-cached-reads** — findings: 58378, 64510, 61618, 55406, 61376, 45459, 47690; async-settlement variants: 56682, 56895, 30901, 57016
- **pull-oracle-multi-price** — findings: 32162, 50882, 55148, 50586
- **oracle-misconfig-harvest** — findings: 31886, 27473. hacks: rekt-2026-02-15-moonwell.md, rekt-2024-07-19-rho-market.md, rekt-2026-03-10-aave.md
- **price-triggered-timing** — findings: 18633, 47709, 28948, 24299

## C. Peg, unit & derivative assumptions

- **hardcoded-peg** — findings: 25379, 38184, 62489, 63045, 62198, 63676. hacks: rekt-2022-05-13-blizz-finance-venus-protocol.md, rekt-2024-09-25-bedrock.md, rekt-2021-10-08-mirror-protocol.md
- **stable-basket-tolerance-arb** — findings: 61771, 56707, 60809
- **derivative-mispricing** — findings: 24316, 24317, 30577, 35123
- **unit-boundary-errors** — findings: 47332, 35122, 19130, 24302, 44357, 51982, 61476, 62663, 62694, 54982, 56752, 13255, 47367, 35943, 12293, 61176, 49882

## D. Share & balance accounting vs token reality

- **donation-share-inflation** — findings: 19124, 48956, 33568, 47447, 30578, 30918, 47356, 62659, 62483, 55653, 64975, 51950, 57914, 57686, 63224, 62715, 64774; empty/zero-liquidity pool states: 61558, 54979, 53241. hacks: rekt-2021-10-27-cream-finance.md, rekt-2022-12-10-lodestar-finance.md, rekt-2023-08-13-zunami-protocol.md, rekt-2026-01-20-makina.md, rekt-2023-04-15-hundred-finance.md, rekt-2024-05-15-sonne-finance.md, rekt-2025-06-25-resupplyfi.md, rekt-2026-03-15-venus-protocol.md
- **raw-balance-vs-ledger** — findings: 61470, 56683, 55502, 16984, 64857, 42394, 55484, 64853, 57015, 63203. hacks: rekt-2021-06-29-merlin-labs-r3kt.md
- **token-mechanics-conflict** — fee-on-transfer: 53803, 55171, 56840; rebase: 27687, 53806, 62662, 58065; callbacks: 59357, 13843; behavior-DoS: 62961, 57917, 43030, 37614, 18109
- **rounding-dust-denominators** — findings: 10416, 57884, 38067, 64955, 53947, 34137, 49176, 46676, 30421, 61563
- **one-directional-accounting** — findings: 64974, 34139, 55051, 13844
- **unclaimed-yield-sandwich** — findings: 27533, 31527

## E. External capital & thresholds

- **temporary-capital-thresholds** — findings: 62255, 59251, 61925, 11317
- **flash-callback-unbound** — findings: 53948, 62012, 28662
- **funded-persistent-manipulation** — hacks: rekt-2022-10-11-mango-markets.md, rekt-2022-10-19-moola-market.md, rekt-2022-04-02-inverse-finance.md, rekt-2023-11-18-dydx.md, rekt-2026-03-15-venus-protocol.md
- **self-liquidation-weaponization** — findings: 30423, 62347, 37522
- **jit-distribution-capture** — findings: 61381, 61375, 58701, 61538

## F. Timing, ordering & multi-step windows

- **missing-real-slippage** — findings: 65583, 62492, 53124, 53521, 12295, 18411, 16039, 61536
- **permissionless-claim-frontrun** — findings: 11319, 28929, 17365, 30496, 57870, 46466
- **mempool-auth-replay** — findings: 55235, 47227, 53233, 54669, 63777, 42064, 35997, 45173, 64973
- **liquidation-evasion** — findings: 27454, 29589, 26268, 53724
- **onbehalf-griefing** — findings: 62777, 44897, 16040, 53725, 19152, 18534, 18537, 12294, 20611, 63075; array-bloat/OOG variants: 20071, 65322, 61229, 46092
- **epoch-boundary-drift** — findings: 62811, 26047, 54981, 19340, 62809, 19339, 19341, 30089; boundary off-by-one: 40684, 55372, 40820
- **two-step-completion** — findings: 57089, 53312
- **cross-system-toctou** — findings: 30899, 36775, 60330, 36000, 21063, 55292
- **chain-liveness-abuse** — findings: 35023, 19465, 64965, 44377, 20616
- **cooldown-penalty-bypass** — findings: 62025, 62027, 65326; slashing-window mismatch: 11320, 11322, 20057

## G. Cross-protocol & integration trust

- **arbitrary-callee** — findings: 64140, 63046, 45407. hacks: rekt-2023-02-17-dexible.md, rekt-2022-10-02-transit-swap.md, rekt-2024-02-28-seneca-protocol.md
- **approval-proxy-drain** — findings: 27528, 53320, 35789, 61458
- **partner-registry-abuse** — findings: 40577, 50077, 18412, 31586. hacks: rekt-2024-09-03-penpie.md, rekt-2021-05-08-rari-capital.md
- **third-party-mechanics-misread** — findings: 24319, 27531, 28314, 18109, 51370, 29874
- **failure-retry-paths** — findings: 50682, 34319, 46494, 32130, 64973, 25506, 30561
- **bridge-endpoint-divergence** — findings: 10707, 29874, 60699, 33298, 56759
- **crosschain-identity** — findings: 29873, 44919, 55538, 61875, 36310. hacks: rekt-2022-06-05-wintermute.md
- **messaging-fee-mismatch** — findings: 30560, 18996, 26048, 32129, 62776
- **collateral-legitimacy** — hacks: rekt-2022-01-28-qubit-finance.md, rekt-2025-02-04-ionic-money.md, rekt-2025-05-28-cork-protocol.md, rekt-2022-12-02-ankr-helio.md
- **privileged-external-actor** — findings: 61865, 44920, 53120, 55236. hacks: rekt-2022-06-23-harmony-bridge.md, rekt-2025-09-08-swissborg.md, rekt-2024-03-26-munchables.md

## H. Economic incentives & solvency

- **liquidation-incentive-failure** — findings: 11563, 37521, 20224, 65201
- **liquidation-denial-lock** — findings: 20020, 26271, 64835, 28207
- **liquidator-solvency-unchecked** — findings: 26269, 26267, 47445
- **reward-accrual-replay** — findings: 44004, 38196, 61236, 46671
- **fee-bypass-path** — findings: 65027, 27744, 62758, 55244
- **value-misdirection** — findings: 63700, 35207, 57871, 11480
- **unenforceable-slashing** — findings: 19466, 52081, 65322
- **self-referential-feedback** — findings: 38003, 20021, 16980
- **loss-socialization-runs** — findings: 63422, 34033, 62756, 57713, 18536, 53329. hacks: rekt-2021-07-30-levyathan.md (buggy emergency withdraw overpaid early exiters — bank-run amplifier)

## I. Governance & operational lifecycle

- **external-voting-power** — findings: 11317, 62255, 62811, 19340, 12157
- **vote-bookkeeping** — findings: 26460, 27981, 61953, 64515
- **proposal-liveness** — findings: 11542, 19347, 61696, 52080
- **config-bounds** — findings: 54670, 57082, 11318, 11320
- **privileged-race-users** — findings: 55455, 50051, 30897, 64014
- **lifecycle-deploy-window** — findings: 37160, 34320, 28036, 61231, 17100, 55465. hacks: rekt-2023-03-28-safemoon.md, rekt-2022-10-27-team-finance.md, rekt-2021-11-25-snowdog.md, rekt-2024-03-21-super-sushi-samurai.md
- **offchain-ui-boundary** — findings: 25912, 22075, 47108, 49485
- **cached-system-of-record** — findings: 10280, 10281, 27981, 17100

## Fork-contagion chains (known-pattern repeats)

- Empty-market theft: Hundred → Sonne → Onyx → Resupply (2h-old market) → Venus (donation bypasses supply cap).
- Read-only reentrancy LP pricing: Midas → dForce → Sturdy → Conic → EraLend (same bug, different integrator, 2022–23).
- Funded oracle manipulation: Inverse ×2, Mango, Moola, dYdX, Venus (9-month accumulation).
- Out-of-scope misses: Conic's new oracle contract, Sturdy's LendingPool version, Makina's vector listed in the audit's exclusion list — scope boundaries and post-audit diffs are audit territory.
