const fs = require('fs');

const fixes = [
  {
    file: '/home/chakresh/projects/Kresh/src/components/docs/DocsNextStep.jsx',
    replace: [
      ['bg-\\[var\\(--gray-100\\)\\]0 text-geist-bg-100', 'bg-[var(--primary)] text-[var(--background-100)]']
    ]
  },
  {
    file: '/home/chakresh/projects/Kresh/src/app/(auth)/signin/page.js',
    replace: [
      ['disabled:bg-\\[var\\(--gray-100\\)\\]0', 'disabled:bg-[var(--gray-100)]']
    ]
  },
  {
    file: '/home/chakresh/projects/Kresh/src/app/(auth)/signup/page.js',
    replace: [
      ['disabled:bg-\\[var\\(--gray-100\\)\\]0', 'disabled:bg-[var(--gray-100)]']
    ]
  },
  {
    file: '/home/chakresh/projects/Kresh/src/app/loops/[id]/page.js',
    replace: [
      ['selection:bg-\\[var\\(--blue-100\\)\\]0', 'selection:bg-[var(--blue-200)]']
    ]
  }
];

fixes.forEach(f => {
  if (fs.existsSync(f.file)) {
    let content = fs.readFileSync(f.file, 'utf8');
    f.replace.forEach(([from, to]) => {
      content = content.replace(new RegExp(from, 'g'), to);
    });
    fs.writeFileSync(f.file, content, 'utf8');
  }
});
