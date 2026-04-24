import { useState } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'

export default function StepBubble({ step, isActive, onMarkDone }) {
  const [imgError, setImgError] = useState(false)

  // Typewriter only for the active undone step; done steps show instantly
  const { displayText, isTyping } = useTypewriter(
    step.description,
    isActive && !step.done ? 25 : 0
  )

  // Show full text if done or navigating back, typewriter if active
  const shownText = step.done ? step.description : displayText

  return (
    <div className="flex flex-col gap-3">
      {/* Step text */}
      <p className={`text-sm leading-relaxed transition-colors duration-500 ${
        step.done
          ? 'text-green-400'
          : isActive
          ? 'text-gray-100'
          : 'text-gray-500'
      }`}>
        {shownText}
        {isTyping && <span className="inline-block w-0.5 h-4 bg-gray-400 ml-0.5 animate-pulse align-text-bottom" />}
      </p>

      {/* Image — only show after typing finishes */}
      {step.image && !isTyping && (
        <div>
          {imgError ? (
            <div className="flex items-center justify-center rounded-xl bg-white/5 border border-white/10 px-4 py-8 text-xs text-gray-600">
              Image unavailable
            </div>
          ) : (
            <img
              src={step.image}
              alt="Step illustration"
              className="max-w-full rounded-xl border border-white/10"
              onError={() => setImgError(true)}
            />
          )}
        </div>
      )}

      {/* Status row — only show after typing finishes */}
      {!isTyping && (
        <div className="flex items-center gap-3">
          {isActive && !step.done && (
            <>
              <span className="flex items-center gap-1.5 text-xs text-yellow-500/80">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                In progress
              </span>
              <button
                onClick={onMarkDone}
                className="text-xs text-gray-500 border border-white/10 rounded-lg px-3 py-1 hover:border-white/30 hover:text-gray-300 transition-all"
              >
                Mark as done
              </button>
            </>
          )}
          {step.done && (
            <span className="flex items-center gap-1.5 text-xs text-green-500/70">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
              </svg>
              Done
            </span>
          )}
        </div>
      )}
    </div>
  )
}
