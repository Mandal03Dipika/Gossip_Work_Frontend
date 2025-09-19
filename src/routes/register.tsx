import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import Register from '@/features/Auth/components/Register'
import { useAuthContext } from '@/features/Auth/contexts/AuthContext'
import OtpVerification from '@/features/Auth/components/OtpVerification'

export const Route = createFileRoute('/register')({
  component: RegisterRoute,
})

function RegisterRoute() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [formData, setFormData] = useState<{
    name: string
    email: string
    password: string
  }>({
    name: '',
    email: '',
    password: '',
  })
  const [isOtpStage, setIsOtpStage] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const { register, isSigningUp } = useAuthContext() ?? {}

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      return false
    }
    if (!formData.email.trim()) {
      return false
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return false
    }
    if (!formData.password) {
      return false
    }
    if (formData.password.length < 8) {
      return false
    }
    return true
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const success = validateForm()
    if (success && register) {
      register(formData, (res: any) => {
        if (res.success) {
          console.log('OTP sent to your email')
          setRegisteredEmail(formData.email)
          setIsOtpStage(true)
        } else {
          console.log('Error in handle Submit')
        }
      })
    }
  }

  if (isOtpStage) {
    return <OtpVerification email={registeredEmail} />
  }

  return (
    <Register
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
      isSigningUp={isSigningUp ?? false}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
    />
  )
}
