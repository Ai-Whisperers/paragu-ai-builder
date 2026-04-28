import { useState, useCallback } from 'react'

export type AsyncState = 'idle' | 'loading' | 'success' | 'error'

export function useAsyncState<T = unknown>() {
  const [state, setState] = useState<AsyncState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const run = useCallback(async (fn: () => Promise<T>) => {
    setState('loading')
    setError(null)
    try {
      const result = await fn()
      setData(result)
      setState('success')
      return result
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error desconocido'
      setError(message)
      setState('error')
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setState('idle')
    setError(null)
    setData(null)
  }, [])

  return { state, error, data, run, reset, isLoading: state === 'loading', isError: state === 'error', isSuccess: state === 'success' }
}
