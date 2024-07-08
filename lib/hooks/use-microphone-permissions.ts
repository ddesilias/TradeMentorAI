// hooks/useMicrophonePermissions.ts
import { useEffect, useState } from 'react'

const useMicrophonePermissions = () => {
  const [permissionState, setPermissionState] = useState<
    'granted' | 'denied' | 'prompt'
  >('prompt')

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const permission = await navigator.permissions.query({
          name: 'microphone' as PermissionName
        })
        setPermissionState(permission.state)

        permission.onchange = () => {
          setPermissionState(permission.state)
        }
      } catch (error) {
        console.error('Error checking microphone permissions:', error)
      }
    }

    checkPermissions()
  }, [])

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop()) // Stop the tracks as we just need to request permission
      setPermissionState('granted')
    } catch (error) {
      setPermissionState('denied')
    }
  }

  return {
    permissionState,
    requestPermission
  }
}

export default useMicrophonePermissions
