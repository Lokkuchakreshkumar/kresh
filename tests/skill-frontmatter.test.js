import test from 'node:test';
import assert from 'node:assert/strict';
import { readFrontmatterDescription } from '../src/lib/skillFrontmatter.js';

test('reads inline quoted frontmatter descriptions', () => {
  const contents = `---
name: controlnet-pose
description: "Pose-conditioned generation on RunComfy via the runcomfy CLI."
---
# ControlNet`;
  assert.equal(
    readFrontmatterDescription(contents),
    'Pose-conditioned generation on RunComfy via the runcomfy CLI.'
  );
});

test('reads folded block scalar frontmatter descriptions', () => {
  const contents = `---
name: controlnet-pose
description: >-
  Pose-conditioned generation on RunComfy via the runcomfy CLI.
  Routes across Kling 2-6 Motion Control Pro.
---
# ControlNet`;
  assert.match(readFrontmatterDescription(contents), /Pose-conditioned generation on RunComfy/);
  assert.match(readFrontmatterDescription(contents), /Kling 2-6 Motion Control Pro/);
});
