import { useState } from 'react';
import DataTable from '@/components/common/DataTable';
import CashbookForm from './CashbookForm';
import { exportCashbookToExcel, fetchCashbook } from './CashbookHelperAPIs';

function CashbookPage() {
  const [cashbookData, setCashbookData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const { action, ...payload } = values;
    try {
      switch (action) {
        case 'view':
          const data = await fetchCashbook(payload);
          setCashbookData(data);

          break;
        case 'generate':
          // For demo, we'll just show the mock data
          break;
        case 'export':
          await exportCashbookToExcel(payload);
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
      key: 'Year',
      header: 'Year',
      render: (value) => value || '-',
    },
    {
      key: 'Officer',
      header: 'Officer',
      render: (value) => value || '-',
    },
    {
      key: 'Fund',
      header: 'Fund',
      render: (value) => value || '-',
    },
    {
      key: 'InvoiceDate',
      header: 'Invoice Date',
      render: (value) => (value ? new Date(value).toLocaleDateString() : '-'),
    },
    {
      key: 'APAR',
      header: 'AP AR',
      render: (value) => value || '-',
    },
    {
      key: 'InvoiceNumber',
      header: 'Invoice Number',
      render: (value) => value || '-',
    },
    {
      key: 'Debit',
      header: 'Debit',
      render: (value) =>
        value
          ? value.toLocaleString('en-US', {
              style: 'currency',
              currency: 'PHP',
            })
          : '₱0.00',
    },
    {
      key: 'Credit',
      header: 'Credit',
      render: (value) =>
        value
          ? value.toLocaleString('en-US', {
              style: 'currency',
              currency: 'PHP',
            })
          : '₱0.00',
    },
    {
      key: 'Balance',
      header: 'Balance',
      render: (value) =>
        value
          ? value.toLocaleString('en-US', {
              style: 'currency',
              currency: 'PHP',
            })
          : '₱0.00',
    },
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
