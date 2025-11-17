import React, { useState } from "react"
import AuthLayout from "../../components/layouts/AuthLayout"
import { Link, useNavigate } from "react-router-dom"
import Input from "../../components/Inputs/Input"

const validateEmail = (email) =>
  /^\S+@\S+\.\S+$/.test(String(email).toLowerCase())

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setError(null)

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (!password) {
      setError("Please enter the password")
      return
    }

    // TODO: call your login API here
    // on success:
    // navigate('/') or whatever route you want
    // on failure: setError("Invalid credentials")

    setError(null)
  }

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Enter your details to log in
        </p>

        <form onSubmit={handleLogin} className="flex flex-col">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />
          {error && (
            <p className="text-red-500 text-xs pb-2.5">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary">
            LOGIN
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to={"/signup"}>
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login
