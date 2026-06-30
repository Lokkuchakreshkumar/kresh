const fs = require('fs');
const glob = require('glob');

const files = [
  ...glob.sync('/home/chakresh/projects/Kresh/src/app/docs/**/*.js'),
  ...glob.sync('/home/chakresh/projects/Kresh/src/components/docs/**/*.jsx')
];

const replacements = [
  ['bg-geist-bg-100', 'bg-[var(--background-100)]'],
  ['bg-geist-bg-200', 'bg-[var(--background-200)]'],
  ['bg-geist-gray-100', 'bg-[var(--gray-100)]'],
  ['bg-geist-gray-200', 'bg-[var(--gray-200)]'],
  ['text-geist-gray-1000', 'text-[var(--primary)]'],
  ['text-geist-gray-900', 'text-[var(--gray-900)]'],
  ['text-geist-gray-800', 'text-[var(--gray-800)]'],
  ['text-geist-gray-700', 'text-[var(--gray-700)]'],
  ['text-geist-gray-400', 'text-[var(--gray-400)]'],
  ['border-geist-gray-200', 'border-[var(--gray-400)]'],
  ['border-geist-gray-100', 'border-[var(--gray-200)]'],
  ['text-geist-blue-700', 'text-[var(--blue-700)]'],
  ['bg-geist-blue-700/20', 'bg-[var(--blue-200)]'],
  ['selection:bg-geist-blue-700/20', 'selection:bg-[var(--blue-200)]'],
];

files.forEach(path => {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    
    replacements.forEach(([from, to]) => {
      content = content.replace(new RegExp(from, 'g'), to);
    });
    fs.writeFileSync(path, content, 'utf8');
  }
});
