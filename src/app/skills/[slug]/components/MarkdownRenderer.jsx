import React from 'react';

function flushParagraph(blocks, paragraph, key) {
  if (paragraph.length === 0) {
    return key;
  }

  blocks.push(
    <p key={`p-${key}`} className="text-sm leading-7 text-text-secondary">
      {paragraph.join(' ')}
    </p>
  );

  paragraph.length = 0;
  return key + 1;
}

function flushList(blocks, listItems, key) {
  if (listItems.length === 0) {
    return key;
  }

  blocks.push(
    <ul key={`ul-${key}`} className="space-y-2 pl-5 text-sm leading-7 text-text-secondary">
      {listItems.map((item, index) => (
        <li key={`${key}-${index}`} className="list-disc">
          {item}
        </li>
      ))}
    </ul>
  );

  listItems.length = 0;
  return key + 1;
}

function flushCode(blocks, codeLines, key) {
  blocks.push(
    <pre key={`code-${key}`} className="overflow-x-auto rounded-lg border border-border-color bg-text-primary/5 p-4 text-xs leading-6 text-text-primary">
      <code>{codeLines.join('\n')}</code>
    </pre>
  );

  codeLines.length = 0;
  return key + 1;
}

export function MarkdownRenderer({ content }) {
  const blocks = [];
  const paragraph = [];
  const listItems = [];
  const codeLines = [];
  let inCode = false;
  let key = 0;

  const lines = String(content || '').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCode) {
        key = flushCode(blocks, codeLines, key);
        inCode = false;
      } else {
        key = flushParagraph(blocks, paragraph, key);
        key = flushList(blocks, listItems, key);
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!trimmed) {
      key = flushParagraph(blocks, paragraph, key);
      key = flushList(blocks, listItems, key);
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      key = flushParagraph(blocks, paragraph, key);
      key = flushList(blocks, listItems, key);

      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const className = level === 1
        ? 'text-3xl font-black text-text-primary'
        : level === 2
          ? 'text-xl font-bold text-text-primary'
          : 'text-base font-bold text-text-primary';

      const HeadingTag = `h${level}`;
      blocks.push(
        <HeadingTag key={`h-${key}`} className={className}>
          {text}
        </HeadingTag>
      );
      key += 1;
      continue;
    }

    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
    const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (bulletMatch || numberedMatch) {
      key = flushParagraph(blocks, paragraph, key);
      listItems.push((bulletMatch || numberedMatch)[1]);
      continue;
    }

    const quoteMatch = trimmed.match(/^>\s?(.+)$/);
    if (quoteMatch) {
      key = flushParagraph(blocks, paragraph, key);
      key = flushList(blocks, listItems, key);
      blocks.push(
        <blockquote key={`q-${key}`} className="border-l border-border-color pl-4 text-sm leading-7 text-text-secondary">
          {quoteMatch[1]}
        </blockquote>
      );
      key += 1;
      continue;
    }

    paragraph.push(trimmed);
  }

  key = flushParagraph(blocks, paragraph, key);
  key = flushList(blocks, listItems, key);

  if (inCode || codeLines.length > 0) {
    flushCode(blocks, codeLines, key);
  }

  return <div className="space-y-6">{blocks}</div>;
}
