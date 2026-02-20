import { useRef, useState } from 'react';
import DataTable from '@/components/common/DataTable';
import CashbookForm from './CashbookForm';
import { exportCashbookToExcel, fetchCashbook } from './CashbookHelperAPIs';
import { useReactToPrint } from 'react-to-print';
import CashbookPrintView from './CashbookPrintView';
import toast from 'react-hot-toast';

function CashbookPage() {
  const [cashbookData, setCashbookData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // for printing

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Cashbook Report',
  });

  // handle submit form

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
          // setCashbookData(generated);
          if (cashbookData.length === 0) {
            toast.error('Please view the report before generating.');
            break;
          }
          handlePrint(); // auto print
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
    <>
      <div className="flex justify-between items-center mb-6 page-header">
        <h1 className="text-2xl font-semibold text-gray-900">Cashbook</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-3 sm:p-6 mb-6">
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
      {/* hidden printable view */}
      <div style={{ display: 'none' }}>
        <CashbookPrintView ref={printRef} data={cashbookData} />
      </div>
    </>
  );
}

export default CashbookPage;
