'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { VocabCard, CardProgress } from '@/lib/types';
import { getDueCards, getNewCards, updateCardProgress, getUserStats, getDeckCards } from '@/lib/db';
import { calculateSM2, mapAnswerToQuality, getStatusFromProgress } from '@/lib/scheduler';
import GameCard from '@/components/GameCard';
import ProgressBar from '@/components/ProgressBar';

interface SessionCard {
  card: VocabCard;
  progress: CardProgress | null;
  startTime: number;
}

export default function GamePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [sessionCards, setSessionCards] = useState<SessionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalLearned: 0, mastered: 0, dueToday: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);

  const loadSession = useCallback(async () => {
    if (!user) return;
    
    try {
      const userStats = await getUserStats(user.uid);
      setStats(userStats);
      
      const dueCards = await getDueCards(user.uid, 'default-english', 20);
      const newCards = await getNewCards(user.uid, 'default-english', 10);
      
      const allCards: SessionCard[] = [
        ...dueCards.map(dc => ({ 
          card: dc.card, 
          progress: dc.progress, 
          startTime: Date.now() 
        })),
        ...newCards.map(nc => ({ 
          card: nc, 
          progress: null, 
          startTime: Date.now() 
        })),
      ];
      
      const shuffled = allCards.sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load session:', err);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    } else if (user) {
      loadSession();
    }
  }, [user, authLoading, router, loadSession]);

  const handleSubmit = async () => {
    const current = sessionCards[currentIndex];
    const correct = userAnswer.toLowerCase() === current.card.word.slice(1, -1).toLowerCase();
    setIsCorrect(correct);
    setIsRevealed(true);

    const responseTime = Date.now() - current.startTime;
    const quality = mapAnswerToQuality(correct, responseTime);
    
    const currentProgress = current.progress || {
      cardId: current.card.id,
      userId: user!.uid,
      nextDue: new Date(),
      intervalDays: 0,
      easeFactor: 2.5,
      repetitions: 0,
      lastReviewed: null,
      status: 'new' as const,
    };

    const sm2Result = calculateSM2({
      quality,
      repetitions: currentProgress.repetitions,
      easeFactor: currentProgress.easeFactor,
      interval: currentProgress.intervalDays,
    });

    const newProgress: Partial<CardProgress> = {
      nextDue: sm2Result.nextDue,
      intervalDays: sm2Result.interval,
      easeFactor: sm2Result.easeFactor,
      repetitions: sm2Result.repetitions,
      status: getStatusFromProgress({
        ...currentProgress,
        intervalDays: sm2Result.interval,
        repetitions: sm2Result.repetitions,
      }),
    };

    await updateCardProgress(current.card.id, user!.uid, newProgress, 'default-english');
  };

  const handleNext = () => {
    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setIsRevealed(false);
      setIsCorrect(null);
      setSessionCards(prev => {
        const updated = [...prev];
        updated[currentIndex + 1].startTime = Date.now();
        return updated;
      });
    } else {
      setSessionComplete(true);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container">
        <div className="center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="container">
        <div className="center">
          <h1 className="title">Session Complete!</h1>
          <div className="card" style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ fontSize: '18px', marginBottom: '16px' }}>
              You reviewed {sessionCards.length} cards today!
            </p>
            <button className="btn btn-primary" onClick={loadSession}>
              Start New Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = sessionCards[currentIndex];

  return (
    <div className="container">
      <ProgressBar current={currentIndex + 1} total={sessionCards.length} />
      
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-muted)' }}>
        <span>Learned: {stats.totalLearned}</span>
        <span>Mastered: {stats.mastered}</span>
      </div>

      <GameCard
        card={currentCard.card}
        userAnswer={userAnswer}
        isRevealed={isRevealed}
        isCorrect={isCorrect}
        onAnswer={setUserAnswer}
        onSubmit={handleSubmit}
        onNext={handleNext}
      />
    </div>
  );
}