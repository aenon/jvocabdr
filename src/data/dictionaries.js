// Free Dictionary Resources for VocaBuilder
// These are public domain or freely available dictionary sources

/**
 * Free Dictionary APIs and Word Lists
 *
 * 1. Free Dictionary API (https://dictionaryapi.dev/)
 *    - Free, no API key required
 *    - Returns phonetic, meanings, examples
 *    - Perfect for generating hints
 *
 * 2. WordsAPI (https://www.wordsapi.com/)
 *    - Free tier: 2,500 requests/day
 *    - Comprehensive definitions, synonyms, antonyms
 *    - API key required (free signup)
 *
 * 3. DataMuse API (https://www.datamuse.com/api/)
 *    - Free, no API key required
 *    - Great for finding related words, definitions
 *    - JSON response format
 *
 * 4. GitHub Word Lists (Download as JSON):
 *    - adambom/dictionary: Webster's Unabridged (JSON with definitions)
 *      https://github.com/adambom/dictionary
 *      URL: https://raw.githubusercontent.com/adambom/dictionary/master/dictionary.json
 *      Format: { "WORD": "Definition" }
 *
 *    - dwyl/english-words: Huge word list (370K+ words)
 *      https://github.com/dwyl/english-words
 *      URL: https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json
 *      Format: { "word": true }
 *
 *    - jnoodle/English-Vocabulary-Word-List: Common vocabulary
 *      https://github.com/jnoodle/English-Vocabulary-Word-List
 *
 * 5. Word Frequency Lists:
 *    - aparrish/wordfreq-en-25000: Top 25K English words by frequency
 *      https://github.com/aparrish/wordfreq-en-25000
 *
 * 6. Subject-Specific Word Lists:
 *    - GRE High Frequency: https://github.com/Xatta-Trone/gre-words-collection
 *    - SAT Vocabulary: Multiple sources online
 *    - Academic Word List (AWL): Academic vocabulary lists
 *
 * Usage Example:
 *
 * import { fetchDefinition } from './dictionaries';
 *
 * async function getWordHint(word) {
 *   const definition = await fetchDefinition(word);
 *   return definition;
 * }
 */

// Using Free Dictionary API (no API key needed)
export async function fetchDefinition(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) {
      throw new Error(`Word not found: ${word}`);
    }
    const data = await response.json();
    // Extract first definition from first entry
    const firstEntry = data[0];
    const firstMeaning = firstEntry?.meanings?.[0];
    const definition = firstMeaning?.definitions?.[0]?.definition;

    return {
      word: firstEntry.word,
      definition: definition,
      partOfSpeech: firstMeaning?.partOfSpeech,
      example: firstMeaning?.definitions?.[0]?.example,
      phonetic: firstEntry.phonetic || firstEntry.phonetics?.[0]?.text,
      audio: firstEntry.phonetics?.find(p => p.audio)?.audio,
    };
  } catch (error) {
    console.error('Error fetching definition:', error);
    return null;
  }
}

// Using DataMuse API for related words (no API key needed)
export async function findRelatedWords(word, maxResults = 10) {
  try {
    const response = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(word)}&max=${maxResults}`);
    const data = await response.json();
    return data.map(item => ({
      word: item.word,
      score: item.score,
    }));
  } catch (error) {
    console.error('Error fetching related words:', error);
    return [];
  }
}

// Find words with similar meaning (no overlap with target)
export async function findSynonyms(word, maxResults = 10) {
  try {
    const response = await fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}&max=${maxResults}`);
    const data = await response.json();
    return data.map(item => ({
      word: item.word,
      score: item.score,
    }));
  } catch (error) {
    console.error('Error fetching synonyms:', error);
    return [];
  }
}

// Validate that a hint doesn't contain the target word or similar words
export function validateHint(hint, targetWord, similarWords = []) {
  const wordsInHint = hint.toLowerCase().match(/\b\w+\b/g) || [];
  const targetLower = targetWord.toLowerCase();

  // Check if hint contains target word
  if (wordsInHint.includes(targetLower)) {
    return {
      valid: false,
      reason: `Hint contains the target word: ${targetWord}`,
    };
  }

  // Check if hint contains similar words
  const similarInHint = wordsInHint.filter(w => similarWords.includes(w));
  if (similarInHint.length > 0) {
    return {
      valid: false,
      reason: `Hint contains similar words: ${similarInHint.join(', ')}`,
    };
  }

  return { valid: true };
}

// Generate a safe hint using the Free Dictionary API
export async function generateSafeHint(word, maxAttempts = 3) {
  const definitionData = await fetchDefinition(word);
  if (!definitionData?.definition) {
    return null;
  }

  // Get similar words to avoid
  const similarWords = await findSynonyms(word, 5);
  const similarWordList = similarWords.map(s => s.word.toLowerCase());

  let hint = definitionData.definition;

  // Clean the hint: remove the word itself and synonyms
  for (let i = 0; i < maxAttempts; i++) {
    const validation = validateHint(hint, word, similarWordList);
    if (validation.valid) {
      return {
        hint: hint.replace(`${word.charAt(0).toUpperCase()}${word.slice(1)}`, '[word]').toLowerCase(),
        source: 'dictionaryapi.dev',
      };
    }

    // Try to clean the hint by removing problematic words
    const words = hint.split(/\s+/);
    const cleaned = words.filter(w => {
      const lower = w.toLowerCase().replace(/[^a-z]/g, '');
      return lower !== word.toLowerCase() && !similarWordList.includes(lower);
    });

    if (cleaned.length < words.length) {
      hint = cleaned.join(' ');
    } else {
      // Can't clean further, return null
      return null;
    }
  }

  return null;
}

// Batch fetch definitions for multiple words
export async function batchFetchDefinitions(words, batchSize = 5) {
  const results = {};

  for (let i = 0; i < words.length; i += batchSize) {
    const batch = words.slice(i, i + batchSize);
    const promises = batch.map(async (word) => {
      const data = await generateSafeHint(word);
      return { word, data };
    });

    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ word, data }) => {
      results[word] = data;
    });

    // Rate limiting: wait between batches
    if (i + batchSize < words.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
}

// Curated Category Word Lists (with hints)
// These can be manually curated or enhanced with API calls
export const curatedWordSets = {
  // Technology terms
  technology: {
    name: 'Tech Terms',
    words: [
      { word: 'ALGORITHM', hint: 'A step-by-step procedure for calculations', difficulty: 'medium', category: 'technology' },
      { word: 'DATABASE', hint: 'Organized collection of structured information', difficulty: 'medium', category: 'technology' },
      { word: 'ENCRYPTION', hint: 'Process of encoding information for security', difficulty: 'medium', category: 'technology' },
      { word: 'INTERFACE', hint: 'Shared boundary between two systems', difficulty: 'medium', category: 'technology' },
      { word: 'PROTOCOL', hint: 'Rules governing data exchange', difficulty: 'medium', category: 'technology' },
      { word: 'BANDWIDTH', hint: 'Data transfer capacity of a network', difficulty: 'medium', category: 'technology' },
      { word: 'FIREWALL', hint: 'Network security barrier system', difficulty: 'medium', category: 'technology' },
      { word: 'MALWARE', hint: 'Harmful software designed to damage computers', difficulty: 'medium', category: 'technology' },
    ],
  },

  // Academic/GRE words
  academic: {
    name: 'Academic Vocabulary',
    words: [
      { word: 'ABERRATION', hint: 'Deviation from what is normal', difficulty: 'hard', category: 'academic' },
      { word: 'CANDOR', hint: 'Quality of being open and honest', difficulty: 'hard', category: 'academic' },
      { word: 'DILIGENT', hint: 'Having careful and persistent effort', difficulty: 'hard', category: 'academic' },
      { word: 'Eloquent', hint: 'Fluent and persuasive in speaking', difficulty: 'hard', category: 'academic' },
      { word: 'LAUDABLE', hint: 'Deserving praise and commendation', difficulty: 'hard', category: 'academic' },
      { word: 'PROFICIENT', hint: 'Competent or skilled in doing something', difficulty: 'hard', category: 'academic' },
      { word: 'RESILIENT', hint: 'Able to recover quickly from difficulties', difficulty: 'hard', category: 'academic' },
      { word: 'VIVACIOUS', hint: 'Full of life and energy', difficulty: 'hard', category: 'academic' },
    ],
  },

  // Business terms
  business: {
    name: 'Business Terms',
    words: [
      { word: 'ASSET', hint: 'Resource with economic value owned by entity', difficulty: 'medium', category: 'business' },
      { word: 'LIQUIDITY', hint: 'Ease of converting assets to cash', difficulty: 'medium', category: 'business' },
      { word: 'REVENUE', hint: 'Income generated from business operations', difficulty: 'medium', category: 'business' },
      { word: 'LEVERAGE', hint: 'Using borrowed capital to increase potential return', difficulty: 'hard', category: 'business' },
      { word: 'VOLATILITY', hint: 'Degree of variation in price over time', difficulty: 'hard', category: 'business' },
      { word: 'ACQUISITION', hint: 'Purchase of one company by another', difficulty: 'hard', category: 'business' },
      { word: 'DEPRECIATION', hint: 'Decrease in value of an asset over time', difficulty: 'hard', category: 'business' },
      { word: 'DIVIDEND', hint: 'Distribution of profits to shareholders', difficulty: 'medium', category: 'business' },
    ],
  },

  // Science terms
  science: {
    name: 'Science Terms',
    words: [
      { word: 'PHOTOSYNTHESIS', hint: 'Process by which plants convert sunlight to energy', difficulty: 'hard', category: 'science' },
      { word: 'MITOSIS', hint: 'Cell division resulting in identical daughter cells', difficulty: 'hard', category: 'science' },
      { word: 'VELOCITY', hint: 'Speed with a specified direction', difficulty: 'medium', category: 'science' },
      { word: 'MOMENTUM', hint: 'Product of mass and velocity', difficulty: 'hard', category: 'science' },
      { word: 'GRAVITY', hint: 'Force that attracts objects toward each other', difficulty: 'easy', category: 'science' },
      { word: 'ENERGY', hint: 'Capacity to do work or cause change', difficulty: 'easy', category: 'science' },
      { word: 'ELECTRON', hint: 'Negatively charged subatomic particle', difficulty: 'hard', category: 'science' },
      { word: 'MAGNET', hint: 'Object producing magnetic field of force', difficulty: 'easy', category: 'science' },
    ],
  },

  // Geography terms
  geography: {
    name: 'Geography',
    words: [
      { word: 'PENINSULA', hint: 'Land area mostly surrounded by water', difficulty: 'medium', category: 'geography' },
      { word: 'PLATEAU', hint: 'Flat highland area with steep sides', difficulty: 'medium', category: 'geography' },
      { word: 'EQUATOR', hint: 'Imaginary line dividing Earth into hemispheres', difficulty: 'medium', category: 'geography' },
      { word: 'GLACIER', hint: 'Large body of dense ice that moves slowly', difficulty: 'hard', category: 'geography' },
      { word: 'ARCHIPELAGO', hint: 'Group or chain of islands', difficulty: 'hard', category: 'geography' },
      { word: 'TRIBUTARY', hint: 'River or stream flowing into larger river', difficulty: 'hard', category: 'geography' },
      { word: 'LATITUDE', hint: 'Angular distance north or south of equator', difficulty: 'hard', category: 'geography' },
      { word: 'LONGITUDE', hint: 'Angular distance east or west of prime meridian', difficulty: 'hard', category: 'geography' },
    ],
  },
};

// Utility to merge all curated words
export function getAllCuratedWords() {
  const allWords = [];
  Object.values(curatedWordSets).forEach(set => {
    allWords.push(...set.words);
  });
  return allWords;
}

// Get curated words by category
export function getWordsByCategory(category) {
  if (curatedWordSets[category]) {
    return curatedWordSets[category].words;
  }
  return [];
}

// Get curated words by difficulty
export function getWordsByDifficulty(difficulty) {
  const allWords = getAllCuratedWords();
  return allWords.filter(w => w.difficulty === difficulty);
}
