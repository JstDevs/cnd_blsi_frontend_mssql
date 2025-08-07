import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FinancialStatementForm from '../../components/forms/FinancialStatementForm';
import {
  fetchFinancialStatements,
  addFinancialStatement,
  updateFinancialStatement,
  deleteFinancialStatement,
} from '../../features/settings/financialStatementSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function FinancialStatementPage() {
  const dispatch = useDispatch();
  const { financialStatements, isLoading } = useSelector(
    (state) => state.financialStatements
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (Financial Statement Page  - MODULE ID = 65 )
  const { Add, Edit, Delete } = useModulePermissions(44);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStatement, setCurrentStatement] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [statementToDelete, setStatementToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchFinancialStatements());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentStatement(null);
    setIsModalOpen(true);
  };

  const handleEdit = (statement) => {
    setCurrentStatement(statement);
    setIsModalOpen(true);
  };

  const handleDelete = (statement) => {
    setStatementToDelete(statement);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (statementToDelete) {
      try {
        await dispatch(deleteFinancialStatement(statementToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setStatementToDelete(null);
        toast.success('Financial statement deleted successfully.');
      } catch (error) {
        console.error('Failed to delete financial statement:', error);
        toast.error('Failed to delete financial statement. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentStatement) {
        await dispatch(
          updateFinancialStatement({ ...values, ID: currentStatement.ID })
        ).unwrap();
        toast.success('Financial statement updated successfully.');
      } else {
        await dispatch(addFinancialStatement(values)).unwrap();
        toast.success('Financial statement added successfully.');
      }
      dispatch(fetchFinancialStatements());
    } catch (error) {
      console.error('Failed to save financial statement:', error);
      toast.error('Failed to save financial statement. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      key: 'Code',
      header: 'Code',
      sortable: true,
    },
    {
      key: 'Name',
      header: 'Name',
      sortable: true,
    },
  ];

  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>Financial Statements</h1>
            <p>Manage financial statements</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Financial Statement
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={financialStatements}
          actions={actions}
          loading={isLoading}
          emptyMessage="No financial statements found. Click 'Add Financial Statement' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          currentStatement
            ? 'Edit Financial Statement'
            : 'Add Financial Statement'
        }
      >
        <FinancialStatementForm
          initialData={currentStatement}
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
            Are you sure you want to delete the financial statement "
            {statementToDelete?.Name}"?
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

export default FinancialStatementPage;
