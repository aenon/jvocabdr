'use client';

interface GameFeedbackProps {
  isCorrect: boolean;
  word: string;
  example: string;
  onNext: () => void;
}

export default function GameFeedback({ isCorrect, word, example, onNext }: GameFeedbackProps) {
  return (
    <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
      <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
        {isCorrect ? 'Correct!' : 'Incorrect'}
      </p>
      <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
        The word is: {word}
      </p>
      <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
        {example}
      </p>
      <button 
        className="btn btn-primary" 
        onClick={onNext}
        style={{ marginTop: '16px' }}
      >
        Next Card
      </button>
    </div>
  );
}