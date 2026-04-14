import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import vocabulary from './vocabulary.json' assert { type: 'json' };

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

async function seedVocabulary() {
  const deckId = 'default-english';
  
  console.log('Creating deck...');
  await db.collection('decks').doc(deckId).set({
    name: 'English Vocabulary',
    description: 'Common English words for vocabulary building',
    wordCount: vocabulary.length,
    isDefault: true,
    createdAt: new Date(),
  });

  console.log(`Seeding ${vocabulary.length} words...`);
  
  const batch = db.batch();
  
  for (const word of vocabulary) {
    const cardRef = db.collection('decks').doc(deckId).collection('cards').doc(word.id);
    batch.set(cardRef, {
      word: word.word,
      definition: word.definition,
      example: word.example,
      difficulty: word.difficulty,
      tags: word.tags || [],
    });
  }

  await batch.commit();
  console.log('Seed complete!');
}

seedVocabulary().catch(console.error);