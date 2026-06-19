import { createSkillAction } from '@/app/dashboard/actions';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const formData = new FormData();
    formData.append('name', 'test-skill');
    formData.append('version', '1.0.0');
    formData.append('source', 'editor');
    formData.append('skillMarkdown', '# Test Skill');
    
    const result = await createSkillAction(null, formData);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
