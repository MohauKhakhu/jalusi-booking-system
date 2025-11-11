import React, { useState } from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import './styles/Login.css'  // new CSS file

const Login = () => {
  const navigate = useNavigate()
  const auth = getAuth()

  const [authing, setAuthing] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const signInWithGoogle = async () => {
    setAuthing(true)
    try {
      const response = await signInWithPopup(auth, new GoogleAuthProvider())
      console.log(response.user.uid)
      navigate('/components/Home')
    } catch (err) {
      console.error('Google Sign-In Error:', err)
      setError('Google Sign-In failed. Please try again.')
      setAuthing(false)
    }
  }

  const signInWithEmail = async (e) => {
    e.preventDefault()
    setAuthing(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/components/Home')
    } catch (err) {
      console.error('Email Sign-In Error:', err)
      setError('Invalid email or password.')
      setAuthing(false)
    }
  }

  return (
    <div className="signupWrapper">
      <div className="signupCard">
        <h2 className="signupTitle">Login</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form className="signupForm" onSubmit={signInWithEmail}>
          <div className="inputGroup">
            <FaEnvelope className="inputIcon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="inputGroup">
            <FaLock className="inputIcon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btnSignup" disabled={authing}>
            {authing ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <hr style={{ width: '100%', margin: '1.5rem 0' }} />

        <button className="btnSignup" onClick={signInWithGoogle} disabled={authing}>
          Sign in with Google
        </button>
      </div>
    </div>
  )
}

export default Login
