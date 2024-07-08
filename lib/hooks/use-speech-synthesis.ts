import { useEffect, useState } from 'react'

const useSpeechSynthesis = (
  text: string,
  delay: number = 1000,
  lang: string = 'fr-FR'
) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [debouncedText, setDebouncedText] = useState(text)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(text)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [text, delay])

  useEffect(() => {
    if (!debouncedText) return

    const utter = new SpeechSynthesisUtterance(debouncedText)
    utter.lang = lang
    utter.onstart = () => setIsSpeaking(true)
    utter.onend = () => setIsSpeaking(false)

    const voices = window.speechSynthesis.getVoices()
    const selectedVoice =
      voices.find(voice => voice.name === 'Daniel (French (France))') ||
      voices[0]
    console.log('selectedVoice', selectedVoice)
    if (selectedVoice) {
      utter.voice = selectedVoice
    }

    window.speechSynthesis.speak(utter)

    // Cleanup function to stop speech synthesis
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [debouncedText, lang])

  return { isSpeaking }
}

export default useSpeechSynthesis
