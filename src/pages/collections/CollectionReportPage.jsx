import { useState } from 'react';
import CollectionReportForm from '../../components/forms/CollectionReportForm';
import DataTable from '../../components/common/DataTable';
import { EyeIcon, PencilIcon } from 'lucide-react';

// Mock data for collection report
// Sample data remains the same
const mockCollectionData = [
  {
    id: 1,
    chargeAccountId: 'CA-2023-001',
    fundsId: 'FUND-001',
    name: 'Office Supplies',
    account: 'General Expenses',
    subTotal: 12500.75,
    date: '2023-05-15',
    fullName: 'Juan Dela Cruz',
    position: 'Administrative Officer',
  },
  // ... other data items
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
  // Actions for table rows
  const actions = [
    {
      icon: EyeIcon,
      title: 'View',
      onClick: () => {},
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: () => {},
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
  ];
  const columns = [
    {
      key: 'chargeAccountId', // Added key
      header: 'Charge Account ID',
      accessor: 'chargeAccountId',
      cell: ({ value }) => value || '-',
    },
    {
      key: 'fundsId', // Added key
      header: 'Funds ID',
      accessor: 'fundsId',
      cell: ({ value }) => value || '-',
    },
    {
      key: 'name', // Added key
      header: 'Name',
      accessor: 'name',
      cell: ({ value }) => value || '-',
    },
    {
      key: 'account', // Added key
      header: 'Account',
      accessor: 'account',
      cell: ({ value }) => value || '-',
    },
    {
      key: 'subTotal', // Added key
      header: 'Sub-Total',
      accessor: 'subTotal',
      cell: ({ value }) =>
        value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'PHP',
        }),
    },
    {
      key: 'date', // Added key
      header: 'Date',
      accessor: 'date',
      cell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'fullName', // Added key
      header: 'Full Name',
      accessor: 'fullName',
      cell: ({ value }) => value || '-',
    },
    {
      key: 'position', // Added key
      header: 'Position',
      accessor: 'position',
      cell: ({ value }) => value || '-',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Collection Report
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <CollectionReportForm onSubmit={handleSubmit} />
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={collectionData}
          loading={isLoading}
          actions={actions}
          emptyMessage="No collection entries found for the selected date."
        />
      </div>
    </div>
  );
}

export default CollectionReportPage;
