import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Home from '../Home'

describe('Home Component', () => {
  const mockStats = {
    totalSessions: 10,
    totalWordsReviewed: 150,
    totalCorrect: 120,
    totalIncorrect: 30,
    currentStreak: 5,
    bestStreak: 8,
    lastPracticeDate: '2026-03-11T12:00:00Z',
    practiceDays: ['2026-03-10', '2026-03-11'],
  }

  const mockSetView = vi.fn()
  const mockOnStartSession = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the title with crab emoji', () => {
    render(<Home stats={mockStats} onStartSession={mockOnStartSession} setView={mockSetView} />)

    expect(screen.getByText('VocaBuilder 🦀')).toBeInTheDocument()
  })

  it('should display statistics correctly', () => {
    render(<Home stats={mockStats} onStartSession={mockOnStartSession} setView={mockSetView} />)

    expect(screen.getByText('150')).toBeInTheDocument() // Total words
    expect(screen.getByText('10')).toBeInTheDocument() // Sessions
    expect(screen.getByText('5')).toBeInTheDocument() // Streak
    expect(screen.getByText('80%')).toBeInTheDocument() // Accuracy
  })

  it('should render all three session type buttons', () => {
    render(<Home stats={mockStats} onStartSession={mockOnStartSession} setView={mockSetView} />)

    expect(screen.getByText('Quick Practice')).toBeInTheDocument()
    expect(screen.getByText('Daily Review')).toBeInTheDocument()
    expect(screen.getByText('New Words')).toBeInTheDocument()
  })

  it('should call onStartSession with correct type when session button clicked', () => {
    render(<Home stats={mockStats} onStartSession={mockOnStartSession} setView={mockSetView} />)

    fireEvent.click(screen.getByText('Quick Practice'))
    expect(mockOnStartSession).toHaveBeenCalledWith('quick')

    mockOnStartSession.mockClear()

    fireEvent.click(screen.getByText('Daily Review'))
    expect(mockOnStartSession).toHaveBeenCalledWith('daily')

    mockOnStartSession.mockClear()

    fireEvent.click(screen.getByText('New Words'))
    expect(mockOnStartSession).toHaveBeenCalledWith('new')
  })

  it('should render Dashboard button', () => {
    render(<Home stats={mockStats} onStartSession={mockOnStartSession} setView={mockSetView} />)

    const dashboardBtn = screen.getByText('Dashboard')
    expect(dashboardBtn).toBeInTheDocument()
  })

  it('should call setView when Dashboard button clicked', () => {
    render(<Home stats={mockStats} onStartSession={mockOnStartSession} setView={mockSetView} />)

    fireEvent.click(screen.getByText('Dashboard'))
    expect(mockSetView).toHaveBeenCalledWith('dashboard')
  })

  it('should render Settings button', () => {
    render(<Home stats={mockStats} onStartSession={mockOnStartSession} setView={mockSetView} />)

    const settingsBtn = screen.getByText('Settings')
    expect(settingsBtn).toBeInTheDocument()
  })

  it('should call setView when Settings button clicked', () => {
    render(<Home stats={mockStats} onStartSession={mockOnStartSession} setView={mockSetView} />)

    fireEvent.click(screen.getByText('Settings'))
    expect(mockSetView).toHaveBeenCalledWith('settings')
  })

  it('should calculate accuracy correctly', () => {
    const stats = {
      ...mockStats,
      totalCorrect: 75,
      totalIncorrect: 25,
      totalWordsReviewed: 100,
    }

    render(<Home stats={stats} onStartSession={mockOnStartSession} setView={mockSetView} />)

    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('should display 0% accuracy when no words practiced', () => {
    const stats = {
      ...mockStats,
      totalCorrect: 0,
      totalIncorrect: 0,
      totalWordsReviewed: 0,
    }

    render(<Home stats={stats} onStartSession={mockOnStartSession} setView={mockSetView} />)

    expect(screen.getByText('0%')).toBeInTheDocument()
  })
})
