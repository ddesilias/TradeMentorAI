// lib/useSpeechSynthesis.ts
import { useState, useEffect, useCallback } from 'react'

export const useSpeechSynthesis = () => {
  const [speaking, setSpeaking] = useState(false)
  const [textQueue, setTextQueue] = useState<string[]>([])
  const synth = window.speechSynthesis

  const speak = useCallback(
    (text: string, lang: string = 'en-US') => {
      if (synth.speaking || speaking) {
        setTextQueue(prevQueue => [...prevQueue, text])
        return
      }

      const utterThis = new SpeechSynthesisUtterance(text)
      utterThis.onend = () => {
        setSpeaking(false)
        if (textQueue.length > 0) {
          const nextText = textQueue.shift()
          if (nextText) speak(nextText)
        }
      }

      utterThis.onerror = event => {
        setSpeaking(false)
        console.error('SpeechSynthesisUtterance.onerror', event)
      }

      utterThis.lang = lang
      synth.speak(utterThis)
      setSpeaking(true)
    },
    [speaking, textQueue]
  )

  useEffect(() => {
    if (!synth.speaking && textQueue.length > 0) {
      const nextText = textQueue.shift()
      if (nextText) speak(nextText)
    }
  }, [speak, textQueue])

  return { speak, speaking }
}
