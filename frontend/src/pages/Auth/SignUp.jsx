import React, { useState, useEffect } from "react"
import AuthLayout from "../../components/layouts/AuthLayout"
import Input from "../../components/Inputs/Input"
import { useNavigate, Link } from "react-router-dom"
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector"

const validateEmail = (email) =>
  /^\S+@\S+\.\S+$/.test(String(email).toLowerCase())

const SignUp = () => {
  const [fullName, setFullName] = useState("")
  const [profilePic, setProfilePic] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [adminInviteToken, setAdminInviteToken] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError(null)

    if (!fullName.trim()) {
      setError("Please enter your full name.")
      return
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setLoading(true)
    try {
      // Example: POST formdata to your API (uncomment & set URL)
      // const form = new FormData()
      // form.append("fullName", fullName)
      // form.append("email", email)
      // form.append("password", password)
      // if (profilePic) form.append("profilePic", profilePic)
      // if (adminInviteToken) form.append("adminInviteToken", adminInviteToken)
      // const res = await fetch("/api/signup", { method: "POST", body: form })
      // if (!res.ok) throw new Error("Signup failed")

      // simulate API
      await new Promise((r) => setTimeout(r, 900))

      // success
      navigate("/login")
    } catch (err) {
      setError(err?.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 px-8 py-6">
            <h3 className="text-3xl font-bold text-white mb-1">Create Account</h3>
            <p className="text-indigo-100 text-sm">Join us today and get started</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSignup} className="space-y-5">

              <ProfilePhotoSelector file={profilePic} setFile={setProfilePic} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Full name</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    type="text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Admin invite </label>
                  <Input
                    value={adminInviteToken}
                    onChange={(e) => setAdminInviteToken(e.target.value)}
                    placeholder="Invite token"
                    type="text"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">Password</label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  type="password"
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <svg className="w-5 h-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V6a1 1 0 112 0v3a1 1 0 01-2 0zm0 4a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create account"
                )}
              </button>

            </form>

            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700 underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </AuthLayout>
  )
}

export default SignUp
