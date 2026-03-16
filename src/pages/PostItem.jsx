import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function PostItem() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({
    type: 'lost', title: '', description: '', location: '', contactEmail: ''
  })

  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <p className="text-gray-500 mb-4">You need to login first to post an item</p>
        <Link to="/login" className="bg-black text-white px-4 py-2 rounded-lg text-sm">
          Go to Login
        </Link>
      </div>
    )
  }

  function handleImage(e) {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      if (image) data.append('image', image)
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/items`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting item')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 border rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-1">Post an Item</h1>
      <p className="text-gray-500 text-sm mb-6">Help your campus community</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <button type="button"
            onClick={() => setForm({...form, type: 'lost'})}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
              form.type === 'lost' ? 'bg-red-500 text-white border-red-500' : 'text-gray-600'
            }`}>
            I Lost Something
          </button>
          <button type="button"
            onClick={() => setForm({...form, type: 'found'})}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
              form.type === 'found' ? 'bg-green-500 text-white border-green-500' : 'text-gray-600'
            }`}>
            I Found Something
          </button>
        </div>
        <input placeholder="Title (e.g. Blue water bottle)" required
          className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          onChange={e => setForm({...form, title: e.target.value})} />
        <input placeholder="Where? (e.g. Library 2nd floor)"
          className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          onChange={e => setForm({...form, location: e.target.value})} />
        <textarea rows={3} placeholder="Description — color, brand, any details"
          className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black resize-none"
          onChange={e => setForm({...form, description: e.target.value})} />
        <input placeholder="Your contact email" type="email"
          className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          onChange={e => setForm({...form, contactEmail: e.target.value})} />
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          <input type="file" accept="image/*" onChange={handleImage}
            className="hidden" id="imageUpload" />
          <label htmlFor="imageUpload" className="cursor-pointer">
            {preview ? (
              <img src={preview} className="w-full h-40 object-cover rounded-lg" />
            ) : (
              <div>
                <p className="text-2xl mb-1">📷</p>
                <p className="text-sm text-gray-500">Click to upload a photo</p>
              </div>
            )}
          </label>
        </div>
        <button type="submit" disabled={loading}
          className="bg-black text-white rounded-lg py-2.5 text-sm font-medium mt-1">
          {loading ? 'Posting...' : 'Post Item'}
        </button>
      </form>
    </div>
  )
}