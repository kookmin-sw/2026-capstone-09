'use client'

import { useState } from 'react'

export default function Home() {
  const [version, setVersion] = useState('')

  const onClick = async () => {
    const v = await window.desktop.getVersion()
    setVersion(v)
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Web + Electron</h1>
      <button onClick={onClick}>앱 버전 확인</button>
      <p>{version}</p>
    </main>
  )
}