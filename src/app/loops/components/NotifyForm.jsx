'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function NotifyForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for newsletter subscription
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-kresh-green/20 bg-kresh-green/5 p-6 text-center animate-fade-in">
        <p className="text-sm font-semibold text-kresh-green">You're on the list!</p>
        <p className="mt-1.5 text-xs text-text-secondary/80">We'll notify you as soon as Kresh Loops goes live.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-primary placeholder-text-secondary/40 outline-none transition-all duration-200 focus:border-kresh-green/30 focus:bg-white/[0.07] focus:ring-1 focus:ring-kresh-green/20"
            disabled={loading}
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          className="rounded-xl bg-white text-black hover:bg-white/95 px-6 py-3 font-semibold text-sm active:scale-[0.98] transition-transform shrink-0"
        >
          {loading ? 'Subscribing...' : 'Notify Me'}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-red-500 text-left pl-1">{error}</p>
      )}
    </form>
  );
}
