import { useState, useRef, useCallback } from 'react'
import { getSteps } from '../services/stepService.js'

/**
 * Custom hook that manages step-by-step progress state.
 *
 * @returns {{
 *   stepList: import('../types.js').Step[],
 *   activeIndex: number | null,
 *   isComplete: boolean,
 *   isLoading: boolean,
 *   error: string | null,
 *   loadSteps: (prompt: string) => Promise<void>,
 *   markDone: () => void
 * }}
 */
export function useStepTracker() {
  const [stepList, setStepList] = useState([])
  const [activeIndex, setActiveIndex] = useState(null)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Used to ignore responses from superseded requests
  const ignoreRef = useRef(false)

  const loadSteps = useCallback(async (prompt) => {
    // Cancel any in-flight request by marking it stale
    ignoreRef.current = true
    const ignore = { stale: false }
    ignoreRef.current = ignore

    setIsLoading(true)
    setError(null)
    setStepList([])
    setActiveIndex(null)
    setIsComplete(false)

    try {
      const steps = await getSteps(prompt)

      // If a newer loadSteps call was made, discard this result
      if (ignoreRef.current !== ignore) return

      if (!Array.isArray(steps) || steps.length === 0) {
        setError('The service returned no steps. Please try a different prompt.')
        return
      }

      setStepList(steps.map((s) => ({ ...s, done: false })))
      setActiveIndex(0)
    } catch (err) {
      if (ignoreRef.current !== ignore) return
      setError(
        err instanceof Error
          ? `Failed to load steps: ${err.message}`
          : 'Failed to load steps. Please check your connection and try again.'
      )
    } finally {
      if (ignoreRef.current === ignore) {
        setIsLoading(false)
      }
    }
  }, [])

  const markDone = useCallback(() => {
    // No-op when already complete or no active step
    if (isComplete || activeIndex === null) return

    setStepList((prev) => {
      const updated = prev.map((step, i) =>
        i === activeIndex ? { ...step, done: true } : step
      )

      // Check if ALL steps are now done
      const allDone = updated.every((s) => s.done)
      if (allDone) {
        setIsComplete(true)
      }

      // Stay on the current step — user navigates forward manually via arrows
      return updated
    })
  }, [isComplete, activeIndex])

  // Navigate to a specific step index
  const goToStep = useCallback((targetIndex) => {
    if (stepList.length === 0) return
    if (targetIndex < 0 || targetIndex >= stepList.length) return

    // When all steps are done, allow free navigation in both directions
    if (isComplete) {
      setActiveIndex(targetIndex)
      return
    }

    // Can only go forward if the current step is done
    if (activeIndex !== null && targetIndex > activeIndex && !stepList[activeIndex]?.done) return

    // Can only go forward up to the first undone step
    const furthestAllowed = stepList.findIndex((s) => !s.done)
    if (furthestAllowed !== -1 && targetIndex > furthestAllowed) return

    setActiveIndex(targetIndex)
  }, [stepList, activeIndex, isComplete])

  return {
    stepList,
    activeIndex,
    isComplete,
    isLoading,
    error,
    loadSteps,
    markDone,
    goToStep,
  }
}
