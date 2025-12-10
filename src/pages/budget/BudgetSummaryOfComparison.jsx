import React, { useState } from 'react'
import Modal from '../../components/common/Modal'
import BudgetForm from '../../components/forms/BudgetForm'

const BudgetSummaryOfComparison = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeRow, setActiveRow] = useState(false)

  const columns = [
    'Type',
    'SubID',
    'Subtype',
    'Category',
    'ChartOfAccounts',
    'AccountCode',
    'Original',
    'Final',
    'Difference',
    'Actual',
    'Difference2',
    'Period',
    'Original_Sum',
    'Final_Sum',
    'Difference_Sum',
    'Actual_Sum',
    'Difference2_Sum',
    'Municipality',
    'Province'
  ]

  const data = [
    {
      Type: 'Asset',
      SubID: '7',
      Subtype: 'Cash',
      Category: 'Cash on Hand',
      ChartOfAccounts: 'Cash - Local Treasury',
      AccountCode: '10101010',
      Original: '1.00',
      Final: '1.00',
      Difference: '0.00',
      Actual: '0.00',
      Difference2: '1.00',
      Period: '31-08-2024',
      Original_Sum: '1.00',
      Final_Sum: '1.00',
      Difference_Sum: '0.00',
      Actual_Sum: '0.00',
      Difference2_Sum: '1.00',
      Municipality: 'SAN DIONISIO',
      Province: 'ILOILO'
    },
    {
      Type: 'Asset',
      SubID: '7',
      Subtype: 'Cash',
      Category: 'Cash on Hand',
      ChartOfAccounts: 'Petty Cash',
      AccountCode: '10101020',
      Original: '10,40,000.00',
      Final: '10,90,000.00',
      Difference: '-50,000.00',
      Actual: '0.00',
      Difference2: '0.00',
      Period: '31-08-2024',
      Original_Sum: '10,40,000.00',
      Final_Sum: '10,90,000.00',
      Difference_Sum: '-50,000.00',
      Actual_Sum: '0.00',
      Difference2_Sum: '0.00',
      Municipality: 'SAN DIONISIO',
      Province: 'ILOILO'
    },
    {
      Type: 'Asset',
      SubID: '8',
      Subtype: 'Investments',
      Category: 'Financial Assets - Bonds',
      ChartOfAccounts: 'Investments in Bonds - Local',
      AccountCode: '10203020',
      Original: '60,000.00',
      Final: '60,000.00',
      Difference: '0.00',
      Actual: '0.00',
      Difference2: '0.00',
      Period: '31-08-2024',
      Original_Sum: '60,000.00',
      Final_Sum: '60,000.00',
      Difference_Sum: '0.00',
      Actual_Sum: '0.00',
      Difference2_Sum: '0.00',
      Municipality: 'SAN DIONISIO',
      Province: 'ILOILO'
    },
    {
      Type: 'Asset',
      SubID: '8',
      Subtype: 'Investments',
      Category: 'Investments in Treasury Bills',
      ChartOfAccounts: 'Treasury Bills',
      AccountCode: '10201030',
      Original: '28,20,001.00',
      Final: '28,20,001.00',
      Difference: '0.00',
      Actual: '0.00',
      Difference2: '0.00',
      Period: '31-08-2024',
      Original_Sum: '28,20,001.00',
      Final_Sum: '28,20,001.00',
      Difference_Sum: '0.00',
      Actual_Sum: '0.00',
      Difference2_Sum: '0.00',
      Municipality: 'SAN DIONISIO',
      Province: 'ILOILO'
    },
    {
      Type: 'Asset',
      SubID: '8',
      Subtype: 'Investments',
      Category: 'Guaranty Deposits',
      ChartOfAccounts: 'Guaranty Deposits',
      AccountCode: '10205020',
      Original: '40,000.00',
      Final: '40,000.00',
      Difference: '0.00',
      Actual: '0.00',
      Difference2: '0.00',
      Period: '31-08-2024',
      Original_Sum: '40,000.00',
      Final_Sum: '40,000.00',
      Difference_Sum: '0.00',
      Actual_Sum: '0.00',
      Difference2_Sum: '0.00',
      Municipality: 'SAN DIONISIO',
      Province: 'ILOILO'
    },
    {
      Type: 'Asset',
      SubID: '9',
      Subtype: 'Receivables',
      Category: 'Loans and Accounts Receivable',
      ChartOfAccounts: 'Notes Receivable',
      AccountCode: '10301040',
      Original: '4,80,000.00',
      Final: '4,80,000.00',
      Difference: '0.00',
      Actual: '0.00',
      Difference2: '0.00',
      Period: '31-08-2024',
      Original_Sum: '4,80,000.00',
      Final_Sum: '4,80,000.00',
      Difference_Sum: '0.00',
      Actual_Sum: '0.00',
      Difference2_Sum: '0.00',
      Municipality: 'SAN DIONISIO',
      Province: 'ILOILO'
    },
    {
      Type: 'Asset',
      SubID: '9',
      Subtype: 'Receivables',
      Category: 'Loans and Accounts Receivable',
      ChartOfAccounts: 'Real Property Tax Receivable',
      AccountCode: '10301020',
      Original: '30,000.00',
      Final: '30,000.00',
      Difference: '0.00',
      Actual: '0.00',
      Difference2: '0.00',
      Period: '31-08-2024',
      Original_Sum: '30,000.00',
      Final_Sum: '30,000.00',
      Difference_Sum: '0.00',
      Actual_Sum: '0.00',
      Difference2_Sum: '0.00',
      Municipality: 'SAN DIONISIO',
      Province: 'ILOILO'
    },
    {
      Type: 'Asset',
      SubID: '10',
      Subtype: 'Inventories',
      Category: 'Inventory Held for Consumption',
      ChartOfAccounts: 'Finished Goods Inventory',
      AccountCode: '10403030',
      Original: '8,00,000.00',
      Final: '8,00,000.00',
      Difference: '0.00',
      Actual: '0.00',
      Difference2: '0.00',
      Period: '31-08-2024',
      Original_Sum: '8,00,000.00',
      Final_Sum: '8,00,000.00',
      Difference_Sum: '0.00',
      Actual_Sum: '0.00',
      Difference2_Sum: '0.00',
      Municipality: 'SAN DIONISIO',
      Province: 'ILOILO'
    },
    {
      Type: 'Asset',
      SubID: '12',
      Subtype: 'Investment Property',
      Category: 'Land and Buildings',
      ChartOfAccounts: 'Investment Property, Land',
      AccountCode: '10601010',
      Original: '50.00',
      Final: '50.00',
      Difference: '0.00',
      Actual: '0.00',
      Difference2: '0.00',
      Period: '31-08-2024',
      Original_Sum: '50.00',
      Final_Sum: '50.00',
      Difference_Sum: '0.00',
      Actual_Sum: '0.00',
      Difference2_Sum: '0.00',
      Municipality: 'SAN DIONISIO',
      Province: 'ILOILO'
    },
    {
      Type: 'Expenses',
      SubID: '34',
      Subtype: 'Maintenance And Other Operating Expenses',
      Category: 'Traveling Expenses',
      ChartOfAccounts: 'Traveling Expenses',
      AccountCode: '50201010',
      Original: '10,000.00',
      Final: '5,000.00',
      Difference: '5,000.00',
      Actual: '0.00',
      Difference2: '0.00',
      Period: '31-08-2024',
      Original_Sum: '10,000.00',
      Final_Sum: '5,000.00',
      Difference_Sum: '5,000.00',
      Actual_Sum: '0.00',
      Difference2_Sum: '5,000.00',
      Municipality: 'SAN DIONISIO',
      Province: 'ILOILO'
    },
    {
      Type: 'Liability',
      SubID: '17',
      Subtype: 'Inter-Agency Payables',
      Category: 'Inter-Agency Payables',
      ChartOfAccounts: 'Due to LGUs',
      AccountCode: '20201070',
      Original: '0.00',
      Final: '0.00',
      Difference: '0.00',
      Actual: '0.00',
      Difference2: '0.00',
      Period: '31-08-2024',
      Original_Sum: '0.00',
      Final_Sum: '0.00',
      Difference_Sum: '0.00',
      Actual_Sum: '0.00',
      Difference2_Sum: '0.00',
      Municipality: 'SAN DIONISIO',
      Province: 'ILOILO'
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
        <h1 className='text-xl font-semibold text-gray-800'>
          Summary of Comparison of Budget and Actual Amount
        </h1>
        <div className='space-y-4'>
          {/* HEADER */}
          <div className='w-full flex flex-wrap items-end gap-3'>
            <div className='w-52'>
              <label htmlFor='fiscalYear'>Fiscal Year</label>
              <select name='fiscalYear' id='fiscalYear'>
                <option value=''>-- Select --</option>
                <option value='feb-aug'>Feb Aug</option>
                <option value='mar-aug'>Mar Aug</option>
              </select>
            </div>
            <div className='space-x-3'>
              <button className='btn'>View</button>
              <button className='btn'>Generate Journal</button>
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
                          {item.Type}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.SubID}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Subtype}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Category}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.ChartOfAccounts}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.AccountCode}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Original}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Final}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Difference}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Actual}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Difference2}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Period}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Original_Sum}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Final_Sum}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Difference_Sum}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Actual_Sum}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Difference2_Sum}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Municipality}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Province}
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

export default BudgetSummaryOfComparison
