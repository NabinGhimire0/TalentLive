import React, { useEffect, useState } from 'react'
import api from '../../axios'
import { Dialog } from '@headlessui/react'

const CategoriesManager = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ name: '', id: null })
  const [isEdit, setIsEdit] = useState(false)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await api.get('api/categories')
      setCategories(res.data?.data || [])
    } catch {
      setCategories([{ id: 0, name: 'Error occurred' }])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isEdit) {
        await api.put(`/api/categories/${form.id}`, { name: form.name })
      } else {
        await api.post('/api/categories', { name: form.name })
      }
      fetchCategories()
      closeModal()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return
    setLoading(true)
    try {
      await api.delete(`/api/categories/${id}`)
      fetchCategories()
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (cat = null) => {
    setIsEdit(!!cat)
    setForm(cat ? { id: cat.id, name: cat.name } : { id: null, name: '' })
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setForm({ id: null, name: '' })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Categories</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Category
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-sm font-medium">ID</th>
                <th className="px-6 py-3 text-sm font-medium">Name</th>
                <th className="px-6 py-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-gray-50 transition border-b"
                >
                  <td className="px-6 py-4">{cat.id}</td>
                  <td className="px-6 py-4">{cat.name}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => openModal(cat)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <Dialog.Title className="text-xl font-bold mb-4">
              {isEdit ? 'Edit' : 'Add'} Category
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Category name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border px-4 py-2 rounded-lg focus:ring focus:outline-none"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}

export default CategoriesManager
