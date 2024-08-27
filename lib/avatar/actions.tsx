import {
  Configuration,
  NewSessionData,
  StreamingAvatarApi
} from '@heygen/streaming-avatar'
export const sendResponseToAvatar = async (
  message: string,
  avatar: StreamingAvatarApi | null,
  data: NewSessionData,
  setDebug: any
) => {
  if (!avatar?.current || !data?.sessionId) {
    setDebug('Avatar API not initialized or session ID missing')
    return
  }
  if (typeof message !== 'string') {
    return
  }

  try {
    await avatar?.current.speak({
      taskRequest: { text: message, sessionId: data.sessionId }
    })
  } catch (e) {
    console.error('Error sending message to avatar:', e)
  }
}

async function fetchAccessToken() {
  try {
    const response = await fetch('/avatar/api/get-access-token', {
      method: 'POST'
    })
    const token = await response.text()
    console.log('Access Token:', token) // Log the token to verify
    return token
  } catch (error) {
    console.error('Error fetching access token:', error)
    return ''
  }
}

async function startSession() {
  setIsLoadingSession(true)
  await updateToken()
  if (!avatar.current) {
    setDebug('Avatar API is not initialized')
    return
  }
  try {
    const res = await avatar.current.createStartAvatar(
      {
        newSessionRequest: {
          quality: 'low',
          avatarName: avatarId,
          voice: { voiceId: voiceId }
        }
      },
      setDebug
    )
    setData(res)
    setStream(avatar.current.mediaStream)
  } catch (error) {
    console.error('Error starting avatar session:', error)
    setDebug(
      `There was an error starting the session. ${voiceId ? 'This custom voice ID may not be supported.' : ''}`
    )
  }
  setIsLoadingSession(false)
}

async function updateToken() {
  const newToken = await fetchAccessToken()
  console.log('Updating Access Token:', newToken) // Log token for debugging
  avatar.current = new StreamingAvatarApi(
    new Configuration({ accessToken: newToken })
  )

  const startTalkCallback = (e: any) => {
    console.log('Avatar started talking', e)
  }

  const stopTalkCallback = (e: any) => {
    console.log('Avatar stopped talking', e)
  }

  console.log('Adding event handlers:', avatar.current)
  avatar.current.addEventHandler('avatar_start_talking', startTalkCallback)
  avatar.current.addEventHandler('avatar_stop_talking', stopTalkCallback)

  setInitialized(true)
}

async function handleInterrupt() {
  if (!initialized || !avatar.current) {
    setDebug('Avatar API not initialized')
    return
  }
  await avatar.current
    .interrupt({ interruptRequest: { sessionId: data?.sessionId } })
    .catch(e => {
      setDebug(e.message)
    })
}

async function endSession() {
  if (!initialized || !avatar.current) {
    setDebug('Avatar API not initialized')
    return
  }
  await avatar.current.stopAvatar(
    { stopSessionRequest: { sessionId: data?.sessionId } },
    setDebug
  )
  setStream(undefined)
}

async function handleSpeak() {
  setIsLoadingRepeat(true)
  if (!initialized || !avatar.current) {
    setDebug('Avatar API not initialized')
    return
  }
  await avatar.current
    .speak({ taskRequest: { text: text, sessionId: data?.sessionId } })
    .catch(e => {
      setDebug(e.message)
    })
  setIsLoadingRepeat(false)
}

function startRecording() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder.current = new MediaRecorder(stream)
      mediaRecorder.current.ondataavailable = event => {
        audioChunks.current.push(event.data)
      }
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, {
          type: 'audio/wav'
        })
        audioChunks.current = []
        transcribeAudio(audioBlob)
      }
      mediaRecorder.current.start()
      setRecording(true)
    })
    .catch(error => {
      console.error('Error accessing microphone:', error)
    })
}

function stopRecording() {
  if (mediaRecorder.current) {
    mediaRecorder.current.stop()
    setRecording(false)
  }
}

async function transcribeAudio(audioBlob: Blob) {
  try {
    // Convert Blob to File
    const audioFile = new File([audioBlob], 'recording.wav', {
      type: 'audio/wav'
    })
    const response = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: audioFile
    })
    const transcription = response.text
    console.log('Transcription: ', transcription)
  } catch (error) {
    console.error('Error transcribing audio:', error)
  }
}
