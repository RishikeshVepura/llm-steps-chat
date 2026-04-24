import { useEffect, useRef } from 'react'
import UserMessage from './UserMessage'
import StepBubble from './StepBubble'

export default function ConversationFeed({ messages, stepList, activeIndex, isComplete, onMarkDone, isLoading }) {
  const activeBubbleRef = useRef(null)

  useEffect(() => {
    activeBubbleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [activeIndex])

  const isEmpty = messages.length === 0 && !isLoading
  const currentStep = activeIndex !== null ? stepList[activeIndex] : null

  return (
    <div className="flex flex-col gap-8 py-10 min-h-full">
      {isEmpty && (
        <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-300 text-sm font-medium">How can I help you today?</p>
            <p className="text-gray-600 text-xs mt-1">Describe a task and I'll walk you through it step by step.</p>
          </div>
        </div>
      )}

      {messages[0] && <UserMessage text={messages[0]} />}

      {isLoading && (
        <div className="flex items-center gap-1.5 pl-1">
          <span className="w-2 h-2 rounded-full bg-gray-600 animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-gray-600 animate-bounce [animation-delay:120ms]" />
          <span className="w-2 h-2 rounded-full bg-gray-600 animate-bounce [animation-delay:240ms]" />
        </div>
      )}

      {currentStep && !isComplete && (
        <div ref={activeBubbleRef}>
          <StepBubble
            step={currentStep}
            isActive={!currentStep.done}
            onMarkDone={!currentStep.done ? onMarkDone : undefined}
          />
        </div>
      )}

      {messages.slice(1).map((msg, i) => (
        <UserMessage key={`msg-${i + 1}`} text={msg} />
      ))}

      {isComplete && (
        <div className="flex items-center gap-3 text-sm text-green-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
          </svg>
          All steps complete.
        </div>
      )}
    </div>
  )
}
