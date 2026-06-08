'use client';

import React, { useActionState, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Glass } from '@/components/ui/Glass';
import { createSkillAction } from '../actions';

/**
 * Suggests a simple patch version bump based on the current version.
 *
 * @param {string} v Current version string
 * @returns {string} Suggested next version
 */
function getSuggestedVersion(v) {
  if (!v) return '1.0.1';
  try {
    const parts = v.split('.');
    if (parts.length === 3) {
      const patch = parseInt(parts[2], 10);
      if (!isNaN(patch)) {
        return `${parts[0]}.${parts[1]}.${patch + 1}`;
      }
    }
  } catch (e) {
    console.error('Failed to parse version bump suggestion:', e);
  }
  return v;
}

export function PublishSkillForm({ defaultMarkdown, initialSkill }) {
  const [state, formAction, isPending] = useActionState(createSkillAction, null);
  const [source, setSource] = useState('editor');

  const handleSourceChange = (event) => {
    try {
      setSource(event.target.value);
    } catch (error) {
      console.error('Failed to switch publish source:', error);
    }
  };

  const isEditMode = !!initialSkill;
  const suggestedVersion = isEditMode ? getSuggestedVersion(initialSkill.version) : '1.0.0';

  return (
    <Glass className="border-white/10 bg-white/[0.02] p-6 sm:p-8">
      <form action={formAction} className="space-y-8">
        {/* Hidden inputs to pass skillId and edit mode indicator */}
        {isEditMode && <input type="hidden" name="skillId" value={initialSkill.id} />}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-text-secondary">Skill name</label>
            <input
              name="name"
              type="text"
              required
              maxLength={120}
              placeholder="senior-engineer"
              defaultValue={initialSkill ? initialSkill.name : ''}
              readOnly={isEditMode}
              className={`w-full rounded-lg border border-border-color bg-text-primary/5 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/50 focus:border-text-primary/30 ${
                isEditMode ? 'opacity-60 cursor-not-allowed select-none' : ''
              }`}
            />
            {isEditMode && (
              <p className="text-[10px] text-text-secondary/80">Skill name and slug cannot be altered after publication.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-text-secondary">Version</label>
            <input
              name="version"
              type="text"
              defaultValue={suggestedVersion}
              required
              placeholder="1.0.0"
              className="w-full rounded-lg border border-border-color bg-text-primary/5 px-4 py-3 font-mono text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/50 focus:border-text-primary/30"
            />
            {isEditMode && (
              <p className="text-[10px] text-text-secondary/80">Current version in registry is v{initialSkill.version}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-text-secondary">Category</label>
            <select
              name="category"
              defaultValue={initialSkill ? initialSkill.category : 'Skills'}
              className="w-full rounded-lg border border-border-color bg-text-primary/5 px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-text-primary/30 [&>option]:bg-background [&>option]:text-text-primary"
            >
              <option value="Skills">Skills</option>
              <option value="Agents">Agents</option>
              <option value="Workflows">Workflows</option>
              <option value="Design Systems">Design Systems</option>
              <option value="Thinking Styles">Thinking Styles</option>
              <option value="Writing Styles">Writing Styles</option>
              <option value="Engineering Practices">Engineering Practices</option>
              <option value="Personalities">Personalities</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-text-secondary">Changelog</label>
            <input
              name="changelog"
              type="text"
              placeholder={isEditMode ? 'Describe what changed in this version' : 'Initial publish'}
              className="w-full rounded-lg border border-border-color bg-text-primary/5 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/50 focus:border-text-primary/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-text-secondary">Visibility</label>
            <select
              name="visibility"
              defaultValue={initialSkill ? initialSkill.visibility : 'public'}
              className="w-full rounded-lg border border-border-color bg-text-primary/5 px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-text-primary/30 [&>option]:bg-background [&>option]:text-text-primary"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-text-secondary">Description</label>
          <textarea
            name="description"
            rows="3"
            defaultValue={initialSkill ? initialSkill.description : ''}
            placeholder="What capability does this skill install?"
            className="w-full resize-none rounded-lg border border-border-color bg-text-primary/5 px-4 py-3 text-sm leading-6 text-text-primary outline-none transition-colors placeholder:text-text-secondary/50 focus:border-text-primary/30"
          />
        </div>

        <fieldset className="space-y-4">
          <legend className="text-xs font-semibold uppercase text-text-secondary">SKILL.md source</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border-color bg-text-primary/5 px-4 py-3 text-sm text-text-primary">
              <span>Write SKILL.md</span>
              <input
                type="radio"
                name="source"
                value="editor"
                checked={source === 'editor'}
                onChange={handleSourceChange}
                className="accent-white"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border-color bg-text-primary/5 px-4 py-3 text-sm text-text-primary">
              <span>Upload SKILL.md</span>
              <input
                type="radio"
                name="source"
                value="upload"
                checked={source === 'upload'}
                onChange={handleSourceChange}
                className="accent-white"
              />
            </label>
          </div>
        </fieldset>

        {source === 'editor' ? (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-text-secondary">SKILL.md</label>
            <textarea
              name="skillMarkdown"
              rows="18"
              defaultValue={initialSkill ? initialSkill.markdown : defaultMarkdown}
              className="min-h-[420px] w-full resize-y rounded-lg border border-border-color bg-text-primary/5 px-4 py-4 font-mono text-sm leading-6 text-text-primary outline-none transition-colors focus:border-text-primary/30"
            />
          </div>
        ) : (
          <div className="space-y-2 rounded-lg border border-border-color bg-text-primary/5 p-4">
            <label className="text-xs font-semibold uppercase text-text-secondary">Upload markdown</label>
            <input
              name="skillFile"
              type="file"
              accept=".md,text/markdown,text/plain"
              className="block w-full cursor-pointer rounded-lg border border-border-color bg-text-primary/5 text-sm text-text-secondary file:mr-4 file:border-0 file:bg-text-primary file:px-4 file:py-3 file:text-sm file:font-semibold file:text-background"
            />
            <p className="text-xs leading-5 text-text-secondary">
              Upload the skill instructions as Markdown. The registry stores it as `SKILL.md`.
            </p>
          </div>
        )}

        {state?.error && (
          <div className="rounded-lg border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-300">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="rounded-lg border border-border-color bg-text-primary/5 p-3 text-sm text-text-primary">
            <div>{state.success}</div>
            {state.installCommand && (
              <div className="mt-2 select-all font-mono text-xs text-text-secondary">
                {state.installCommand}
              </div>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg py-3 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Publishing...' : isEditMode ? 'Publish new version' : 'Publish skill'}
        </Button>
      </form>
    </Glass>
  );
}
