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
  deleteCustomer
} from '../../features/settings/customersSlice';

function Customer() {
  const dispatch = useDispatch();
  const { customers, isLoading } = useSelector(state => state.customers);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomers());
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
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      try {
        await dispatch(deleteCustomer(customerToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setCustomerToDelete(null);
      } catch (error) {
        console.error('Failed to delete customer:', error);
      }
    }
  };

  const handleSubmit = (values) => {
    if (currentCustomer) {
      dispatch(updateCustomer({ ...values, ID: currentCustomer.ID }));
    } else {
      dispatch(addCustomer(values));
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'Code',
      header: 'Code',
      sortable: true
    },
    {
      key: 'Name',
      header: 'Name',
      sortable: true
    },
    {
      key: 'TIN',
      header: 'TIN',
      sortable: true
    },
    {
      key: 'PaymentTermsID',
      header: 'Payment Terms',
      sortable: true
    },
    {
      key: 'PaymentMethodID',
      header: 'Payment Method',
      sortable: true
    },
    {
      key: 'TaxCodeID',
      header: 'Tax Code',
      sortable: true
    },
    {
      key: 'IndustryTypeID',
      header: 'Industry Type',
      sortable: true
    },
    {
      key: 'ZIPCode',
      header: 'ZIP Code',
      sortable: true
    },
    {
      key: 'PlaceofIncorporation',
      header: 'Place of Incorporation',
      sortable: true
    },
    {
      key: 'KindofOrganization',
      header: 'Kind of Organization',
      sortable: true
    },
    {
      key: 'DateofRegistration',
      header: 'Date of Registration',
      sortable: true
    }
  ];

  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
      className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50'
    }
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Customers</h1>
            <p>Manage Customers</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Customer
          </button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={customers}
          actions={actions}
          loading={isLoading}
          emptyMessage="No customers found. Click 'Add Customer' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentCustomer ? "Edit Customer" : "Add Customer"}
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
            Are you sure you want to delete the customer "{customerToDelete?.name}"?
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