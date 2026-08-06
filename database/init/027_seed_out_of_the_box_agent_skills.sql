INSERT INTO public.agent_skills (slug, name, description, content, source_url, license_spdx, attribution)
SELECT
    'out-of-the-box',
    'Out of the Box',
    'Complete smart-contract audit skill for externality, economic, and composability threats beyond the immediate codebase.',
    $skill$
Apply the complete installed `out-of-the-box` skill. Before auditing, read `../out-of-the-box/SKILL.md` and every file it references under `../out-of-the-box/references/`.

The installed bundle is a byte-for-byte copy of the upstream skill, references, README, and MIT license at commit ca23df217bc12d462e3f1bd872bd87a443460107.
$skill$,
    'https://github.com/maximebrugel/out-of-the-box/blob/ca23df217bc12d462e3f1bd872bd87a443460107/SKILL.md',
    'MIT',
    'Vendored from maximebrugel/out-of-the-box at commit ca23df217bc12d462e3f1bd872bd87a443460107.'
WHERE NOT EXISTS (SELECT 1 FROM public.agent_skills WHERE slug = 'out-of-the-box');

UPDATE public.agent_skills
SET
    name = 'Out of the Box',
    description = 'Complete smart-contract audit skill for externality, economic, and composability threats beyond the immediate codebase.',
    content = $skill$
Apply the complete installed `out-of-the-box` skill. Before auditing, read `../out-of-the-box/SKILL.md` and every file it references under `../out-of-the-box/references/`.

The installed bundle is a byte-for-byte copy of the upstream skill, references, README, and MIT license at commit ca23df217bc12d462e3f1bd872bd87a443460107.
$skill$,
    source_url = 'https://github.com/maximebrugel/out-of-the-box/blob/ca23df217bc12d462e3f1bd872bd87a443460107/SKILL.md',
    license_spdx = 'MIT',
    attribution = 'Vendored from maximebrugel/out-of-the-box at commit ca23df217bc12d462e3f1bd872bd87a443460107.',
    updated_at = now()
WHERE slug = 'out-of-the-box'
  AND source_url = 'https://github.com/maximebrugel/out-of-the-box/blob/main/SKILL.md'
  AND attribution IN (
      'References maximebrugel/out-of-the-box metadata, concise bridge text only.',
      'References maximebrugel/out-of-the-box metadata. Concise original bridge text only because the upstream license is not declared.'
  );
