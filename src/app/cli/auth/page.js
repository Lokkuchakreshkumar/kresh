import React from 'react';
import { redirect } from 'next/navigation';
import { verifySession, getSessionToken } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Terminal, CheckCircle } from 'lucide-react';

export default async function CliAuthPage({ searchParams }) {
  const { port } = await searchParams;
  
  if (!port) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="p-8 text-center text-text-secondary">
          Invalid request. Missing local port.
        </div>
      </div>
    );
  }

  // Check if user is logged in
  const session = await verifySession();
  
  if (!session) {
    // Redirect to signin with callback back here
    redirect(`/signin?callback=${encodeURIComponent(`/cli/auth?port=${port}`)}`);
  }

  // Get the raw session token to send to the CLI
  const token = await getSessionToken();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-6 mt-16">
        <div className="glass rounded-xl p-8 max-w-md w-full text-center flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-kresh-green/20 flex items-center justify-center">
              <Terminal className="w-8 h-8 text-kresh-green" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-kresh-green" />
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Authenticated!</h1>
            <p className="text-text-secondary text-sm">
              You have successfully authenticated the Kresh CLI as <strong>@{session.username}</strong>.
            </p>
          </div>
          
          <div className="w-full bg-white/5 rounded-lg p-4 text-xs font-mono text-text-secondary/70">
            Redirecting to CLI... You can close this window now.
          </div>

          <script
            dangerouslySetInnerHTML={{
              __html: `window.location.href = "http://127.0.0.1:${port}/callback?token=${encodeURIComponent(token)}";`
            }}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
