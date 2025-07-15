'use client'

import { useState, useEffect } from 'react'

export function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <span>{currentTime.toLocaleString('es-ES')}</span>
  )
} 