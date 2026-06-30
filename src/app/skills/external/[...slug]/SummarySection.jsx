import { MarkdownRenderer } from '@/app/skills/[...slug]/components/MarkdownRenderer';

export function SummarySection({ summary }) {
  if (!summary) return null;
  return (
    <section className="mt-8 rounded border border-[var(--gray-400)] bg-[var(--gray-100)] p-6">
      <h2 className="text-xs font-bold uppercase tracking-wide text-[var(--gray-700)]">Summary</h2>
      <div className="mt-4 text-sm leading-7 text-[var(--gray-700)]">
        <MarkdownRenderer content={summary} />
      </div>
    </section>
  );
}
