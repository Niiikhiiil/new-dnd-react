import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter, TouchSensor } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableItem from '../components/SortableItem'
import Loader from '../components/Loader'
import LoadingButton from '../components/LoadingButton'
import Header from '../components/Header'

const Dashboard = () => {
  const { logout } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [isFormAddUpdateLoading, setIsFormAddUpdateLoading] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [form, setForm] = useState({ title: '', description: '' })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const formRef = useRef(null)
  const productRefs = useRef({})

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await axios.get('https://dummyjson.com/products')
      setProducts(res.data.products)
    } catch (error) {
      console.log(error)
      setMessage({ type: 'error', text: 'Failed to fetch products.' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setIsFormAddUpdateLoading(true)
    try {
      if (editingId) {
        const res = await axios.put(`https://dummyjson.com/products/${editingId}`, form)
        setProducts(products.map(p => (p.id === editingId ? res.data : p)))
        setMessage({ type: 'success', text: 'Product updated successfully.' })
      } else {
        const res = await axios.post('https://dummyjson.com/products/add', form)
        setProducts(prev => {
          const updated = [...prev, res.data]
          setTimeout(() => {
            productRefs.current[res.data.id]?.scrollIntoView({ behavior: 'smooth' })
          }, 100)
          return updated
        })
        setMessage({ type: 'success', text: 'Product added successfully.' })
      }
      setForm({ title: '', description: '' })
      setEditingId(null)
    } catch (error) {
      console.log(error)
      setMessage({ type: 'error', text: 'Operation failed.' })
    } finally {
      setIsFormAddUpdateLoading(false)
    }
  }

  const handleEdit = useCallback((product) => {
    setForm({ title: product.title, description: product.description })
    setEditingId(product.id)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 0)
  }, [])

  const handleDelete = useCallback(async (id) => {
    setIsDeleteLoading(true)
    try {
      await axios.delete(`https://dummyjson.com/products/${id}`)
      setProducts(products.filter(p => p.id !== id))
      setMessage({ type: 'success', text: 'Product deleted successfully.' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete product.' })
    } finally {
      setEditingId(null)
      setIsDeleteLoading(false)
    }
  }, [products])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = products.findIndex(item => item.id === active.id)
      const newIndex = products.findIndex(item => item.id === over.id)
      const newOrder = arrayMove(products, oldIndex, newIndex)
      setProducts(newOrder)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 50,
      },
    })
  )

  return (
    <div ref={formRef}>
      <Header setShowLogoutModal={setShowLogoutModal} />

      <div className='px-3 pt-4 bg-cyan-50' >
        <form onSubmit={handleFormSubmit} className="mb-6 space-y-2  ">
          <input name="title" value={form.title} onChange={handleInputChange} placeholder="Title" className="border p-2 w-full" required />
          <input name="description" value={form.description} onChange={handleInputChange} placeholder="Description" className="border p-2 w-full" required />
          <div className='flex justify-start flex-row gap-2'>

            {isFormAddUpdateLoading ? <LoadingButton /> : <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Add'} Product</button>}
            <button
              type="button"
              onClick={() => {
                setForm({ title: '', description: '' })
                setEditingId(null)
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>

        {message && <p className={`mb-4 ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{message.text}</p>}

        {(loading || isDeleteLoading) ? (
          <Loader />
        ) : (<>
          <div className="flex w-full border-b-2 border-black-200 mb-4 pb-2">
            <div className="flex-grow font-bold">Data</div>
            <div className="text-center font-bold ">Action</div>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={products.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {products.map(product => (
                  <div
                    className='flex flex-row'
                    key={product.id}
                    ref={el => productRefs.current[product.id] = el}
                  >
                    <SortableItem
                      id={product.id}
                      product={product}
                      onEdit={handleEdit}
                      setShowDeleteModal={setShowDeleteModal}
                      setEditingId={setEditingId}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
        )}

        {showLogoutModal && (
          <div className="fixed inset-0 bg-gray-50 bg-blend-screen flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
              <p className="mb-6">Are you sure you want to log out?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutModal(false)
                    logout()
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-50 bg-blend-screen flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4">Delete Record</h2>
              <p className="mb-6">Are you sure you want to delete?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    handleDelete(editingId)
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard
