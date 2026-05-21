export {}

declare global {
  interface Window {
    desktop?: {
      getVersion: () => Promise<string>
      downloadUpdate: () => Promise<void>
      onUpdateAvailable: (callback: (version: string) => void) => void
    }
  }
}
