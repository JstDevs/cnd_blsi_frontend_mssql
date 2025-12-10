import React, { useEffect, useState } from 'react'
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Save,
  X,
  FileText,
  Check,
  XCircle,
  Calendar,
  DollarSign,
  Trash2
} from 'lucide-react'
import Modal from '../../../components/common/Modal'
import BudgetSupplementalRequestModal from '../../../components/modals/BudgetSupplementalRequestModal'

const departments = [
  'all',
  'Treasury',
  'Administration',
  'IT Department',
  'Finance'
]
const statuses = ['all', 'pending', 'approved', 'rejected', 'posted']

const BudgetSupplemental = () => {
  const API_URL = import.meta.env.VITE_API_URL

  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDepartment, setFilterDepartment] = useState('all')

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [requestData, setRequestData] = useState([])

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'posted':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <Check className='w-4 h-4' />
      case 'rejected':
        return <XCircle className='w-4 h-4' />
      case 'posted':
        return <FileText className='w-4 h-4' />
      default:
        return <Calendar className='w-4 h-4' />
    }
  }

  const filteredRequests = requestData?.filter((request) => {
    const matchesSearch =
      request?.InvoiceNumber?.toLowerCase().includes(
        searchTerm.toLowerCase()
      ) || request?.Budget?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' || request?.Status === filterStatus
    return matchesSearch && matchesStatus
  })

  const currentRequest = selectedRequest || requestData[0] || null

  const handleCreate = () => {
    setSelectedRequest(null)
    setIsModalOpen(true)
  }

  const handleApprove = () => {
    if (selectedRequest) {
      // Handle approval logic
      console.log('Approving request:', selectedRequest.invoiceNumber)
    }
  }

  const handleReject = () => {
    if (selectedRequest) {
      // Handle rejection logic
      console.log('Rejecting request:', selectedRequest.invoiceNumber)
    }
  }

  const handleSave = () => {
    if (isEditing) {
      setIsEditing(false)
      // Handle save logic
      console.log('Saving changes...')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setShowNewRequestForm(false)
  }

  const handleEdit = (record) => {
    setSelectedRequest(record)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/budget/${id}`, {
        method: 'DELETE'
      })
      const res = await response.json()
      if (res) {
        const filterBudgets = requestData?.filter((item) => item?.ID !== id)
        setRequestData(filterBudgets)
        setIsModalOpen(false)
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const handleSubmit = () => {}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/budget/budgetsupplemental`, {
          method: 'GET'
        })
        const res = await response.json()
        if (res?.success) {
          setRequestData(res?.data)
        } else {
          console.log('Something went wrong')
        }
      } catch (error) {
        throw new Error(error.message)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <div className='space-y-6'>
        {/* Header & Actions */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>
              Budget Supplemental Requests
            </h2>
            <p className='text-gray-600'>
              Manage and approve supplemental budget requests
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <button
              onClick={handleCreate}
              className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              <Plus className='w-4 h-4 mr-2' />
              New Request
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Requests
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {requestData?.length}
                </p>
              </div>
              <FileText className='w-8 h-8 text-blue-600' />
            </div>
          </div>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Pending Approval
                </p>
                <p className='text-2xl font-bold text-yellow-600'>
                  {requestData?.filter((r) => r.Status === 'pending').length}
                </p>
              </div>
              <Calendar className='w-8 h-8 text-yellow-600' />
            </div>
          </div>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Approved</p>
                <p className='text-2xl font-bold text-green-600'>
                  {requestData?.filter((r) => r.Status === 'approved').length}
                </p>
              </div>
              <Check className='w-8 h-8 text-green-600' />
            </div>
          </div>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Amount
                </p>
                <p className='text-2xl font-bold text-purple-600'>
                  $
                  {requestData
                    ?.reduce((sum, r) => sum + r?.Total, 0)
                    .toLocaleString()}
                </p>
              </div>
              <DollarSign className='w-8 h-8 text-purple-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Invoice Number
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Amount
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Invoice Date
                  </th>
                  <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredRequests?.map((item) => (
                  <tr
                    key={item?.ID}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer`}
                    onClick={() => setSelectedBudget(item)}
                  >
                    <td className='px-6 py-4 text-sm capitalize font-medium text-gray-900'>
                      {item?.InvoiceNumber}
                    </td>
                    <td className='px-6 py-4 text-sm capitalize font-medium text-gray-900'>
                      {item?.Status}
                    </td>
                    <td className='px-6 py-4 text-sm capitalize font-medium text-gray-900'>
                      {item?.Total}
                    </td>
                    <td className='px-6 py-4 text-sm text-right capitalize font-medium text-gray-900'>
                      {item?.InvoiceDate}
                    </td>
                    <td className='px-6 py-4 text-center'>
                      <div className='flex items-center justify-center space-x-3'>
                        <button className='text-green-600 hover:text-green-800 transition-colors'>
                          <Edit2
                            className='w-4 h-4'
                            onClick={() => handleEdit(item)}
                          />
                        </button>
                        <button className='text-red-600 hover:text-red-800 transition-colors'>
                          <Trash2
                            className='w-4 h-4'
                            onClick={() => handleDelete(item?.ID)}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        size='md'
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRequest ? 'Edit Request' : 'Add Request'}
      >
        <BudgetSupplementalRequestModal
          onSubmit={handleSubmit}
          initialData={selectedRequest}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  )
}

export default BudgetSupplemental
