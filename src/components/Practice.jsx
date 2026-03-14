import React, { useState, useEffect, useRef } from 'react';

function Practice({ words, onComplete, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isShowingAnswer, setIsShowingAnswer] = useState(false);
  const [sessionResults, setSessionResults] = useState([]);
  const [showCorrectReveal, setShowCorrectReveal] = useState(false);
  const inputRef = useRef(null);

  const currentWord = words[currentIndex];

  useEffect(() => {
    setUserAnswer('');
    setAttempts(0);
    setFeedback(null);
    setIsShowingAnswer(false);
    setShowCorrectReveal(false);
    inputRef.current?.focus();
  }, [currentIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const isCorrect = userAnswer.trim().toUpperCase() === currentWord.word;
    setAttempts(attempts + 1);

    if (isCorrect) {
      setFeedback({ correct: true, message: 'Correct! Great job! 👏' });
      handleResult(isCorrect);
    } else if (attempts >= 2) {
      // Show answer after 3 failed attempts
      setShowCorrectReveal(true);
      setFeedback({
        correct: false,
        message: `The word was: ${currentWord.word}`
      });
      handleResult(isCorrect);
    } else {
      setFeedback({
        correct: false,
        message: 'Not quite. Give it another try!'
      });
      // Shake animation
      inputRef.current?.classList.add('animate-shake');
      setTimeout(() => {
        inputRef.current?.classList.remove('animate-shake');
      }, 300);
    }
  };

  const handleResult = (correct) => {
    const result = {
      word: currentWord,
      correct,
      attempts: attempts + 1,
    };
    setSessionResults([...sessionResults, result]);

    if (!correct) {
      setIsShowingAnswer(true);
    }
  };

  const handleSkip = () => {
    const result = {
      word: currentWord,
      correct: false,
      skipped: true,
      attempts: 0,
    };
    setSessionResults([...sessionResults, result]);
    setShowCorrectReveal(true);
    setIsShowingAnswer(true);
    setFeedback({
      correct: false,
      message: `The word was: ${currentWord.word}`
    });
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // End of session
      onComplete(sessionResults);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isShowingAnswer) {
      handleNext();
    }
  };

  const renderWordDisplay = () => {
    const firstLetter = currentWord.word[0];
    const lastLetter = currentWord.word[currentWord.word.length - 1];
    const middleCount = currentWord.word.length - 2;

    return (
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <div className={`letter-slot filled ${feedback?.correct ? 'animate-pulse-success' : ''}`}>
          {firstLetter}
        </div>

        {feedback?.correct || isShowingAnswer
          ? currentWord.word.slice(1, -1).split('').map((letter, i) => (
              <div key={i} className={`letter-slot filled ${feedback?.correct ? 'animate-pulse-success' : ''}`}>
                {letter}
              </div>
            ))
          : Array.from({ length: middleCount }, (_, i) => (
              <div key={i} className="letter-slot empty">
                _
              </div>
            ))
        }

        <div className={`letter-slot filled ${feedback?.correct ? 'animate-pulse-success' : ''}`}>
          {lastLetter}
        </div>
      </div>
    );
  };

  const progress = ((currentIndex + 1) / words.length) * 100;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="btn-ghost text-sm"
          >
            ← Back
          </button>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {currentIndex + 1} / {words.length}
          </div>
          <div className="w-16"></div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Word Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 p-6 sm:p-8 mb-6 animate-fade-in">
          {/* Hints */}
          <div className="mb-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Hint:</div>
            <p className="text-lg text-gray-900 dark:text-gray-100">
              {currentWord.hint}
            </p>
          </div>

          {/* Word Display */}
          <div className="mb-6">
            {renderWordDisplay()}
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`mb-6 p-4 rounded-lg text-center font-semibold ${
                feedback.correct
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Input (hidden when showing answer) */}
          {!isShowingAnswer ? (
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type the word..."
                className="w-full px-4 py-3 text-lg text-center border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4"
                autoCapitalize="characters"
                autoComplete="off"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!userAnswer.trim()}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="btn-secondary"
                >
                  Skip
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <button
                onClick={handleNext}
                onKeyPress={handleKeyPress}
                className="btn-primary"
              >
                {currentIndex < words.length - 1 ? 'Next Word →' : 'Finish Session'}
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Press Enter to continue
              </p>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 mb-1">Session Progress</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {Math.round((sessionResults.filter(r => r.correct).length / words.length) * 100)}% correct
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 mb-1">Remaining</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {words.length - currentIndex - 1} words
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Practice;
