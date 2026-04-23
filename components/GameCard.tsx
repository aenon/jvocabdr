'use client';

import { VocabCard } from '@/lib/types';
import GameInput from './GameInput';
import GameFeedback from './GameFeedback';

interface GameCardProps {
  card: VocabCard;
  userAnswer: string;
  isRevealed: boolean;
  isCorrect: boolean | null;
  onAnswer: (answer: string) => void;
  onSubmit: () => void;
  onNext: () => void;
}

export default function GameCard({
  card,
  userAnswer,
  isRevealed,
  isCorrect,
  onAnswer,
  onSubmit,
  onNext,
}: GameCardProps) {
  const word = card.word.toLowerCase();
  const firstLetter = word[0];
  const lastLetter = word[word.length - 1];
  const middlePart = word.slice(1, -1);

  const renderWord = () => {
    if (isRevealed) {
      return <span>{word}</span>;
    }
    return (
      <>
        <span className="letter">{firstLetter}</span>
        {middlePart.split('').map((_, i) => (
          <span key={i} className="blank" style={{ width: '24px' }} />
        ))}
        <span className="letter">{lastLetter}</span>
      </>
    );
  };

  return (
    <div className="card">
      <div className="definition">
        <strong>Definition:</strong><br />
        {card.definition}
      </div>
      
      <div className="word-display">
        {renderWord()}
      </div>

      {!isRevealed ? (
        <GameInput
          value={userAnswer}
          onChange={onAnswer}
          onSubmit={onSubmit}
          disabled={isRevealed}
        />
      ) : (
        <GameFeedback
          isCorrect={isCorrect ?? false}
          word={card.word}
          example={card.example}
          onNext={onNext}
        />
      )}
    </div>
  );
}