'use client';

import { useState } from 'react';
import { signInWithGoogle } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      router.push('/game');
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="center">
        <h1 className="title">Vocabulary Builder</h1>
        <p className="subtitle">
          Fill in the missing letters to build your vocabulary
        </p>
        
        <button 
          className="btn btn-primary" 
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
        
        {error && (
          <p style={{ color: 'var(--color-error)', marginTop: '16px' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}