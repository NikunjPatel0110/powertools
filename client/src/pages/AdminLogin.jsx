import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await api.login({ username, password })
      if (data.token) {
        localStorage.setItem('admin_token', data.token)
        navigate('/admin')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch {
      setError('Connection error')
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Admin Panel</h1>
        <p className="subtitle">System Overview</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', minHeight: 44, textAlign: 'center', marginTop: 12 }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
