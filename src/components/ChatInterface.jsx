import { useState, useEffect } from 'react'
import { useStepTracker } from '../hooks/useStepTracker'
import ConversationFeed from './ConversationFeed'
import PromptInput from './PromptInput'

export default function ChatInterface() {
  const { stepList, activeIndex, isComplete, isLoading, error, loadSteps, markDone, goToStep } =
    useStepTracker()
  const [messages, setMessages] = useState([])

  const handleSubmit = (prompt) => {
    setMessages((prev) => [...prev, prompt])
    loadSteps(prompt)
  }

  const hasSteps = stepList.length > 0 && !isComplete
  const canGoBack = hasSteps && activeIndex !== null && activeIndex > 0
  const canGoForward = hasSteps && activeIndex !== null &&
    activeIndex < stepList.length - 1 &&
    stepList[activeIndex]?.done

  const goBack = () => goToStep(activeIndex - 1)
  const goForward = () => goToStep(activeIndex + 1)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowLeft' && canGoBack) goBack()
      if (e.key === 'ArrowRight' && canGoForward) goForward()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canGoBack, canGoForward, activeIndex])

  return (
    <div className="flex flex-col h-screen bg-[#111111]">
      {/* Minimal top bar */}
      <header className="shrink-0 flex items-center justify-center py-4 border-b border-white/5">
        <span className="text-xs font-medium text-gray-600 tracking-widest uppercase">Step Assistant</span>
      </header>

      {/* Error */}
      {error && (
        <div className="shrink-0 text-center text-xs text-red-400 py-2 px-4 bg-red-950/30 border-b border-red-900/30">
          {error}
        </div>
      )}

      {/* Scrollable chat */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full px-4">
          <ConversationFeed
            messages={messages}
            stepList={stepList}
            activeIndex={activeIndex}
            isComplete={isComplete}
            onMarkDone={markDone}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Step navigation bar — just above the input */}
      {hasSteps && (
        <div className="shrink-0 border-t border-white/5 bg-[#111111]">
          <div className="max-w-2xl mx-auto w-full px-4 py-3 flex items-center justify-between gap-4">
            {/* Left arrow */}
            <button
              onClick={goBack}
              disabled={!canGoBack}
              aria-label="Previous step"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                canGoBack
                  ? 'bg-white/10 text-gray-300 hover:bg-white/20 active:scale-95'
                  : 'bg-white/5 text-gray-700 cursor-not-allowed'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Progress dots + step counter */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2">
                {stepList.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const firstUndone = stepList.findIndex(st => !st.done)
                      if (i <= firstUndone || firstUndone === -1) goToStep(i)
                    }}
                    className={`rounded-full transition-all duration-200 ${
                      i === activeIndex
                        ? 'w-4 h-2.5 bg-white'
                        : s.done
                        ? 'w-2.5 h-2.5 bg-green-500 hover:bg-green-400'
                        : 'w-2.5 h-2.5 bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                Step {activeIndex + 1} of {stepList.length}
              </span>
            </div>

            {/* Right arrow */}
            <button
              onClick={goForward}
              disabled={!canGoForward}
              aria-label="Next step"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                canGoForward
                  ? 'bg-white/10 text-gray-300 hover:bg-white/20 active:scale-95'
                  : 'bg-white/5 text-gray-700 cursor-not-allowed'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Input bar */}
      <PromptInput onSubmit={handleSubmit} disabled={isLoading} />
    </div>
  )
}
