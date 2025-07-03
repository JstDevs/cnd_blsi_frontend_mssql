import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  date: Yup.date().required('Date is required'),
  accountCode: Yup.string().required('Account code is required'),
  description: Yup.string().required('Description is required'),
  debit: Yup.number().min(0, 'Debit amount must be greater than or equal to 0'),
  credit: Yup.number().min(0, 'Credit amount must be greater than or equal to 0'),
});

const BeginningBalanceForm = ({ initialData, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      // TODO: Replace with actual API call
      console.log('Form data:', values);
      toast.success('Beginning balance saved successfully');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save beginning balance');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialData || {
        date: new Date().toISOString().split('T')[0],
        accountCode: '',
        description: '',
        debit: '',
        credit: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Date"
              name="date"
              type="date"
              required
            />
            <FormField
              label="Account Code"
              name="accountCode"
              type="select"
              required
              options={[
                { value: '1-01-01-010', label: '1-01-01-010 - Cash in Bank' },
                { value: '1-01-02-020', label: '1-01-02-020 - Cash - Treasury' },
              ]}
            />
          </div>

          <FormField
            label="Description"
            name="description"
            type="textarea"
            required
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Debit"
              name="debit"
              type="number"
              min="0"
              step="0.01"
            />
            <FormField
              label="Credit"
              name="credit"
              type="number"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || !dirty}
              loading={isSubmitting}
            >
              {initialData ? 'Update' : 'Save'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const BeginningBalancePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const mockEntries = [
    {
      id: 1,
      date: '2024-01-01',
      accountCode: '1-01-01-010',
      description: 'Beginning balance for Cash in Bank',
      debit: 100000,
      credit: 0,
    },
    {
      id: 2,
      date: '2024-01-01',
      accountCode: '1-01-02-020',
      description: 'Beginning balance for Cash - Treasury',
      debit: 50000,
      credit: 0,
    },
  ];

  const handleAdd = () => {
    setSelectedEntry(null);
    setIsModalOpen(true);
  };

  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        console.log('Deleting entry:', id);
        toast.success('Entry deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete entry');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const columns = [
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    },
    {
      header: 'Account Code',
      accessorKey: 'accountCode',
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Debit',
      accessorKey: 'debit',
      cell: ({ row }) => formatCurrency(row.original.debit),
    },
    {
      header: 'Credit',
      accessorKey: 'credit',
      cell: ({ row }) => formatCurrency(row.original.credit),
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FiEdit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 hover:text-red-800"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Beginning Balance</h1>
        <Button onClick={handleAdd}>
          <FiPlus className="w-5 h-5 mr-2" />
          Add Entry
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={mockEntries}
          isLoading={isLoading}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEntry ? 'Edit Entry' : 'Add Entry'}
      >
        <BeginningBalanceForm
          initialData={selectedEntry}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default BeginningBalancePage; 