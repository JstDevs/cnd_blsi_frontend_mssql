import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import CustomerForm from '../../components/forms/CustomerForm';
import {
  fetchCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from '../../features/settings/customersSlice';
import { fetchIndustries } from '@/features/settings/industrySlice';
import { fetchTaxCodes } from '@/features/settings/taxCodeSlice';
import { fetchPaymentTerms } from '@/features/settings/paymentTermsSlice';
import { fetchModeOfPayments } from '@/features/settings/modeOfPaymentSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function Customer() {
  const dispatch = useDispatch();
  const { customers, isLoading } = useSelector((state) => state.customers);
  const { industries } = useSelector((state) => state.industries);
  const { taxCodes } = useSelector((state) => state.taxCodes);
  const { paymentTerms } = useSelector((state) => state.paymentTerms);
  const { modeOfPayments } = useSelector((state) => state.modeOfPayments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  // ---------------------USE MODULE PERMISSIONS------------------START (Customer  - MODULE ID = 38 )
  const { Add, Edit, Delete } = useModulePermissions(38);
  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchIndustries());
    dispatch(fetchTaxCodes());
    dispatch(fetchPaymentTerms());
    dispatch(fetchModeOfPayments());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentCustomer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = (customer) => {
    console.log('Delete customer:', customer);
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      try {
        await dispatch(deleteCustomer(customerToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setCustomerToDelete(null);
        toast.success('Customer deleted successfully');
      } catch (error) {
        console.error('Failed to delete Individual/Citizen:', error);
        toast.error(
          error.message ||
            'Failed to delete Individual/Citizen. Please try again.'
        );
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentCustomer) {
        await dispatch(
          updateCustomer({ ...values, ID: currentCustomer.ID })
        ).unwrap();
        toast.success('Customer updated successfully');
      } else {
        await dispatch(addCustomer(values)).unwrap();
        toast.success('Customer added successfully');
      }
      dispatch(fetchCustomers());
    } catch (error) {
      console.error('Failed to save Individual/Citizen:', error);
      toast.error(error.message || 'Failed to save Individual/Citizen');
    } finally {
      setCurrentCustomer(null);
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      key: 'Code',
      header: 'Code',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'Name',
      header: 'Name',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'TIN',
      header: 'TIN',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'PaymentTermsID',
      header: 'Payment Terms',
      sortable: true,
      render: (value) => {
        const terms = paymentTerms.find((t) => t.ID == value);
        return terms?.Name || 'N/A';
      },
    },
    {
      key: 'PaymentMethodID',
      header: 'Payment Method',
      sortable: true,
      render: (value) => {
        const method = modeOfPayments.find((m) => m.ID == value);
        return method?.Name || 'N/A';
      },
    },
    {
      key: 'TaxCodeID',
      header: 'Tax Code',
      sortable: true,
      render: (value) => {
        const tax = taxCodes.find((t) => t.ID == value);
        return tax?.Code || 'N/A';
      },
    },
    {
      key: 'IndustryTypeID',
      header: 'Industry Type',
      sortable: true,
      render: (value) => {
        const industry = industries.find((i) => i.ID == value);
        return industry?.Name || 'N/A';
      },
    },
    {
      key: 'ZIPCode',
      header: 'ZIP Code',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'PlaceofIncorporation',
      header: 'Place of Incorporation',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'KindofOrganization',
      header: 'Kind of Organization',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'DateofRegistration',
      header: 'Date of Registration',
      sortable: true,
      render: (value) => value || 'N/A',
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
            <h1>Individuals/Citizens</h1>
            <p>Manage Individuals/Citizens here</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Individual/Citizen
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={customers}
          actions={actions}
          loading={isLoading}
          emptyMessage="No individuals/citizens found. Click 'Add Individual/Citizen' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          currentCustomer ? 'Edit Individual/Citizen' : 'Add Individual/Citizen'
        }
        size="lg"
      >
        <CustomerForm
          initialData={currentCustomer}
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
            Are you sure you want to delete the individual/citizen?
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

export default Customer;
