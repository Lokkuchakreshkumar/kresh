import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Guard session and redirect to the user's dynamic profile
  const session = await verifySession();
  if (!session) {
    redirect('/signin');
  }

  redirect(`/@${session.username}`);
}

