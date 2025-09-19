export interface ILoginProps {
  formData: { email: string; password: string }
  setFormData: (value: { email: string; password: string }) => void
  handleSubmit: (event: React.FormEvent) => void
  isLoggingIn: boolean
  showPassword: boolean
  setShowPassword: (value: boolean) => void
}
