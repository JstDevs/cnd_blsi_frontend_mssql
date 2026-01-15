import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import JournalEntryForm from '../../components/forms/JournalEntryForm';
import {
  fetchJournalEntries,
  addJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  approveJournalEntry,
  rejectJournalEntry,
} from '../../features/disbursement/journalEntrySlice';
import { fetchGeneralLedgers } from '../../features/reports/generalLedgerSlice';
import { fetchDepartments } from '../../features/settings/departmentSlice';
import { fetchAccounts } from '../../features/settings/chartOfAccountsSlice';
import { useModulePermissions } from '@/utils/useModulePremission';
import { CheckLine, EyeIcon, X } from 'lucide-react';
import { BookOpenIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/currencyFormater';

function JournalEntryPage() {
  const { departments } = useSelector((state) => state.departments);
  const { accounts } = useSelector((state) => state.chartOfAccounts);
  // ---------------------USE MODULE PERMISSIONS------------------START (JournalEntryPage - MODULE ID =  57 )
  const { Add, Edit, Delete } = useModulePermissions(57);
  // hardcoded in old software
  const typeOptions = [
    { label: 'Cash Disbursement', value: 'Cash Disbursement' },
    { label: 'Check Disbursement', value: 'Check Disbursement' },
    { label: 'Collection', value: 'Collection' },
    { label: 'Others', value: 'Others' },
  ];
  const fundOptions = [
    // get funds active
    { label: 'General Fund', value: '1' },
    { label: 'Trust Fund', value: '2' },
    { label: 'Special Education Fund', value: '3' },
  ];

  const dispatch = useDispatch();
  const { journalEntries, isLoading } = useSelector(
    (state) => state.journalEntries
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJournalEntry, setCurrentJournalEntry] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoadingJEPAction, setIsLoadingJEPAction] = useState(false);
  const [journalEntryToDelete, setJournalEntryToDelete] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [showGLModal, setShowGLModal] = useState(false);
  const { generalLedgers, isLoading: isGLLoading } = useSelector((state) => state.generalLedger);

  useEffect(() => {
    dispatch(fetchJournalEntries());
    dispatch(fetchDepartments());
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentJournalEntry(null);
    setIsViewOnly(false);
    setIsModalOpen(true);
  };

  const handleEdit = (journalEntry) => {
    setCurrentJournalEntry(journalEntry);
    setIsViewOnly(false);
    setIsModalOpen(true);
  };

  const handleView = (journalEntry) => {
    setCurrentJournalEntry(journalEntry);
    setIsViewOnly(true);
    setIsModalOpen(true);
  };

  const handleDelete = (journalEntry) => {
    setJournalEntryToDelete(journalEntry);
    setIsDeleteModalOpen(true);
  };

  const handleViewGL = (row) => {
    setShowGLModal(true);
    dispatch(fetchGeneralLedgers({
      LinkID: row.ID,
      FundID: row.FundsID,
      CutOffDate: row.InvoiceDate || new Date().toISOString().split('T')[0]
    }));
  };

  const handleCloseGLModal = () => {
    setShowGLModal(false);
  };

  const confirmDelete = async () => {
    if (journalEntryToDelete) {
      try {
        await dispatch(
          deleteJournalEntry(journalEntryToDelete.LinkID)
        ).unwrap();
        toast.success('Journal Entry voided successfully');
        dispatch(fetchJournalEntries());
      } catch (error) {
        console.error('Failed to delete journal entry:', error);
        toast.error('Failed to delete journal entry');
      } finally {
        setIsDeleteModalOpen(false);
        setJournalEntryToDelete(null);
      }
    }
  };
  // console.log(journalEntries);d
  const handleSubmit = async (values) => {
    console.log({ values });
    try {
      if (currentJournalEntry) {
        await dispatch(
          updateJournalEntry({
            journalEntry: values,
            id: currentJournalEntry.ID,
          })
        ).unwrap();
      } else {
        await dispatch(addJournalEntry(values)).unwrap();
      }
      toast.success('Success');
      dispatch(fetchJournalEntries());
    } catch (error) {
      toast.error(error || 'Failed');
      throw error;
    } finally {
      setIsModalOpen(false);
      setCurrentJournalEntry(null);
    }
  };
  // const handleSubmit = (formData) => {
  //   if (currentJournalEntry) {
  //     formData.append('ID', currentJournalEntry.ID); // add ID to FormData if editing
  //     dispatch(updateJournalEntry(formData));
  //   } else {
  //     dispatch(addJournalEntry(formData));
  //   }

  //   setIsModalOpen(false);
  //   setCurrentJournalEntry(null);
  // };

  const columns = [
    {
      key: 'Status',
      header: 'Status',
      render: (value) => {
        const status = value?.toLowerCase() || '';
        const statusColors = {
          requested: 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500 text-error-700',
          approved: 'bg-gradient-to-r from-success-300 via-success-500 to-success-600 text-neutral-800',
          posted: 'bg-gradient-to-r from-success-800 via-success-900 to-success-999 text-success-100',
          rejected: 'bg-gradient-to-r from-error-700 via-error-800 to-error-999 text-neutral-100',
          void: 'bg-gradient-to-r from-primary-900 via-primary-999 to-tertiary-999 text-neutral-300',
          cancelled: 'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-400 text-neutral-800',
        };
        const colorClass = statusColors[status] || 'bg-neutral-100 text-neutral-800 border-neutral-200';
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
            {value || 'N/A'}
          </span>
        );
      },
    },
    {
      key: 'RequestedByName',
      header: 'Requested By',
      sortable: true,
    },
    {
      key: 'InvoiceDate',
      header: 'Invoice Date',
      sortable: true,
    },
    {
      key: 'InvoiceNumber',
      header: 'Invoice No.',
      sortable: true,
    },
    {
      key: 'JEVType',
      header: 'Jev Type',
      sortable: true,
    },
    {
      key: 'FundsName',
      header: 'Fund',
      sortable: true,
    },
    {
      key: 'ObligationRequestNumber',
      header: 'OBR No.',
      sortable: true,
    },
    {
      key: 'SAI_No',
      header: 'DV No.',
      sortable: true,
    },
    {
      key: 'CheckNumber',
      header: 'Check Number',
      sortable: true,
    },
    {
      key: 'CheckDate',
      header: 'Check Date',
      sortable: true,
    },
    {
      key: 'Total',
      header: 'Total',
      sortable: true,
    },
  ];

  // const actions = [
  // {
  //   icon: PencilIcon,
  //   title: 'Edit',
  //   onClick: handleEdit,
  //   className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
  // },
  // {
  //   icon: TrashIcon,
  //   title: 'Delete',
  //   onClick: handleDelete,
  //   className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50'
  // }
  // ];
  // const handleView = (values) => {
  //   console.log(values);
  // };
  const handleJEPAction = async (item, action) => {
    setIsLoadingJEPAction(true);
    try {
      const payload = {
        ID: item.ID,
        LinkID: item.LinkID,
        FundsID: item.FundsID,
        ApprovalProgress: (item.ApprovalProgress || 0) + 1,
        ApprovalOrder: item.SequenceOrder || item.ApprovalOrder || 1,
        NumberOfApproverPerSequence: item.ApprovalOrder || item.NumberOfApproverPerSequence || 1,
        ApprovalVersion: item.ApprovalVersion || 1,
        ApprovalLinkID: item.ApprovalLinkID || item.LinkID,
      };

      if (action === 'approve') {
        await dispatch(approveJournalEntry(payload)).unwrap();
      } else if (action === 'reject') {
        await dispatch(rejectJournalEntry({ ID: item.ID })).unwrap();
      }
      dispatch(fetchJournalEntries());
      toast.success(`Journal Entry ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing Journal Entry:`, error);
      toast.error(error || `Error ${action}ing Journal Entry`);
    } finally {
      setIsLoadingJEPAction(false);
    }
  };

  const actions = (row) => {
    const actionList = [];
    const isVoided = row?.Status?.toLowerCase().includes('void');

    if (!isVoided) {
      if (row?.Status?.toLowerCase().includes('rejected') && Edit) {
        actionList.push({
          icon: PencilIcon,
          title: 'Edit',
          onClick: () => handleEdit(row),
          className:
            'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
        });
        actionList.push({
          icon: TrashIcon,
          title: 'Void',
          onClick: () => handleDelete(row),
          className:
            'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
        });
      } else if (row?.Status?.toLowerCase().includes('requested')) {
        actionList.push(
          {
            icon: CheckLine,
            title: 'Approve',
            onClick: () => handleJEPAction(row, 'approve'),
            className:
              'text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50',
          },
          {
            icon: X,
            title: 'Reject',
            onClick: () => handleJEPAction(row, 'reject'),
            className:
              'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
          }
        );
      }

      if (row?.Status?.toLowerCase().includes('posted')) {
        actionList.push({
          icon: BookOpenIcon,
          title: 'View GL',
          onClick: () => handleViewGL(row),
          className:
            'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
        });
      }
    }

    actionList.push({
      icon: EyeIcon,
      title: 'View',
      onClick: handleView,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    });
    return actionList;
  };
  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center gap-4 max-sm:flex-col">
          <div>
            <h1>Journal Entries Voucher </h1>
            <p>Create and edit the journal entries and vouchers.</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add JEV
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={journalEntries}
          actions={actions}
          loading={isLoading || isLoadingJEPAction}
          emptyMessage="No journal entries found. Click 'Add JEV' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        size="xxxl"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          isViewOnly
            ? 'View Journal Entry Voucher'
            : currentJournalEntry
              ? 'Edit Journal Entry Voucher'
              : 'Add Journal Entry Voucher'
        }
      >
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
          initialData={
            currentJournalEntry
              ? {
                ...currentJournalEntry,
                AccountingEntries:
                  currentJournalEntry.JournalEntries?.map((entry) => {
                    const matchedAccount = accounts.find(
                      (acc) =>
                        acc.AccountCode === entry.AccountCode &&
                        acc.Name === entry.AccountName
                    );

                    return {
                      ResponsibilityCenter: entry.ResponsibilityCenter || '',
                      AccountExplanation: matchedAccount?.ID || '', // ✅ set to actual account ID
                      PR: entry.PR || '',
                      Debit: entry.Debit || 0,
                      Credit: entry.Credit || 0,
                    };
                  }) || [],
              }
              : null
          }
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          isReadOnly={isViewOnly}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Void"
      >
        <div className="py-3">
          <p className="text-neutral-700">
            Are you sure you want to void the journal entry "
            {journalEntryToDelete?.InvoiceNumber || journalEntryToDelete?.Name}"?
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This action will mark the request as void but keep it visible in the list.
          </p>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(false)}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="btn btn-danger"
          >
            Void JEV
          </button>
        </div>
      </Modal>

      {/* Modal for General Ledger View */}
      <Modal
        isOpen={showGLModal}
        onClose={handleCloseGLModal}
        title="General Ledger Entries"
        size="4xl"
      >
        <div className="overflow-hidden border border-neutral-200 rounded-xl shadow-sm my-2">
          {isGLLoading ? (
            <div className="flex justify-center items-center py-12">
              <ArrowPathIcon className="h-8 w-8 animate-spin text-neutral-400" />
              <span className="ml-2 text-neutral-500">Loading ledger data...</span>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Fund
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Ledger Item
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Account Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Debit
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Credit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {generalLedgers && generalLedgers.length > 0 ? (
                  generalLedgers.map((item, index) => (
                    <tr key={index} className="hover:bg-neutral-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 font-medium">
                        {item.fund || item.FundsName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {item.ledger_item}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {item.account_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 font-mono">
                        {item.account_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-neutral-900 font-medium tabular-nums">
                        {item.debit > 0 ? formatCurrency(item.debit) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-neutral-900 font-medium tabular-nums">
                        {item.credit > 0 ? formatCurrency(item.credit) : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-neutral-500">
                      <div className="flex flex-col items-center justify-center">
                        <BookOpenIcon className="h-10 w-10 text-neutral-300 mb-2" />
                        <p>No ledger records found for this transaction.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              {generalLedgers && generalLedgers.length > 0 && (
                <tfoot className="bg-neutral-50 font-semibold text-neutral-900">
                  <tr>
                    <td colSpan="4" className="px-6 py-3 text-right text-xs uppercase tracking-wider text-neutral-500">Total</td>
                    <td className="px-6 py-3 text-right text-sm tabular-nums">
                      {formatCurrency(generalLedgers.reduce((acc, curr) => acc + (curr.debit || 0), 0))}
                    </td>
                    <td className="px-6 py-3 text-right text-sm tabular-nums">
                      {formatCurrency(generalLedgers.reduce((acc, curr) => acc + (curr.credit || 0), 0))}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </div>
        <div className="flex justify-end pt-4 border-t border-neutral-200 mt-4">
          <button
            type="button"
            onClick={handleCloseGLModal}
            className="btn btn-primary px-6"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default JournalEntryPage;
