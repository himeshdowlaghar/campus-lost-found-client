import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`, form
      )
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
      <p className="text-gray-500 text-sm mb-6">Login to your campus account</p>
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input placeholder="Email" type="email" required
          className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Password" type="password" required
          className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          onChange={e => setForm({...form, password: e.target.value})} />
        <button type="submit" disabled={loading}
          className="bg-black text-white rounded-lg py-2 text-sm font-medium mt-1">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-sm text-center mt-4 text-gray-500">
        No account?{' '}
        <Link to="/register" className="text-black font-medium">Register</Link>
      </p>
    </div>
  )
}