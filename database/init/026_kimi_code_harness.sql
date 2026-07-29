-- Allow the Kimi Code CLI harness for the Kimi plan provider in queued generations.

ALTER TABLE public.generations
    DROP CONSTRAINT IF EXISTS generations_harness_check;
ALTER TABLE public.generations
    ADD CONSTRAINT generations_harness_check
    CHECK (harness IN ('codex', 'claude-code', 'kimi-code'));

ALTER TABLE public.generations
    DROP CONSTRAINT IF EXISTS generations_check;
ALTER TABLE public.generations
    ADD CONSTRAINT generations_check
    CHECK (
        (model_provider = 'codex' AND harness = 'codex') OR
        (model_provider = 'claude' AND harness = 'claude-code') OR
        (model_provider = 'kimi' AND harness IN ('claude-code', 'kimi-code')) OR
        model_provider = 'openrouter'
    );
