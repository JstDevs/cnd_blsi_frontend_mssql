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
} from '../../features/disbursement/journalEntrySlice';
import { fetchDepartments } from '../../features/settings/departmentSlice';
import { fetchAccounts } from '../../features/settings/chartOfAccountsSlice';
import { useModulePermissions } from '@/utils/useModulePremission';
import { CheckLine, EyeIcon, X } from 'lucide-react';

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

  useEffect(() => {
    dispatch(fetchJournalEntries());
    dispatch(fetchDepartments());
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentJournalEntry(null);
    setIsModalOpen(true);
  };

  const handleEdit = (journalEntry) => {
    setCurrentJournalEntry(journalEntry);
    setIsModalOpen(true);
  };

  const handleDelete = (journalEntry) => {
    setJournalEntryToDelete(journalEntry);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (journalEntryToDelete) {
      try {
        await dispatch(
          deleteJournalEntry(journalEntryToDelete.LinkID)
        ).unwrap();
        toast.success('Deleted');
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
      sortable: true,
      render: (value) => {
        let bgColor = 'bg-neutral-100 text-neutral-800';

        switch (value) {
          case 'Requested':
            bgColor = 'bg-warning-100 text-warning-800';
            break;
          case 'Posted':
            bgColor = 'bg-primary-100 text-primary-800';
            break;
          case 'Rejected':
            bgColor = 'bg-error-100 text-error-800';
            break;
          default:
            break;
        }

        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
          >
            {value}
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
  const handleView = (values) => {
    console.log(values);
  };
  const handleJEPAction = async (dv, action) => {
    setIsLoadingJEPAction(true);
    try {
      // TODO : add action
      // const response = await axiosInstance.post(
      //   `/disbursementVoucher/${action}`,
      //   { ID: dv.ID }
      // );
      console.log(`${action}d:`, response.data);
      // dispatch(fetchGeneralServiceReceipts());
      toast.success(`Purchase Request ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing Purchase Request:`, error);
      toast.error(`Error ${action}ing Purchase Request`);
    } finally {
      setIsLoadingJEPAction(false);
    }
  };

  const actions = (row) => {
    const actionList = [];

    if (row?.Status?.toLowerCase().includes('rejected') && Edit) {
      actionList.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: handleEditRequest,
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
      actionList.push({
        icon: TrashIcon,
        title: 'Delete',
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
            <p>Manage your Journal Entry Vouchers</p>
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
          currentJournalEntry
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
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="py-3">
          <p className="text-neutral-700">
            Are you sure you want to delete the journal entry "
            {journalEntryToDelete?.Name}"?
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This action cannot be undone.
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
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default JournalEntryPage;
