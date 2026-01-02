import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ApprovalMatrixForm from './ApprovalMatrixForm';
import {
  fetchApprovalMatrix,
  bulkUpdateApprovalMatrix,
  deleteApprovalMatrix,
} from '../../features/settings/approvalMatrixSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function ApprovalMatrixPage() {
  const dispatch = useDispatch();
  const { approvalMatrix, isLoading, error } = useSelector(
    (state) => state.approvalMatrix
  );
  // ---------------------USE MODULE PERMISSIONS------------------START ( Approval Matrix  - MODULE ID = 17 )
  const { Add, Edit, Delete } = useModulePermissions(17);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMatrix, setCurrentMatrix] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [matrixToDelete, setMatrixToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchApprovalMatrix());
  }, [dispatch]);

  // Grouping logic
  const groupedMatrices = useMemo(() => {
    if (!Array.isArray(approvalMatrix)) return [];

    const groups = approvalMatrix.reduce((acc, current) => {
      const docTypeId = current.DocumentTypeID;
      if (!acc[docTypeId]) {
        acc[docTypeId] = {
          DocumentTypeID: docTypeId,
          DocumentTypeName: current.DocumentTypeName,
          sequences: [],
        };
      }
      acc[docTypeId].sequences.push(current);
      return acc;
    }, {});

    return Object.values(groups).map(group => ({
      ...group,
      // Sort sequences by level
      sequences: group.sequences.sort((a, b) => Number(a.SequenceLevel) - Number(b.SequenceLevel)),
      sequencesCount: group.sequences.length,
      // Create a summary of approvers for the first level or total
      approverSummary: group.sequences.map(s => `Seq ${s.SequenceLevel} (${s.Approvers?.length || 0})`).join(' → ')
    }));
  }, [approvalMatrix]);

  const handleAdd = () => {
    setCurrentMatrix(null);
    setIsModalOpen(true);
  };

  const handleEdit = (groupedRow) => {
    const formattedData = {
      DocumentTypeID: groupedRow.DocumentTypeID,
      sequences: groupedRow.sequences.map(seq => ({
        SequenceLevel: Number(seq.SequenceLevel),
        AllorMajority: seq.AllorMajority,
        NumberofApprover: seq.NumberofApprover,
        approvers: (seq.Approvers || []).map(app => ({
          type: app.PositionorEmployee,
          value: app.PositionorEmployeeID,
          amountFrom: Number(app.AmountFrom),
          amountTo: Number(app.AmountTo)
        }))
      }))
    };

    setCurrentMatrix(formattedData);
    setIsModalOpen(true);
  };

  const handleDelete = (groupedRow) => {
    setMatrixToDelete(groupedRow);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (matrixToDelete) {
      try {
        // Since we are deleting the whole "group", and current delete API is by ID,
        // we might need to delete all IDs in the group.
        // However, if the user wants to delete the setup, usually they expect a single action.
        // I will delete all IDs associated with this document type.
        const deletePromises = matrixToDelete.sequences.map(seq =>
          dispatch(deleteApprovalMatrix(seq.ID)).unwrap()
        );

        await Promise.all(deletePromises);

        setIsDeleteModalOpen(false);
        setMatrixToDelete(null);
        toast.success('Approval matrix removed for document type');
        dispatch(fetchApprovalMatrix());
      } catch (error) {
        console.error('Failed to delete approval matrix:', error);
        toast.error('Failed to delete approval matrix. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      await dispatch(bulkUpdateApprovalMatrix(values)).unwrap();
      toast.success('Approval matrix updated successfully');
      dispatch(fetchApprovalMatrix());
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to submit approval matrix:', err);
      toast.error('Failed to submit approval matrix. Please try again.');
    }
  };

  const columns = [
    { key: 'DocumentTypeName', header: 'Document Type', sortable: true },
    { key: 'sequencesCount', header: 'Sequence Levels', sortable: true },
    { key: 'approverSummary', header: 'Approval Flow Summary', sortable: false },
  ];

  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit Flow',
      onClick: handleEdit,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Remove Matrix',
      onClick: handleDelete,
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ].filter(Boolean);

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>Approval Matrix</h1>
            <p>Manage sequential approval flows for document types</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Setup New Matrix
            </button>
          )}
        </div>
      </div>
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={groupedMatrices}
          actions={actions}
          loading={isLoading}
        />
      </div>
      {error && <div className="text-error-600 mt-2">{error}</div>}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentMatrix ? 'Edit Sequential Approval' : 'Setup Sequential Approval'}
        size="xl"
      >
        <ApprovalMatrixForm
          initialData={currentMatrix}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Removal"
      >
        <div className="py-3">
          <p className="text-neutral-700">
            Are you sure you want to remove the <strong>entire</strong> approval matrix for this document type?
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This will delete all sequence levels and approvers. This action cannot be undone.
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
            Delete Everything
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ApprovalMatrixPage;
