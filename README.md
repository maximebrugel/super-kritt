# super·kritt

A fork of [open·kritt](https://github.com/Kritt-ai/open-kritt) — an open-source,
self-hosted security research platform that orchestrates AI agents to find real
vulnerabilities in code — with custom changes.

For full documentation, setup instructions, and project details, see the
[upstream open·kritt README](https://github.com/Kritt-ai/open-kritt#readme).

## Custom features in super-kritt

- **Kimi (Moonshot AI) model provider** — Kimi plan models (K3, K3-256k,
  K2.7 Coding) can be selected in scans and AI generation. Set `KIMI_API_KEY`
  (from the [Kimi Code console](https://www.kimi.com/code/console)) in `.env`
  or add the key from the Accounts page.
- **Two Kimi harnesses** — Kimi runs through Claude Code rerouted to Kimi's
  Anthropic-compatible endpoint (default), or natively through the Kimi Code
  CLI by picking the `kimi-code` harness in the model configuration.

## License

[AGPL-3.0](LICENSE), same as upstream.
