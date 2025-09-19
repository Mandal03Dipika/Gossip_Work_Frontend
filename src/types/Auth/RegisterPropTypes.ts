export interface IRegisterProps {
  formData: { name: string; email: string; password: string }
  setFormData: (value: {
    name: string
    email: string
    password: string
  }) => void
  handleSubmit: (event: React.FormEvent) => void
  isSigningUp: boolean
  showPassword: boolean
  setShowPassword: (value: boolean) => void
}
