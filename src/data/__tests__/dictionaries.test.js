import { describe, it, expect, vi } from 'vitest'
import {
  validateHint,
  generateSafeHint,
  curatedWordSets,
  getAllCuratedWords,
  getWordsByCategory,
  getWordsByDifficulty,
} from '../dictionaries'

// Mock fetch for API tests
global.fetch = vi.fn()

describe('validateHint', () => {
  it('should return valid for hints without target word', () => {
    const result = validateHint('A large feline animal', 'lion')
    expect(result.valid).toBe(true)
  })

  it('should return invalid for hints containing target word', () => {
    const result = validateHint('A lion is a large cat', 'lion')
    expect(result.valid).toBe(false)
    expect(result.reason).toContain('lion')
  })

  it('should return invalid for hints containing similar words', () => {
    const similarWords = ['feline', 'cat', 'big']
    const result = validateHint('This feline is a cat', 'lion', similarWords)
    expect(result.valid).toBe(false)
    expect(result.reason).toContain('feline')
    expect(result.reason).toContain('cat')
  })

  it('should handle case insensitive matching', () => {
    const result = validateHint('A LION is an animal', 'lion')
    expect(result.valid).toBe(false)
    expect(result.reason).toContain('lion')
  })

  it('should work with mixed case in similar words', () => {
    const similarWords = ['Cat', 'FELINE']
    const result = validateHint('This feline is a cat', 'lion', similarWords)
    expect(result.valid).toBe(false)
  })
})

describe('generateSafeHint', () => {
  it('should handle API errors gracefully', () => {
    fetch.mockRejectedValueOnce(new Error('API Error'))

    return generateSafeHint('testWord').then(result => {
      expect(result).toBeNull()
    })
  })

  it('should return null for word lookup failures', () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    })

    return generateSafeHint('nonexistentword').then(result => {
      expect(result).toBeNull()
    })
  })

  it('should return hint source information', () => {
    const mockData = [
      {
        word: 'EXAMPLE',
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [
              {
                definition: 'A representative form or pattern',
              },
            ],
          },
        ],
        phonetic: '/ɪɡˈzæmpəl/',
      },
    ]

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    })

    return generateSafeHint('example', 1).then(result => {
      expect(result).not.toBeNull()
      expect(result.source).toBe('dictionaryapi.dev')
      expect(result.hint).toBeDefined()
    })
  })
})

describe('curatedWordSets', () => {
  it('should contain predefined word sets', () => {
    expect(curatedWordSets).toHaveProperty('technology')
    expect(curatedWordSets).toHaveProperty('academic')
    expect(curatedWordSets).toHaveProperty('business')
    expect(curatedWordSets).toHaveProperty('science')
    expect(curatedWordSets).toHaveProperty('geography')
  })

  it('should have name and words properties for each set', () => {
    Object.values(curatedWordSets).forEach(set => {
      expect(set).toHaveProperty('name')
      expect(set).toHaveProperty('words')
      expect(Array.isArray(set.words)).toBe(true)
      expect(set.words.length).toBeGreaterThan(0)
    })
  })

  it('should have word objects with required properties', () => {
    const technologyWords = curatedWordSets.technology.words

    technologyWords.forEach(word => {
      expect(word).toHaveProperty('word')
      expect(word).toHaveProperty('hint')
      expect(word).toHaveProperty('difficulty')
      expect(word).toHaveProperty('category')
    })
  })

  it('should have valid difficulty levels', () => {
    const allWords = getAllCuratedWords()
    const difficulties = allWords.map(w => w.difficulty)

    difficulties.forEach(diff => {
      expect(['easy', 'medium', 'hard']).toContain(diff)
    })
  })

  it('should have valid categories', () => {
    const allWords = getAllCuratedWords()
    const categories = allWords.map(w => w.category)

    const validCategories = [
      'animals', 'colors', 'food', 'nature', 'technology',
      'emotions', 'academic', 'business', 'science', 'geography'
    ]

    categories.forEach(cat => {
      expect(validCategories).toContain(cat)
    })
  })

  it('should have hints that are reasonable for curated words', () => {
    // Verify that curated dictionary words have valid hints structure
    const allWords = getAllCuratedWords()

    allWords.forEach(word => {
      expect(word.hint).toBeDefined()
      expect(word.hint).toHaveProperty?.('length', word.hint.length)
      expect(word.hint.length).toBeGreaterThan(10)
    })
  })

  it('should have a reasonable number of words per set', () => {
    Object.values(curatedWordSets).forEach(set => {
      expect(set.words.length).toBeGreaterThan(5)
      expect(set.words.length).toBeLessThan(20)
    })
  })
})

describe('getAllCuratedWords', () => {
  it('should return all curated words from all dictionaries', () => {
    const allWords = getAllCuratedWords()

    // Should have 40+ curated words from dictionaries.js
    expect(allWords.length).toBeGreaterThanOrEqual(40)

    // Check that we have words from each curated dictionary set
    const categories = [...new Set(allWords.map(w => w.category))]
    expect(categories).toContain('technology')
    expect(categories).toContain('academic')
    expect(categories).toContain('business')
    expect(categories).toContain('science')
    expect(categories).toContain('geography')
  })

  it('should not have duplicate words', () => {
    const allWords = getAllCuratedWords()
    const wordSet = new Set(allWords.map(w => w.word))

    expect(wordSet.size).toBe(allWords.length)
  })
})

describe('getWordsByCategory', () => {
  it('should return words for a specific category', () => {
    const techWords = getWordsByCategory('technology')

    expect(techWords.length).toBeGreaterThan(0)
    techWords.forEach(word => {
      expect(word.category).toBe('technology')
    })
  })

  it('should return empty array for non-existent category', () => {
    const result = getWordsByCategory('nonexistent')
    expect(result).toEqual([])
  })

  it('should preserve all word properties', () => {
    const techWords = getWordsByCategory('technology')

    techWords.forEach(word => {
      expect(word).toHaveProperty('word')
      expect(word).toHaveProperty('hint')
      expect(word).toHaveProperty('difficulty')
      expect(word).toHaveProperty('category')
    })
  })
})

describe('getWordsByDifficulty', () => {
  it('should return words for a specific difficulty', () => {
    const easyWords = getWordsByDifficulty('easy')

    expect(easyWords.length).toBeGreaterThan(0)
    easyWords.forEach(word => {
      expect(word.difficulty).toBe('easy')
    })
  })

  it('should return words for each difficulty level', () => {
    const easy = getWordsByDifficulty('easy')
    const medium = getWordsByDifficulty('medium')
    const hard = getWordsByDifficulty('hard')

    expect(easy.length).toBeGreaterThan(0)
    expect(medium.length).toBeGreaterThan(0)
    expect(hard.length).toBeGreaterThan(0)
  })
})
