import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GeneralLedgerForm from '../../components/forms/GeneralLedgerForm';
import DataTable from '../../components/common/DataTable';
import {
  fetchGeneralLedgers,
  resetGeneralLedgerState,
} from '../../features/reports/generalLedgerSlice';
import { fetchJournalEntryById } from '../../features/disbursement/journalEntrySlice';
import { fetchFunds } from '../../features/budget/fundsSlice';
import { fetchAccounts } from '../../features/settings/chartOfAccountsSlice';
import { fetchDepartments } from '../../features/settings/departmentSlice';
import Modal from '../../components/common/Modal';
import JournalEntryForm from '../../components/forms/JournalEntryForm';
import { EyeIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from 'date-fns';
const API_URL = import.meta.env.VITE_API_URL;

function GeneralLedgerPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { generalLedgers, isLoading, error } = useSelector(
    (state) => state.generalLedger
  );
  const { selectedJournalEntry, isLoading: isJEVLoading } = useSelector(
    (state) => state.journalEntries
  );
  const { funds } = useSelector((state) => state.funds);
  const { accounts } = useSelector((state) => state.chartOfAccounts);
  const { departments } = useSelector((state) => state.departments);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // hardcoded in old software (copied from JournalEntryPage)
  const typeOptions = [
    { label: 'Cash Disbursement', value: 'Cash Disbursement' },
    { label: 'Check Disbursement', value: 'Check Disbursement' },
    { label: 'Collection', value: 'Collection' },
    { label: 'Others', value: 'Others' },
  ];
  const fundsOptions = [
    { value: 'all', label: 'All Funds' },
    ...(funds?.map((item) => ({
      value: item.ID,
      label: item.Name,
    })) || []),
  ];

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  useEffect(() => {
    dispatch(resetGeneralLedgerState());
    dispatch(fetchFunds());
    dispatch(fetchAccounts());
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Table columns definition
  const columns = [
    // {
    //   key: 'ID',
    //   header: 'ID',
    //   sortable: true,
    // },
    // {
    //   key: 'AP AR',
    //   header: 'Transaction Type',
    //   sortable: true,
    // },
    {
      key: 'Invoice Number',
      header: 'Invoice Number',
      sortable: true,
    },
    {
      key: 'Fund Name',
      header: 'Fund',
      sortable: true,
    },
    {
      key: 'Account Name',
      header: 'Account Name',
      sortable: true,
    },
    {
      key: 'Account Code',
      header: 'Account Code',
      sortable: true,
      className: 'text-left font-bold',
      render: (value) => (
        <span className="text-center font-bold">
          {value}
        </span>
      ),
    },
    {
      key: 'Invoice Date',
      header: 'Date',
      sortable: true,
      render: (value) => (
        <span className="text-right font-semibold">
          {formatDate(value, "MMMM d, yyyy")}
        </span>
      ),
    },
    // {
    //   key: 'Ledger Item',
    //   header: 'Ledger Item',
    //   sortable: true,
    // },
    // {
    //   key: 'account_code_display',
    //   header: 'Account Code Display',
    //   sortable: true,
    // },
    // {
    //   key: 'account_name_display',
    //   header: 'Account Name Display',
    //   sortable: true,
    // },
    {
      key: 'Debit',
      header: 'Debit',
      sortable: true,
      className: 'text-right font-semibold',
      render: (value) => (
        <span className="text-right font-semibold text-primary-700">
          {value < 0 ? "(" + formatCurrency(value * -1) + ")" : formatCurrency(value)} 
          {/* {formatCurrency(value)} */}
        </span>
      ),
    },
    {
      key: 'Credit',
      header: 'Credit',
      sortable: true,
      className: 'text-right font-semibold',
      render: (value) => (
        <span className="text-right font-semibold text-accent-700">
          {value < 0 ? "(" + formatCurrency(value * -1) + ")" : formatCurrency(value)} 
          {/* {formatCurrency(value)} */}
        </span>
      ),
    },
    {
      key: 'Balance',
      header: 'Balance',
      sortable: true,
      className: 'text-right font-semibold',
      render: (value) => (
        <span className="text-right font-semibold text-secondary-700">
          {value < 0 ? "(" + formatCurrency(value * -1) + ")" : formatCurrency(value)} 
          {/* {formatCurrency(value)} */}
        </span>
      ),
    },
    // {
    //   key: 'Normal Balance',
    //   header: 'Normal Balance',
    //   sortable: true,
    //   className: "text-left font-semibold"
    // },
    // {
    //   key: 'Municipality',
    //   header: 'Municipality',
    //   sortable: true,
    // },
  ];

  const actions = (row) => {
    const actionList = [];
    if (
      (row.ap_ar === 'Journal Entry Voucher' ||
        row.ap_ar === 'Burial Receipt' ||
        row.ap_ar === 'Marriage Receipt') &&
      row.transaction_id
    ) {
      actionList.push({
        icon: EyeIcon,
        title: `View ${row.ap_ar}`,
        onClick: () => {
          if (row.ap_ar === 'Journal Entry Voucher') handleViewJEV(row.transaction_id);
          if (row.ap_ar === 'Burial Receipt') handleViewBurial(row.link_id);
          if (row.ap_ar === 'Marriage Receipt') handleViewMarriage(row.link_id);
        },
        className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
    }
    return actionList;
  };

  const handleViewJEV = (id) => {
    dispatch(fetchJournalEntryById(id)).unwrap().then(() => {
      setIsModalOpen(true);
    }).catch((err) => {
      toast.error(err || 'Failed to fetch JEV details');
    });
  };

  const handleViewBurial = (linkID) => {
    // Navigate to burial record page or show modal
    navigate(`/collections/burial-service-receipts?linkID=${linkID}`);
  };

  const handleViewMarriage = (linkID) => {
    // Navigate to marriage record page or show modal
    navigate(`/collections/marriage-service-receipts?linkID=${linkID}`);
  };

  // Handle export to Excel
  const handleExport = async (values) => {
    // console.log({ values });
    try {
      const response = await fetch(`${API_URL}/generalLedger/exportExcel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Server response was not ok');

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      let filename = `General_Ledger.xlsx`;
      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1].replace(/['"]/g, '');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Optional: custom file name
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      toast.error(err.message || 'Failed to export general ledger');
    }
  };

  // Handle view to Excel
  const handleView = (values) => {
    dispatch(fetchGeneralLedgers(values));
  };

  return (
    <div>
      <div className="page-header">
        <h1>General Ledger</h1>
        <p>Review the accounts' general ledger disbursement records.</p>
      </div>

      <div className="mt-4 p-3 sm:p-6 bg-white rounded-md shadow">
        <GeneralLedgerForm
          funds={funds}
          accountOptions={Array.from(
            new Map(accounts.map((acc) => [acc.AccountCode, acc])).values()
          ).map((acc) => ({
            value: acc.AccountCode,
            label: `${acc.AccountCode} - ${acc.Name}`,
          }))}
          onExportExcel={handleExport}
          onView={handleView}
          onClose={() => { }}
        />
      </div>

      {error && (
        <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-md">
          <p className="text-error-700">{error}</p>
        </div>
      )}

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={generalLedgers}
          // actions={actions}
          loading={isLoading}
          pagination={true}
        />
      </div>

      <Modal
        size="xxxl"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="View Journal Entry Voucher"
      >
        {isJEVLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : selectedJournalEntry ? (
          <JournalEntryForm
            typeOptions={typeOptions}
            fundOptions={fundOptions}
            centerOptions={departments
              .filter((dept) => dept.Active)
              .map((dept) => ({ label: dept.Name, value: dept.ID }))}
            accountOptions={accounts
              .filter((acc) => acc.Active)
              .map((acc) => ({
                label: acc.AccountCode + ' ' + acc.Name,
                value: acc.ID,
              }))}
            initialData={{
              ...selectedJournalEntry,
              AccountingEntries:
                selectedJournalEntry.JournalEntries?.map((entry) => {
                  const matchedAccount = accounts.find(
                    (acc) =>
                      acc.AccountCode === entry.AccountCode &&
                      acc.Name === entry.AccountName
                  );

                  return {
                    ResponsibilityCenter: entry.ResponsibilityCenter || '',
                    AccountExplanation: matchedAccount?.ID || '',
                    PR: entry.PR || '',
                    Debit: entry.Debit || 0,
                    Credit: entry.Credit || 0,
                  };
                }) || [],
            }}
            onClose={() => setIsModalOpen(false)}
            onSubmit={() => { }}
            isReadOnly={true}
          />
        ) : (
          <div className="text-center py-8 text-neutral-500">
            No JEV data found.
          </div>
        )}
      </Modal>
    </div>
  );
}

export default GeneralLedgerPage;

