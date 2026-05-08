export {}

declare global {
  interface Window {
    desktop: {
      getVersion: () => Promise<string>
    }
  }
}