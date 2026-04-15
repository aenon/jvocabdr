'use client';

import { useEffect, useRef, useState } from 'react';

interface GameInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function GameInput({ value, onChange, onSubmit, disabled }: GameInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z]/g, '');
    onChange(val);
    setError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      setError(true);
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className={`input ${error ? 'error' : ''}`}
        value={value}
        onChange={handleChange}
        placeholder="type letters"
        disabled={disabled}
        maxLength={20}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      <button 
        type="submit" 
        className="btn btn-primary" 
        style={{ marginTop: '16px' }}
        disabled={disabled || !value.trim()}
      >
        Submit Answer
      </button>
    </form>
  );
}