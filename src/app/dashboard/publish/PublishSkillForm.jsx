'use client';

import React, { useActionState, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Glass } from '@/components/ui/Glass';
import { Loader2 } from 'lucide-react';
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
              className="w-full rounded-lg border border-border-color bg-text-primary/5 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/50 focus:border-text-primary/30"
            />
            {isEditMode && (
              <p className="text-[10px] text-text-secondary/80">Title can be updated, but the slug remains unchanged.</p>
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
              <option value="AGENT.md/CLAUDE.md">AGENT.md/CLAUDE.md</option>
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
          <legend className="text-xs font-semibold uppercase text-text-secondary">Publish Method</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border p-5 text-center transition-all duration-200 ${
              source === 'editor'
                ? 'border-white bg-white/10 text-text-primary shadow-lg shadow-white/5'
                : 'border-border-color bg-text-primary/5 text-text-secondary hover:border-white/10'
            }`}>
              <span className="text-sm font-bold">Write SKILL.md</span>
              <span className="mt-1 text-[10px] text-text-secondary/80">Use the built-in editor</span>
              <input
                type="radio"
                name="source"
                value="editor"
                checked={source === 'editor'}
                onChange={handleSourceChange}
                className="mt-3 accent-white"
              />
            </label>
            <label className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border p-5 text-center transition-all duration-200 ${
              source === 'upload'
                ? 'border-white bg-white/10 text-text-primary shadow-lg shadow-white/5'
                : 'border-border-color bg-text-primary/5 text-text-secondary hover:border-white/10'
            }`}>
              <span className="text-sm font-bold">Upload SKILL.md File</span>
              <span className="mt-1 text-[10px] text-text-secondary/80">Select a single markdown file</span>
              <input
                type="radio"
                name="source"
                value="upload"
                checked={source === 'upload'}
                onChange={handleSourceChange}
                className="mt-3 accent-white"
              />
            </label>
            <label className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border p-5 text-center transition-all duration-200 ${
              source === 'folder'
                ? 'border-white bg-white/10 text-text-primary shadow-lg shadow-white/5'
                : 'border-border-color bg-text-primary/5 text-text-secondary hover:border-white/10'
            }`}>
              <span className="text-sm font-bold">Upload Skill Folder</span>
              <span className="mt-1 text-[10px] text-text-secondary/80">Select a folder with multiple files</span>
              <input
                type="radio"
                name="source"
                value="folder"
                checked={source === 'folder'}
                onChange={handleSourceChange}
                className="mt-3 accent-white"
              />
            </label>
          </div>
        </fieldset>

        {source === 'editor' && (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-text-secondary">SKILL.md</label>
            <textarea
              name="skillMarkdown"
              rows="18"
              defaultValue={initialSkill ? initialSkill.markdown : defaultMarkdown}
              className="min-h-[420px] w-full resize-y rounded-lg border border-border-color bg-text-primary/5 px-4 py-4 font-mono text-sm leading-6 text-text-primary outline-none transition-colors focus:border-text-primary/30"
            />
          </div>
        )}

        {source === 'upload' && (
          <div className="space-y-2 rounded-lg border border-border-color bg-text-primary/5 p-4">
            <label className="text-xs font-semibold uppercase text-text-secondary">Upload markdown</label>
            <input
              name="skillFile"
              type="file"
              accept=".md,text/markdown,text/plain"
              className="block w-full cursor-pointer rounded-lg border border-border-color bg-text-primary/5 text-sm text-text-secondary file:mr-4 file:border-0 file:bg-text-primary file:px-4 file:py-3 file:text-sm file:font-semibold file:text-background"
            />
            <p className="text-xs leading-5 text-text-secondary mt-1">
              Upload the skill instructions as Markdown. The registry stores it as `SKILL.md`.
            </p>
          </div>
        )}

        {source === 'folder' && (
          <div className="space-y-2 rounded-lg border border-border-color bg-text-primary/5 p-4">
            <label className="text-xs font-semibold uppercase text-text-secondary">Upload skill folder</label>
            <input
              name="skillFolder"
              type="file"
              webkitdirectory=""
              directory=""
              multiple
              className="block w-full cursor-pointer rounded-lg border border-border-color bg-text-primary/5 text-sm text-text-secondary file:mr-4 file:border-0 file:bg-text-primary file:px-4 file:py-3 file:text-sm file:font-semibold file:text-background"
            />
            <p className="text-xs leading-5 text-text-secondary mt-1">
              Select a folder. The registry will upload all files inside it. A `SKILL.md` file is required.
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
          className="w-full rounded-lg py-3 disabled:cursor-not-allowed disabled:opacity-50 gap-2 flex"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? 'Publishing...' : isEditMode ? 'Publish new version' : 'Publish skill'}
        </Button>
      </form>
    </Glass>
  );
}
