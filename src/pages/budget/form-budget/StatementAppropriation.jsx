import { customStyles } from '@/utils/customStyles'
import React, { useState } from 'react'
import DataTable from 'react-data-table-component'

const StatementAppropriation = () => {
  const [startDate, setStartDate] = useState('2025-06-01')
  const [endDate, setEndDate] = useState('2025-06-09')
  const [fund, setFund] = useState('Trust Fund')
  const [fiscalYear, setFiscalYear] = useState('Test')
  const [department, setDepartment] = useState(
    'Municipal Social Welfare and Development'
  )

  const columns = [
    {
      name: 'Fund',
      selector: (row) => row.name,
      sortable: true
    },
    {
      name: 'Year',
      selector: (row) => row.email
    },
    {
      name: 'Month End',
      selector: (row) => row.email
    },
    {
      name: 'Account Code',
      selector: (row) => row.email
    },
    {
      name: 'ID',
      selector: (row) => row.email
    },
    {
      name: 'Category',
      selector: (row) => row.email
    },
    {
      name: 'Name',
      selector: (row) => row.email
    },
    {
      name: 'Approriation',
      selector: (row) => row.email
    },
    {
      name: 'Allotment',
      selector: (row) => row.email
    },
    {
      name: 'Obligation',
      selector: (row) => row.email
    },
    {
      name: 'Unobligated Appropriation',
      selector: (row) => row.email
    },
    {
      name: 'Unobligated Allotment',
      selector: (row) => row.email
    },
    {
      name: 'Municipality',
      selector: (row) => row.email
    },
    {
      name: 'Province',
      selector: (row) => row.email
    },
    {
      name: 'Requested By',
      selector: (row) => row.email
    },
    {
      name: 'Position',
      selector: (row) => row.email
    }
  ]

  const data = []

  return (
    <div className='p-6 bg-gray-50 shadow rounded-xl space-y-8'>
      <h1 className='text-2xl font-semibold text-gray-800 mb-6'>
        Statement of Appropriations, Allotment, Obligations and Balances
      </h1>

      <div className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-600'>
              Start Date
            </label>
            <input
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className='px-4 py-2 rounded-md border border-neutral-200 focus:ring-primary-500 focus:border-primary-500 block w-full'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-600'>
              End Date
            </label>
            <input
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className='px-4 py-2 rounded-md border border-neutral-200 focus:ring-primary-500 focus:border-primary-500 block w-full'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-600'>
              Fund
            </label>
            <select
              value={fund}
              onChange={(e) => setFund(e.target.value)}
              className='px-4 py-2 rounded-md border border-neutral-200 focus:ring-primary-500 focus:border-primary-500 block w-full'
            >
              <option>Trust Fund</option>
              <option>General Fund</option>
              <option>Special Fund</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-600'>
              Fiscal Year
            </label>
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className='px-4 py-2 rounded-md border border-neutral-200 focus:ring-primary-500 focus:border-primary-500 block w-full'
            >
              <option>Test</option>
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-600'>
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className='px-4 py-2 rounded-md border border-neutral-200 focus:ring-primary-500 focus:border-primary-500 block w-full'
            >
              <option>Municipal Social Welfare and Development</option>
              <option>Engineering Department</option>
              <option>Health Services</option>
            </select>
          </div>
        </div>

        <div className='sm:flex grid grid-cols-1 flex-wrap gap-4'>
          <button className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'>
            View
          </button>
          <button className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700'>
            Generate SAAOB
          </button>
          <button className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700'>
            View SAO
          </button>
          <button className='bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700'>
            Generate SAO
          </button>
          <button className='sm:ml-auto bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800'>
            Export to Excel
          </button>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <DataTable
          pagination
          data={data}
          persistTableHead
          columns={columns}
          className='text-sm'
          customStyles={customStyles}
        />
      </div>
    </div>
  )
}

export default StatementAppropriation
