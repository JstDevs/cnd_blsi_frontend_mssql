import { useState } from 'react';
import DataTable from '@/components/common/DataTable';
import { EyeIcon, PencilIcon } from 'lucide-react';
import CollectionReportForm from './CollectionReportForm';
import {
  exportCollectionReportToExcel,
  fetchCollectionReport,
} from './CollectionHelperAPIs';
import toast from 'react-hot-toast';

function CollectionReportPage() {
  const [reportData, setReportData] = useState({
    daily: [],
    monthly: [],
    quarterly: [],
    flexible: [],
  });
  const [activeReportType, setActiveReportType] = useState('daily');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    console.log('Form data:', values);
    try {
      switch (values.action) {
        case 'view':
          const data = await fetchCollectionReport(
            values.reportType,
            values.params
          );
          setReportData((prev) => ({
            ...prev,
            [values.reportType]: data,
          }));

          setActiveReportType(values.reportType);
          console.log(data);

          break;
        case 'generate':
          setCollectionData([]);
        case 'export':
          await exportCollectionReportToExcel(values.reportType, values.params);

          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error handling collection report action:', error);
      toast.error('Failed to handle collection report action.');
    } finally {
      setIsLoading(false);
    }
  };
  // Actions for table rows
  // const actions = [
  //   {
  //     icon: EyeIcon,
  //     title: 'View',
  //     onClick: () => {},
  //     className:
  //       'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
  //   },
  //   {
  //     icon: PencilIcon,
  //     title: 'Edit',
  //     onClick: () => {},
  //     className:
  //       'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
  //   },
  // ];
  const reportColumns = {
    daily: [
      {
        key: 'ChargeAccountID', // Added key
        header: 'Charge Account ID',

        render: (value) => value || '-',
      },
      {
        key: 'FundsID', // Added key
        header: 'Funds ID',

        render: (value) => value || '-',
      },
      {
        key: 'Name', // Added key
        header: 'Name',

        render: (value) => value || '-',
      },
      {
        key: 'Account', // Added key
        header: 'Account',

        render: (value) => value || '-',
      },
      {
        key: 'SubTotal', // Added key
        header: 'Sub-Total',

        render: (value) =>
          value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'PHP',
          }),
      },
      {
        key: 'Date', // Added key
        header: 'Date',

        render: (value) => new Date(value).toLocaleDateString(),
      },
      {
        key: 'FullName', // Added key
        header: 'Full Name',

        render: (value) => value || '-',
      },
      {
        key: 'Position', // Added key
        header: 'Position',

        render: (value) => value || '-',
      },
    ],
    monthly: [
      {
        key: 'Month',
        header: 'Month',
      },
      {
        key: 'Year',
        header: 'Year',
      },
      {
        key: 'ChargeAccountID',
        header: 'Charge Account ID',
      },
      {
        key: 'Name',
        header: 'Expense Name',
      },
      {
        key: 'SubTotal',
        header: 'Amount',

        render: (value) =>
          value?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'PHP',
          }) || '-',
      },
      {
        key: 'DateRange',
        header: 'Date Range',
        render: (_, row) => {
          return `${row.Date1} to ${row.Date2}`;
        }, // Display the combined string
        // render: (value) => `${value.Date1} to ${value.Date2}`,
      },
      {
        key: 'FullName',
        header: 'Processed By',
      },
      {
        key: 'Position',
        header: 'Position',
      },
      {
        key: 'ChartOfAccounts',
        header: 'Chart of Accounts',
      },
    ],

    quarterly: [
      {
        key: 'Quarter',
        header: 'Quarter',
      },
      {
        key: 'Year',
        header: 'Year',
      },
      {
        key: 'ChargeAccountID',
        header: 'Charge Account ID',
      },
      {
        key: 'Name',
        header: 'Expense Name',
      },
      {
        key: 'FundName',
        header: 'Fund Name',
      },
      {
        key: 'QuarterlyBreakdown',
        header: 'Quarterly Breakdown',

        render: (_, row) =>
          `Q1: ${row.First} | Q2: ${row.Second} | Q3: ${row.Third}`,
      },
      {
        key: 'Total',
        header: 'Total',

        render: (value) =>
          value?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'PHP',
          }) || '-',
      },
      {
        key: 'FullName',
        header: 'Processed By',
      },
      {
        key: 'Position',
        header: 'Position',
      },
    ],

    flexible: [
      {
        key: 'DateRange',
        header: 'Date Range',

        render: (_, row) => `${row.StartDate} to ${row.EndDate}`,
      },
      {
        key: 'InvoiceNumber',
        header: 'Invoice #',
      },
      {
        key: 'CustomerName',
        header: 'Customer',
      },
      {
        key: 'Municipality',
        header: 'Municipality',
      },
      {
        key: 'Province',
        header: 'Province',
      },
      {
        key: 'Total',
        header: 'Amount',

        render: (value) =>
          value?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'PHP',
          }) || '-',
      },
      {
        key: 'ProcessedBy',
        header: 'Processed By',

        render: (_, row) => `${row.Prepare} (${row.PreparePosition})`,
      },
      {
        key: 'NotedBy',
        header: 'Noted By',

        render: (_, row) => `${row.Poster} (${row.NotedPosition})`,
      },
      {
        key: 'Note',
        header: 'Remarks',
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Collection Report
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <CollectionReportForm
          onSubmitCollectionReport={handleSubmit}
          activeReportType={activeReportType}
          setActiveReportType={setActiveReportType}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={reportColumns[activeReportType]}
          data={reportData[activeReportType]}
          loading={isLoading}
          // actions={actions}
          emptyMessage="No collection entries found for the selected date."
        />
      </div>
    </div>
  );
}

export default CollectionReportPage;
