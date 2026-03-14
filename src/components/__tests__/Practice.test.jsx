import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Practice from '../Practice'

const mockWords = [
  {
    id: 'word-1',
    word: 'LION',
    hint: 'Large feline predator living in African savannas',
    difficulty: 'easy',
    category: 'animals',
    state: 'new',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'word-2',
    word: 'TIGER',
    hint: 'Striped big cat native to Asia',
    difficulty: 'easy',
    category: 'animals',
    state: 'new',
    correctCount: 0,
    incorrectCount: 0,
  },
]

const mockOnComplete = vi.fn()
const mockOnBack = vi.fn()

describe('Practice Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the first word', () => {
    render(<Practice words={mockWords} onComplete={mockOnComplete} onBack={mockOnBack} />)

    expect(screen.getByText('1 / 2')).toBeInTheDocument()
    expect(screen.getByText(/Large feline predator/)).toBeInTheDocument()
  })

  it('should display first and last letters with slots', () => {
    render(<Practice words={mockWords} onComplete={mockOnComplete} onBack={mockOnBack} />)

    expect(screen.getByText('L')).toBeInTheDocument()
    expect(screen.getByText('N')).toBeInTheDocument()
  })

  it('should show blank slots for middle letters', () => {
    const { container } = render(<Practice words={mockWords} onComplete={mockOnComplete} onBack={mockOnBack} />)

    // Should have underscores for middle letters
    const emptySlots = container.querySelectorAll('.letter-slot.empty')
    expect(emptySlots.length).toBeGreaterThan(0)
  })

  it('should have an input field', () => {
    render(<Practice words={mockWords} onComplete={mockOnComplete} onBack={mockOnBack} />)

    const input = screen.getByPlaceholderText('Type the word...')
    expect(input).toBeInTheDocument()
  })

  it('should have a submit button', () => {
    render(<Practice words={mockWords} onComplete={mockOnComplete} onBack={mockOnBack} />)

    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('should have a skip button', () => {
    render(<Practice words={mockWords} onComplete={mockOnComplete} onBack={mockOnBack} />)

    expect(screen.getByText('Skip')).toBeInTheDocument()
  })

  it('should show incorrect feedback and allow retry', async () => {
    render(<Practice words={mockWords} onComplete={mockOnComplete} onBack={mockOnBack} />)

    const input = screen.getByPlaceholderText('Type the word...')

    fireEvent.change(input, { target: { value: 'wrong' } })
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(screen.getByText(/not quite/i)).toBeInTheDocument()
    })
  })

  it('should show the full word after multiple tries', async () => {
    render(<Practice words={mockWords} onComplete={mockOnComplete} onBack={mockOnBack} />)

    const input = screen.getByPlaceholderText('Type the word...')

    // First wrong attempt
    fireEvent.change(input, { target: { value: 'wrong1' } })
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(screen.getByText(/not quite/i)).toBeInTheDocument()
    })

    // Clear and try again
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.change(input, { target: { value: 'wrong2' } })
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(screen.getByText(/not quite/i)).toBeInTheDocument()
    })

    // Third wrong attempt - should reveal answer
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.change(input, { target: { value: 'wrong3' } })
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(screen.getByText(/LION/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should call onBack when back button clicked', () => {
    render(<Practice words={mockWords} onComplete={mockOnComplete} onBack={mockOnBack} />)

    fireEvent.click(screen.getByText('← Back'))
    expect(mockOnBack).toHaveBeenCalled()
  })

  it('should handle single word correctly', () => {
    const singleWord = [mockWords[0]]
    render(<Practice words={singleWord} onComplete={mockOnComplete} onBack={mockOnBack} />)

    expect(screen.getByText('1 / 1')).toBeInTheDocument()
  })
})
