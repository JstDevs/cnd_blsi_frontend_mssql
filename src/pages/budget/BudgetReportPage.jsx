import React, { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import Modal from '../../components/common/Modal'
import BudgetForm from '../../components/forms/BudgetForm'

const BudgetReportPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeRow, setActiveRow] = useState(false)

  const columns = [
    'Name',
    'AccountCode',
    'Appropriated',
    'Adjustments',
    'Allotments',
    'Obligations',
    'AppropriationBalance',
    'AllotmentBalance'
  ]

  const data = [
    {
      Name: 'Petty Cash',
      AccountCode: '10101020',
      Appropriated: '40,000.00',
      Adjustments: '0.00',
      Allotments: '0.00',
      Obligations: '0.00',
      AppropriationBalance: '0.00',
      AllotmentBalance: '0.00'
    },
    {
      Name: 'Petty Cash',
      AccountCode: '10101020',
      Appropriated: '10,00,000.00',
      Adjustments: '0.00',
      Allotments: '0.00',
      Obligations: '0.00',
      AppropriationBalance: '0.00',
      AllotmentBalance: '0.00'
    },
    {
      Name: 'Treasury Bills',
      AccountCode: '10201030',
      Appropriated: '28,20,001.00',
      Adjustments: '0.00',
      Allotments: '0.00',
      Obligations: '0.00',
      AppropriationBalance: '0.00',
      AllotmentBalance: '0.00'
    },
    {
      Name: 'Investments in Bonds - Local',
      AccountCode: '10203020',
      Appropriated: '60,000.00',
      Adjustments: '0.00',
      Allotments: '0.00',
      Obligations: '0.00',
      AppropriationBalance: '0.00',
      AllotmentBalance: '0.00'
    },
    {
      Name: 'Guaranty Deposits',
      AccountCode: '10205020',
      Appropriated: '40,000.00',
      Adjustments: '0.00',
      Allotments: '0.00',
      Obligations: '0.00',
      AppropriationBalance: '0.00',
      AllotmentBalance: '0.00'
    },
    {
      Name: 'Real Property Tax Receivable',
      AccountCode: '10301020',
      Appropriated: '30,000.00',
      Adjustments: '0.00',
      Allotments: '0.00',
      Obligations: '0.00',
      AppropriationBalance: '0.00',
      AllotmentBalance: '0.00'
    },
    {
      Name: 'Notes Receivable',
      AccountCode: '10301040',
      Appropriated: '4,80,000.00',
      Adjustments: '0.00',
      Allotments: '0.00',
      Obligations: '0.00',
      AppropriationBalance: '0.00',
      AllotmentBalance: '0.00'
    },
    {
      Name: 'Investment Property, Land',
      AccountCode: '10601010',
      Appropriated: '50.00',
      Adjustments: '0.00',
      Allotments: '0.00',
      Obligations: '0.00',
      AppropriationBalance: '0.00',
      AllotmentBalance: '0.00'
    },
    {
      Name: 'Due to LGUs',
      AccountCode: '20201070',
      Appropriated: '0.00',
      Adjustments: '0.00',
      Allotments: '0.00',
      Obligations: '0.00',
      AppropriationBalance: '0.00',
      AllotmentBalance: '0.00'
    }
  ]

  const handleSubmit = (values) => {
    if (activeRow) {
      console.log('Updated')
    } else {
      console.log('Created')
    }
  }

  const handleEdit = (data) => {
    setActiveRow(data)
    setIsOpen(true)
  }

  return (
    <>
      <section className='space-y-8'>
        {/* TITLE */}
        <h1 className='text-xl font-semibold text-gray-800'>Budget Report</h1>
        <div className='space-y-4'>
          {/* HEADER */}
          <div className='w-full flex flex-wrap items-end gap-3'>
            <div className='w-full md:w-44'>
              <label htmlFor='startDate'>Start Date</label>
              <input type='date' placeholder='Select start date' />
            </div>
            <div className='w-full md:w-44'>
              <label htmlFor='endDate'>End Date</label>
              <input type='date' placeholder='Select start date' />
            </div>
            <div className='w-full md:w-44'>
              <label htmlFor='fund'>Select Fund</label>
              <select name='fund' id='fund'>
                <option value=''>-- Select --</option>
                <option value='operation'>Operation</option>
                <option value='management'>Management</option>
              </select>
            </div>
            <div className='w-full md:w-44'>
              <label htmlFor='fiscalYear'>Fiscal Year</label>
              <select name='fiscalYear' id='fiscalYear'>
                <option value=''>Select -- </option>
                <option value='feb-aug'>Feb Aug</option>
                <option value='mar-aug'>Mar Aug</option>
              </select>
            </div>
            <div className='w-full md:w-44'>
              <label htmlFor='department'>Department</label>
              <select name='department' id='department'>
                <option value=''>Select --</option>
                <option value='operation'>Operation</option>
                <option value='management'>Management</option>
              </select>
            </div>
            <div className='space-x-3'>
              <button className='btn'>View</button>
              <button className='btn'>Export to Excel</button>
            </div>
          </div>
          {/* COLUMNS */}
          <div className='overflow-x-auto'>
            <div className='py-2 align-middle inline-block min-w-full '>
              <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      {columns?.map((item, index) => (
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'
                        >
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.AccountCode}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Appropriated}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Adjustments}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Allotments}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Obligations}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.AppropriationBalance}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.AllotmentBalance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal
        size='md'
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={activeRow ? 'Edit Budget' : 'Add New Budget'}
      >
        <BudgetForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  )
}

export default BudgetReportPage
