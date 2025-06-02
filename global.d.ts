// global.d.ts
interface Window {
  netlifyIdentity: {
    on: (event: string, callback: () => void) => void
    open: (tab?: 'login' | 'signup') => void
    close: () => void
    currentUser: () => { email: string } | null
    logout: () => Promise<void>
    init: (options?: any) => void
  }
}
