import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import AuthImagePattern from './AuthImagePattern'
import type { ILoginProps } from '@/types/Auth/LoginPropTypes'

const Login = ({
  formData,
  handleSubmit,
  isLoggingIn,
  setFormData,
  setShowPassword,
  showPassword,
}: ILoginProps) => {
  return (
    <>
      <div className="grid h-screen lg:grid-cols-2">
        <div className="flex flex-col items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="mb-8 text-center">
              <div className="flex flex-col items-center gap-2 group">
                <div className="flex items-center justify-center w-12 h-12 transition-colors rounded-xl bg-primary/10 group-hover:bg-primary/20">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h1 className="mt-2 text-2xl font-bold">Welcome Back</h1>
                <p className="text-base-content/60">Sign in to your account</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="font-medium label-text">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="w-5 h-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 input input-bordered placeholder:text-base-content/40"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="font-medium label-text">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="w-5 h-5 text-base-content/40" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 input input-bordered placeholder:text-base-content/40"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-base-content/40" />
                    ) : (
                      <Eye className="w-5 h-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full btn btn-primary"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
            <div className="text-center">
              <p className="text-base-content/60">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="link link-primary">
                  Sign up
                </Link>
              </p>
              <Link to="/forgot-password" className="link link-primary">
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
        <AuthImagePattern
          title={'Welcome!'}
          subtitle={
            'Sign in to continue your conversations and catch up with your messages.'
          }
        />
      </div>
    </>
  )
}

export default Login
