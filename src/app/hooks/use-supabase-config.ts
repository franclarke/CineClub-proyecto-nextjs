import { useState, useEffect } from 'react'
import { isSupabaseReady, getSupabaseConfigError, testSupabaseConnection } from '@/lib/supabase'

interface SupabaseConfigState {
  isConfigured: boolean
  isLoading: boolean
  error: string | null
  isConnected: boolean
}

/**
 * Hook to check Supabase configuration and connection status
 * Provides real-time status updates for the client
 */
export function useSupabaseConfig(): SupabaseConfigState {
  const [state, setState] = useState<SupabaseConfigState>({
    isConfigured: false,
    isLoading: true,
    error: null,
    isConnected: false
  })

  useEffect(() => {
    const checkConfiguration = async () => {
      setState(prev => ({ ...prev, isLoading: true }))
      
      try {
        // First check if environment variables are set
        const configured = isSupabaseReady()
        
        if (!configured) {
          setState({
            isConfigured: false,
            isLoading: false,
            error: getSupabaseConfigError(),
            isConnected: false
          })
          return
        }
        
        // If configured, test the connection
        const connectionTest = await testSupabaseConnection()
        
        setState({
          isConfigured: configured,
          isLoading: false,
          error: connectionTest.success ? null : connectionTest.error || 'Error desconocido',
          isConnected: connectionTest.success
        })
        
      } catch (error) {
        setState({
          isConfigured: false,
          isLoading: false,
          error: 'Error al verificar configuración de Supabase',
          isConnected: false
        })
      }
    }

    checkConfiguration()
  }, [])

  return state
}

/**
 * Simple hook to check if Supabase is ready to use
 * Returns a boolean for simple use cases
 */
export function useSupabaseReady(): boolean {
  const { isConfigured, isConnected } = useSupabaseConfig()
  return isConfigured && isConnected
} 