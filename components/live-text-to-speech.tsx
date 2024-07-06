'use client'
import React, { useState, useEffect } from 'react'
import { useSpeechSynthesis } from '../lib/useSpeechSynthesis'

const LiveTextToSpeech: React.FC = () => {
  const { speak } = useSpeechSynthesis()
  const [text, setText] = useState<string>('')

  useEffect(() => {
    // Simuler la génération de texte par un modèle LLM
    const interval = setInterval(() => {
      const newText = generateText()
      setText(newText)
      speak(newText)
    }, 5000) // Générer et lire du texte toutes les 5 secondes

    return () => clearInterval(interval)
  }, [speak])

  const generateText = () => {
    // Générer du texte de manière aléatoire pour la démonstration
    const texts = [
      ''
    ]
    return texts[Math.floor(Math.random() * texts.length)]
  }

  return (
    <div className="text-center p-5">
      <h2 className="text-2xl mb-4">Live Text-to-Speech</h2>
      <div className="border p-4 rounded">
        <p>{text}</p>
      </div>
    </div>
  )
}

export default LiveTextToSpeech
