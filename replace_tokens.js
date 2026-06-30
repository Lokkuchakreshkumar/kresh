const fs = require('fs');
const glob = require('glob');

const files = [
  '/home/chakresh/projects/Kresh/src/app/(auth)/signin/page.js',
  '/home/chakresh/projects/Kresh/src/app/(auth)/signup/page.js',
  '/home/chakresh/projects/Kresh/src/app/dashboard/publish/page.js',
  '/home/chakresh/projects/Kresh/src/app/dashboard/publish/PublishSkillForm.jsx'
];

const replacements = [
  ['bg-background', 'bg-[var(--background-100)]'],
  ['text-foreground', 'text-[var(--primary)]'],
  ['text-text-secondary', 'text-[var(--gray-700)]'],
  ['text-text-primary', 'text-[var(--primary)]'],
  ['border-white/5', 'border-[var(--gray-200)]'],
  ['border-white/10', 'border-[var(--gray-200)]'],
  ['bg-white/5', 'bg-[var(--gray-100)]'],
  ['bg-white/10', 'bg-[var(--gray-200)]'],
  ['glass', 'bg-[var(--background-100)] border-[var(--gray-400)] shadow-card'],
  ['bg-white/\\[0\\.01\\]', 'bg-[var(--background-100)]'],
  ['bg-white/\\[0\\.02\\]', 'bg-[var(--gray-100)]'],
  ['text-kresh-green', 'text-[var(--blue-700)]'],
  ['bg-kresh-green/10', 'bg-[var(--blue-100)]'],
  ['bg-kresh-green/5', 'bg-[var(--blue-100)]'],
  ['bg-kresh-green/3', 'bg-[var(--blue-100)]'],
  ['bg-kresh-green', 'bg-[var(--blue-700)]'],
  ['border-kresh-green/20', 'border-[var(--blue-200)]'],
  ['border-kresh-green/30', 'border-[var(--blue-300)]'],
  ['border-kresh-green', 'border-[var(--blue-700)]'],
  ['border-border-color', 'border-[var(--gray-400)]'],
  ['bg-text-primary', 'bg-[var(--gray-1000)]'],
  ['text-background', 'text-[var(--background-100)]'],
  ['bg-black/40', 'bg-[var(--background-100)]'],
  ['selection:bg-kresh-green/30', 'selection:bg-[var(--blue-200)]'],
  ['border-text-primary', 'border-[var(--gray-1000)]']
];

files.forEach(path => {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    
    // special cases
    content = content.replace(/<Glass/g, '<div');
    content = content.replace(/<\/Glass>/g, '</div>');
    content = content.replace(/<GlassCard/g, '<div');
    content = content.replace(/<\/GlassCard>/g, '</div>');
    
    replacements.forEach(([from, to]) => {
      content = content.replace(new RegExp(from, 'g'), to);
    });
    fs.writeFileSync(path, content, 'utf8');
  }
});
