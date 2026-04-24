import { useState, useRef } from 'react'

export default function PromptInput({ onSubmit, disabled }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setValue('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const canSend = value.trim().length > 0 && !disabled

  return (
    <div className="shrink-0 bg-[#111111] pb-6 px-4">
      <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 bg-[#1e1e1e] border border-white/10 rounded-2xl px-4 py-3 shadow-xl focus-within:border-white/25 focus-within:shadow-white/5 transition-all duration-200">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-600 focus:outline-none disabled:cursor-not-allowed"
              placeholder="Message Step Assistant..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
            />

            {/* Loading spinner when disabled */}
            {disabled && (
              <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                <svg className="animate-spin w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
            )}

            {/* Send button */}
            {!disabled && (
              <button
                onClick={handleSubmit}
                disabled={!canSend}
                aria-label="Send"
                className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 ${
                  canSend
                    ? 'bg-white text-black hover:bg-gray-100 active:scale-95 shadow-sm'
                    : 'bg-white/8 text-gray-700 cursor-not-allowed'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.288Z" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-center text-xs text-gray-700 mt-2">Enter to send · Step Assistant may make mistakes</p>
        </div>
    </div>
  )
}
