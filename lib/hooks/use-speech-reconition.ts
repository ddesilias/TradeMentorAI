import { useState, useEffect, useRef } from 'react'

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<string | null>(null)

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Speech Recognition API is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'fr-FR'
    recognition.continuous = true
    recognition.interimResults = true
    recognitionRef.current = recognition

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      setError(event.error)
    }

    recognition.onresult = (event: any) => {
      const interimTranscript = Array.from(event.results)
        .map((result: any) => (result as SpeechRecognitionResult)[0])
        .map(result => result.transcript)
        .join('')
      setTranscript(interimTranscript)
      console.log('Transcript:', interimTranscript)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        recognition.stop()
        setIsListening(false)
      }, 5000) // Stop listening after 5 seconds of inactivity
    }

    if (isListening) {
      recognition.start()
    } else {
      recognition.stop()
    }

    return () => {
      recognition.stop()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isListening])

  return {
    transcript,
    isListening,
    error,
    startListening: () => setIsListening(true),
    stopListening: () => setIsListening(false)
  }
}

export default useSpeechRecognition
