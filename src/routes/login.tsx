import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import Login from '@/features/Auth/components/Login'
import { useAuthContext } from '@/features/Auth/contexts/AuthContext'

export const Route = createFileRoute('/login')({
  component: LoginRoute,
})

function LoginRoute() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: '',
      password: '',
    },
  )

  const { isLoggingIn, login } = useAuthContext() ?? {}

  const validateForm = (): boolean => {
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
    if (validateForm() && login) {
      login(formData)
    }
  }
  return (
    <Login
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
      isLoggingIn={isLoggingIn ?? false}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
    />
  )
}
