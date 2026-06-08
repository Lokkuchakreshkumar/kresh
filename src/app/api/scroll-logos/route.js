import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force dynamic execution to completely bypass Next.js build-time caching and data caching.
// This ensures the filesystem is read live on every request.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const scrollDir = path.join(process.cwd(), 'public', 'scroll');
    
    if (!fs.existsSync(scrollDir)) {
      console.warn(`Scroll directory not found: ${scrollDir}`);
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(scrollDir);
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'];

    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext) && file.toLowerCase() !== 'image.png';
      })
      .map(file => {
        // Humanize the file name for alt tags
        const baseName = path.basename(file, path.extname(file));
        const formattedName = baseName
          .replace(/_logo$/i, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, char => char.toUpperCase());

        return {
          src: `/scroll/${file}`,
          name: formattedName
        };
      });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching scroll images in API Route handler:', error);
    return NextResponse.json([]);
  }
}
