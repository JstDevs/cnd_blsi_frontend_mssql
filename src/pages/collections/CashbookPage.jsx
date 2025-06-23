import { useState } from 'react';
import CashbookForm from '../../components/forms/CashbookForm';
import DataTable from '../../components/common/DataTable';

// Mock data for cashbook entries
const mockCashbookData = [
  {
    id: 1,
    date: '2024-03-01',
    reference: 'OR-2024-001',
    description: 'Collection - Community Tax',
    debit: 5000.00,
    credit: 0.00,
    balance: 5000.00
  },
  {
    id: 2,
    date: '2024-03-02',
    reference: 'DV-2024-001',
    description: 'Payment - Office Supplies',
    debit: 0.00,
    credit: 2500.00,
    balance: 2500.00
  },
  {
    id: 3,
    date: '2024-03-03',
    reference: 'OR-2024-002',
    description: 'Collection - Burial Service',
    debit: 3000.00,
    credit: 0.00,
    balance: 5500.00
  },
  {
    id: 4,
    date: '2024-03-04',
    reference: 'DV-2024-002',
    description: 'Payment - Utility Bills',
    debit: 0.00,
    credit: 1500.00,
    balance: 4000.00
  },
  {
    id: 5,
    date: '2024-03-05',
    reference: 'OR-2024-003',
    description: 'Collection - Marriage Service',
    debit: 2000.00,
    credit: 0.00,
    balance: 6000.00
  }
];

function CashbookPage() {
  const [cashbookData, setCashbookData] = useState(mockCashbookData);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      switch (values.action) {
        case 'view':
          // For demo, we'll just show the mock data
          setCashbookData(mockCashbookData);
          break;
        case 'generate':
          // For demo, we'll just show the mock data
          setCashbookData(mockCashbookData);
          break;
        case 'export':
          // For demo, we'll just show the mock data
          setCashbookData(mockCashbookData);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error handling cashbook action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { 
      header: 'Date', 
      accessor: 'date',
      cell: ({ value }) => new Date(value).toLocaleDateString()
    },
    { header: 'Reference', accessor: 'reference' },
    { header: 'Description', accessor: 'description' },
    { 
      header: 'Debit', 
      accessor: 'debit',
      cell: ({ value }) => value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'PHP'
      })
    },
    { 
      header: 'Credit', 
      accessor: 'credit',
      cell: ({ value }) => value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'PHP'
      })
    },
    { 
      header: 'Balance', 
      accessor: 'balance',
      cell: ({ value }) => value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'PHP'
      })
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Cashbook</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <CashbookForm onSubmit={handleSubmit} />
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={cashbookData}
          loading={isLoading}
          emptyMessage="No cashbook entries found for the selected date range."
        />
      </div>
    </div>
  );
}

export default CashbookPage; 