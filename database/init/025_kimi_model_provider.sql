-- Allow the Kimi plan provider (claude-code harness) in queued generations.

ALTER TABLE public.generations
    DROP CONSTRAINT IF EXISTS generations_model_provider_check;
ALTER TABLE public.generations
    ADD CONSTRAINT generations_model_provider_check
    CHECK (model_provider IN ('codex', 'claude', 'kimi', 'openrouter'));

ALTER TABLE public.generations
    DROP CONSTRAINT IF EXISTS generations_check;
ALTER TABLE public.generations
    ADD CONSTRAINT generations_check
    CHECK (
        (model_provider = 'codex' AND harness = 'codex') OR
        (model_provider = 'claude' AND harness = 'claude-code') OR
        (model_provider = 'kimi' AND harness = 'claude-code') OR
        model_provider = 'openrouter'
    );
