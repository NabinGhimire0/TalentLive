import React, { useEffect, useState } from 'react'
import api from '../../axios'
import { Dialog } from '@headlessui/react'

const SkillsManager = () => {
  const [skills, setSkills] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', category_id: '', id: null })
  const [isEdit, setIsEdit] = useState(false)

  const fetchCategories = async () => {
    try {
      const res = await api.get('api/categories')
      setCategories(res.data.data || [])
    } catch {
      setCategories([])
    }
  }

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const res = await api.get('api/skills')
      setSkills(res.data.data || [])
    } catch {
      setSkills([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
    fetchSkills()
  }, [])

  const openModal = (skill = null) => {
    setIsEdit(!!skill)
    setForm(skill
      ? { id: skill.id, name: skill.name, category_id: skill.category_id }
      : { id: null, name: '', category_id: categories[0]?.id || '' }
    )
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setForm({ id: null, name: '', category_id: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = { name: form.name, category_id: form.category_id }
      if (isEdit) {
        await api.put(`api/skills/${form.id}`, payload)
      } else { await api.post('api/skills', payload) }
      fetchSkills()
      closeModal()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return
    setLoading(true)
    try {
      await api.delete(`api/skills/${id}`)
      fetchSkills()
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold">Skills Manager</h2>
        <button
          onClick={() => openModal()}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Add Skill
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Skill</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition border-b">
                  <td className="px-6 py-4">{s.id}</td>
                  <td className="px-6 py-4">{s.name}</td>
                  <td className="px-6 py-4">{s.category?.name || '—'}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button onClick={() => openModal(s)} className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {skills.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500 italic">
                    No skills found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30"/>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <Dialog.Title className="text-xl font-bold mb-4">
              {isEdit ? 'Edit' : 'Add'} Skill
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Skill name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border px-4 py-2 rounded-lg focus:ring"
                required
              />
              <select
                value={form.category_id}
                onChange={e => setForm({ ...form, category_id: e.target.value })}
                className="w-full border px-4 py-2 rounded-lg focus:ring"
                required
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                  {submitting ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}

export default SkillsManager
