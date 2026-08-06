# Releasing super·kritt

super·kritt ships as one product with one version number. Automated releases are
disabled in this fork.

## Versioning

[`VERSION`](VERSION) is the source of truth. The frontend, backend, and engine versions
must match it; CI verifies this with:

```bash
node scripts/sync-version.mjs --check
```

The trailing `x-release-please-version` marker in `VERSION` is retained for easier
upstream synchronization but does not enable release automation.

## Manual release

1. Update `VERSION`, keeping its marker, then run `node scripts/sync-version.mjs`.
2. Update `CHANGELOG.md` and run the full component checks.
3. Commit with `git commit -s -m "chore: release X.Y.Z"`.
4. Create and push the tag with `git tag vX.Y.Z && git push origin vX.Y.Z`.

CI runs for pull requests and pushes to `main`. There is no release workflow and no
container publishing step.
