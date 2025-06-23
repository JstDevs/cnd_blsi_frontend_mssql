import { customStyles } from '@/utils/customStyles'
import React, { useState } from 'react'
import DataTable from 'react-data-table-component'

const StatementComparison = () => {
  const [fiscalYear, setFiscalYear] = useState('Test')

  const columns = [
    {
      name: 'Department',
      selector: (row) => row.name,
      sortable: true
    },
    {
      name: 'Budget',
      selector: (row) => row.email
    },
    {
      name: 'Actual',
      selector: (row) => row.email
    },
    {
      name: 'Difference',
      selector: (row) => row.email
    }
  ]

  const data = []

  return (
    <div className='p-6 bg-gray-50 shadow rounded-xl space-y-8'>
      <h1 className='text-2xl font-semibold text-gray-800'>
        Summary of Comparison of Budget and Actual Amount
      </h1>

      <div className='flex flex-col sm:flex-row justify-between gap-4 mb-6 items-stretch sm:items-end'>
        {/* Fiscal Year Dropdown */}
        <div className='w-full md:w-56'>
          <label className='block text-sm font-medium text-gray-600 mb-1'>
            Fiscal Year
          </label>
          <select
            value={fiscalYear}
            onChange={(e) => setFiscalYear(e.target.value)}
            className='w-full rounded-md border border-gray-300 shadow-sm px-3 py-2'
          >
            <option>Test</option>
            <option>2025</option>
            <option>2024</option>
            <option>2023</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-2 sm:items-end'>
          <button className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full sm:w-auto'>
            View
          </button>
          <button className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full sm:w-auto'>
            Generate Journal
          </button>
          <button className='bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 w-full sm:w-auto'>
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

export default StatementComparison
