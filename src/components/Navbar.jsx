import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b shadow-sm">
      <Link to="/" className="font-bold text-xl">🔍 Campus Lost & Found</Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm text-gray-500">Hi, {user.name}</span>
            <Link to="/post" className="text-sm bg-black text-white px-3 py-1.5 rounded-lg">
              + Post Item
            </Link>
            <button onClick={logout} className="text-sm text-red-500">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-gray-600">Login</Link>
            <Link to="/register" className="text-sm bg-black text-white px-3 py-1.5 rounded-lg">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}