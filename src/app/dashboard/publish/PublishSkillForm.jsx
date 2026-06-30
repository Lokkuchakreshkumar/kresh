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
    <div className="border-[var(--gray-200)] bg-[var(--gray-100)] p-6 sm:p-8">
      <form action={(formData) => {
        if (source === 'folder') {
          const input = document.querySelector('input[name="skillFolder"]');
          if (input && input.files && input.files.length > 0) {
            formData.delete('skillFolder');
            for (let i = 0; i < input.files.length; i++) {
              const file = input.files[i];
              formData.append('skillFolder', file);
              formData.append('skillFolderPaths', file.webkitRelativePath || file.name);
            }
          }
        }
        formAction(formData);
      }} className="space-y-8">
        {/* Hidden inputs to pass skillId and edit mode indicator */}
        {isEditMode && <input type="hidden" name="skillId" value={initialSkill.id} />}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-[var(--gray-700)]">Skill name</label>
            <input
              name="name"
              type="text"
              required
              maxLength={120}
              placeholder="senior-engineer"
              defaultValue={initialSkill ? initialSkill.name : ''}
              className="w-full rounded-lg border border-[var(--gray-400)] bg-[var(--gray-1000)]/5 px-4 py-3 text-sm text-[var(--primary)] outline-none transition-colors placeholder:text-[var(--gray-700)]/50 focus:border-[var(--gray-1000)]/30"
            />
            {isEditMode && (
              <p className="text-[10px] text-[var(--gray-700)]/80">Title can be updated, but the slug remains unchanged.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-[var(--gray-700)]">Version</label>
            <input
              name="version"
              type="text"
              defaultValue={suggestedVersion}
              required
              placeholder="1.0.0"
              className="w-full rounded-lg border border-[var(--gray-400)] bg-[var(--gray-1000)]/5 px-4 py-3 font-mono text-sm text-[var(--primary)] outline-none transition-colors placeholder:text-[var(--gray-700)]/50 focus:border-[var(--gray-1000)]/30"
            />
            {isEditMode && (
              <p className="text-[10px] text-[var(--gray-700)]/80">Current version in registry is v{initialSkill.version}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-[var(--gray-700)]">Category</label>
            <select
              name="category"
              defaultValue={initialSkill ? initialSkill.category : 'Skills'}
              className="w-full rounded-lg border border-[var(--gray-400)] bg-[var(--gray-1000)]/5 px-4 py-3 text-sm text-[var(--primary)] outline-none transition-colors focus:border-[var(--gray-1000)]/30 [&>option]:bg-[var(--background-100)] [&>option]:text-[var(--primary)]"
            >
              <option value="Skills">Skills</option>
              <option value="AGENTS.md/CLAUDE.md">AGENTS.md/CLAUDE.md</option>
              <option value="Design.md">Design.md</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-[var(--gray-700)]">Changelog</label>
            <input
              name="changelog"
              type="text"
              placeholder={isEditMode ? 'Describe what changed in this version' : 'Initial publish'}
              className="w-full rounded-lg border border-[var(--gray-400)] bg-[var(--gray-1000)]/5 px-4 py-3 text-sm text-[var(--primary)] outline-none transition-colors placeholder:text-[var(--gray-700)]/50 focus:border-[var(--gray-1000)]/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-[var(--gray-700)]">Visibility</label>
            <select
              name="visibility"
              defaultValue={initialSkill ? initialSkill.visibility : 'public'}
              className="w-full rounded-lg border border-[var(--gray-400)] bg-[var(--gray-1000)]/5 px-4 py-3 text-sm text-[var(--primary)] outline-none transition-colors focus:border-[var(--gray-1000)]/30 [&>option]:bg-[var(--background-100)] [&>option]:text-[var(--primary)]"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-[var(--gray-700)]">Description</label>
          <textarea
            name="description"
            rows="3"
            defaultValue={initialSkill ? initialSkill.description : ''}
            placeholder="What capability does this skill install?"
            className="w-full resize-none rounded-lg border border-[var(--gray-400)] bg-[var(--gray-1000)]/5 px-4 py-3 text-sm leading-6 text-[var(--primary)] outline-none transition-colors placeholder:text-[var(--gray-700)]/50 focus:border-[var(--gray-1000)]/30"
          />
        </div>

        <fieldset className="space-y-4">
          <legend className="text-xs font-semibold uppercase text-[var(--gray-700)]">Publish Method</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border p-5 text-center transition-all duration-200 ${
              source === 'editor'
                ? 'border-white bg-[var(--gray-200)] text-[var(--primary)] shadow-lg shadow-white/5'
                : 'border-[var(--gray-400)] bg-[var(--gray-1000)]/5 text-[var(--gray-700)] hover:border-[var(--gray-200)]'
            }`}>
              <span className="text-sm font-bold">Write SKILL.md</span>
              <span className="mt-1 text-[10px] text-[var(--gray-700)]/80">Use the built-in editor</span>
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
                ? 'border-white bg-[var(--gray-200)] text-[var(--primary)] shadow-lg shadow-white/5'
                : 'border-[var(--gray-400)] bg-[var(--gray-1000)]/5 text-[var(--gray-700)] hover:border-[var(--gray-200)]'
            }`}>
              <span className="text-sm font-bold">Upload SKILL.md File</span>
              <span className="mt-1 text-[10px] text-[var(--gray-700)]/80">Select a single markdown file</span>
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
                ? 'border-white bg-[var(--gray-200)] text-[var(--primary)] shadow-lg shadow-white/5'
                : 'border-[var(--gray-400)] bg-[var(--gray-1000)]/5 text-[var(--gray-700)] hover:border-[var(--gray-200)]'
            }`}>
              <span className="text-sm font-bold">Upload Skill Folder</span>
              <span className="mt-1 text-[10px] text-[var(--gray-700)]/80">Select a folder with multiple files</span>
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
            <label className="text-xs font-semibold uppercase text-[var(--gray-700)]">SKILL.md</label>
            <textarea
              name="skillMarkdown"
              rows="18"
              defaultValue={initialSkill ? initialSkill.markdown : defaultMarkdown}
              className="min-h-[420px] w-full resize-y rounded-lg border border-[var(--gray-400)] bg-[var(--gray-1000)]/5 px-4 py-4 font-mono text-sm leading-6 text-[var(--primary)] outline-none transition-colors focus:border-[var(--gray-1000)]/30"
            />
          </div>
        )}

        {source === 'upload' && (
          <div className="space-y-2 rounded-lg border border-[var(--gray-400)] bg-[var(--gray-1000)]/5 p-4">
            <label className="text-xs font-semibold uppercase text-[var(--gray-700)]">Upload markdown</label>
            <input
              name="skillFile"
              type="file"
              accept=".md,text/markdown,text/plain"
              className="block w-full cursor-pointer rounded-lg border border-[var(--gray-400)] bg-[var(--gray-1000)]/5 text-sm text-[var(--gray-700)] file:mr-4 file:border-0 file:bg-[var(--gray-1000)] file:px-4 file:py-3 file:text-sm file:font-semibold file:text-[var(--background-100)]"
            />
            <p className="text-xs leading-5 text-[var(--gray-700)] mt-1">
              Upload the skill instructions as Markdown. The registry stores it as `SKILL.md`.
            </p>
          </div>
        )}

        {source === 'folder' && (
          <div className="space-y-2 rounded-lg border border-[var(--gray-400)] bg-[var(--gray-1000)]/5 p-4">
            <label className="text-xs font-semibold uppercase text-[var(--gray-700)]">Upload skill folder</label>
            <input
              name="skillFolder"
              type="file"
              webkitdirectory=""
              directory=""
              multiple
              className="block w-full cursor-pointer rounded-lg border border-[var(--gray-400)] bg-[var(--gray-1000)]/5 text-sm text-[var(--gray-700)] file:mr-4 file:border-0 file:bg-[var(--gray-1000)] file:px-4 file:py-3 file:text-sm file:font-semibold file:text-[var(--background-100)]"
            />
            <p className="text-xs leading-5 text-[var(--gray-700)] mt-1">
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
          <div className="rounded-lg border border-[var(--gray-400)] bg-[var(--gray-1000)]/5 p-3 text-sm text-[var(--primary)]">
            <div>{state.success}</div>
            {state.installCommand && (
              <div className="mt-2 select-all font-mono text-xs text-[var(--gray-700)]">
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
    </div>
  );
}
