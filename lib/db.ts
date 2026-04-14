import { 
  collection, doc, getDoc, getDocs, query, where, 
  orderBy, limit, setDoc, updateDoc, Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { CardProgress, VocabCard } from './types';

const DEFAULT_DECK_ID = 'default-english';

export async function getDeckCards(deckId: string = DEFAULT_DECK_ID): Promise<VocabCard[]> {
  const cardsRef = collection(db, 'decks', deckId, 'cards');
  const snapshot = await getDocs(cardsRef);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as VocabCard[];
}

export async function getCardProgress(
  cardId: string, 
  userId: string,
  deckId: string = DEFAULT_DECK_ID
): Promise<CardProgress | null> {
  const progressRef = doc(db, 'decks', deckId, 'cards', cardId, 'progress', userId);
  const snapshot = await getDoc(progressRef);
  
  if (!snapshot.exists()) return null;
  return snapshot.data() as CardProgress;
}

export async function getDueCards(
  userId: string,
  deckId: string = DEFAULT_DECK_ID,
  limitCount: number = 20
): Promise<{ card: VocabCard; progress: CardProgress | null }[]> {
  const now = Timestamp.now();
  const cardsRef = collection(db, 'decks', deckId, 'cards');
  
  const allCards = await getDocs(cardsRef);
  const results: { card: VocabCard; progress: CardProgress | null }[] = [];
  
  for (const cardDoc of allCards.docs) {
    const card = { id: cardDoc.id, ...cardDoc.data() } as VocabCard;
    const progress = await getCardProgress(card.id, userId, deckId);
    
    if (!progress || (progress.nextDue as unknown as Date) <= new Date()) {
      results.push({ card, progress });
    }
  }
  
  return results.slice(0, limitCount);
}

export async function getNewCards(
  userId: string,
  deckId: string = DEFAULT_DECK_ID,
  count: number = 10
): Promise<VocabCard[]> {
  const cardsRef = collection(db, 'decks', deckId, 'cards');
  const allCards = await getDocs(cardsRef);
  
  const newCards: VocabCard[] = [];
  
  for (const cardDoc of allCards.docs) {
    const progress = await getCardProgress(cardDoc.id, userId, deckId);
    if (!progress || progress.status === 'new') {
      newCards.push({ id: cardDoc.id, ...cardDoc.data() } as VocabCard);
      if (newCards.length >= count) break;
    }
  }
  
  return newCards;
}

export async function updateCardProgress(
  cardId: string,
  userId: string,
  progressData: Partial<CardProgress>,
  deckId: string = DEFAULT_DECK_ID
): Promise<void> {
  const progressRef = doc(db, 'decks', deckId, 'cards', cardId, 'progress', userId);
  
  await setDoc(progressRef, {
    ...progressData,
    cardId,
    userId,
    lastReviewed: Timestamp.now(),
  }, { merge: true });
}

export async function getUserStats(userId: string): Promise<{
  totalLearned: number;
  mastered: number;
  dueToday: number;
}> {
  const defaultDeckCards = await getDocs(collection(db, 'decks', DEFAULT_DECK_ID, 'cards'));
  
  let totalLearned = 0;
  let mastered = 0;
  let dueToday = 0;
  
  for (const cardDoc of defaultDeckCards.docs) {
    const progress = await getDoc(doc(db, 'decks', DEFAULT_DECK_ID, 'cards', cardDoc.id, 'progress', userId));
    
    if (progress.exists()) {
      totalLearned++;
      const data = progress.data() as CardProgress;
      if (data.status === 'mastered') mastered++;
      if ((data.nextDue as unknown as Date) <= new Date()) dueToday++;
    }
  }
  
  return { totalLearned, mastered, dueToday };
}