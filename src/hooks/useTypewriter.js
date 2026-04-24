import { useState, useEffect, useRef } from 'react'

/**
 * Typewriter effect hook — reveals text character by character.
 * Only animates once per unique text. If the text was already shown, returns it immediately.
 *
 * @param {string} text - The full text to reveal
 * @param {number} speed - Milliseconds per character (default 25)
 * @returns {{ displayText: string, isTyping: boolean }}
 */
export function useTypewriter(text, speed = 25) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const seenRef = useRef(new Set())

  useEffect(() => {
    // If we've already typed this text, show it immediately
    if (seenRef.current.has(text)) {
      setDisplayText(text)
      setIsTyping(false)
      return
    }

    setDisplayText('')
    setIsTyping(true)
    let i = 0

    const interval = setInterval(() => {
      i++
      setDisplayText(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setIsTyping(false)
        seenRef.current.add(text)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return { displayText, isTyping }
}
