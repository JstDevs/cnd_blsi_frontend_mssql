import { useState } from 'react';
import CollectionReportForm from '../../components/forms/CollectionReportForm';
import DataTable from '../../components/common/DataTable';

// Mock data for collection report
const mockCollectionData = [
  {
    id: 1,
    date: '2024-03-01',
    receiptNo: 'OR-2024-001',
    type: 'Community Tax',
    payor: 'John Doe',
    amount: 5000.00,
    status: 'Paid'
  },
  {
    id: 2,
    date: '2024-03-01',
    receiptNo: 'OR-2024-002',
    type: 'Burial Service',
    payor: 'Jane Smith',
    amount: 3000.00,
    status: 'Paid'
  },
  {
    id: 3,
    date: '2024-03-01',
    receiptNo: 'OR-2024-003',
    type: 'Marriage Service',
    payor: 'Robert Johnson',
    amount: 2000.00,
    status: 'Paid'
  },
  {
    id: 4,
    date: '2024-03-01',
    receiptNo: 'OR-2024-004',
    type: 'Real Property Tax',
    payor: 'Maria Garcia',
    amount: 7500.00,
    status: 'Paid'
  },
  {
    id: 5,
    date: '2024-03-01',
    receiptNo: 'OR-2024-005',
    type: 'Market Fee',
    payor: 'Market Vendor A',
    amount: 1000.00,
    status: 'Paid'
  }
];

function CollectionReportPage() {
  const [collectionData, setCollectionData] = useState(mockCollectionData);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      switch (values.action) {
        case 'view':
          // For demo, we'll just show the mock data
          setCollectionData(mockCollectionData);
          break;
        case 'generate':
          // For demo, we'll just show the mock data
          setCollectionData(mockCollectionData);
          break;
        case 'export':
          // For demo, we'll just show the mock data
          setCollectionData(mockCollectionData);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error handling collection report action:', error);
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
    { header: 'Receipt No.', accessor: 'receiptNo' },
    { header: 'Type', accessor: 'type' },
    { header: 'Payor', accessor: 'payor' },
    { 
      header: 'Amount', 
      accessor: 'amount',
      cell: ({ value }) => value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'PHP'
      })
    },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: ({ value }) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Paid' 
            ? 'bg-success-100 text-success-800'
            : 'bg-warning-100 text-warning-800'
        }`}>
          {value}
        </span>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Collection Report</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <CollectionReportForm onSubmit={handleSubmit} />
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={collectionData}
          loading={isLoading}
          emptyMessage="No collection entries found for the selected date."
        />
      </div>
    </div>
  );
}

export default CollectionReportPage; 