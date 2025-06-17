import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';
import Modal from '../../components/common/Modal';
import { fetchCurrencies, addCurrency, updateCurrency, deleteCurrency } from '../../features/settings/currencySlice';

// Validation schema for currency form
const currencySchema = Yup.object().shape({
  Code: Yup.string()
    .required('Currency code is required')
    .max(10, 'Currency code must be at most 10 characters'),
  Name: Yup.string()
    .required('Currency name is required')
    .max(100, 'Currency name must be at most 100 characters'),
});

function CurrencyPage() {
  const dispatch = useDispatch();
  const { currencies, isLoading, error } = useSelector(state => state.currencies);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCurrencies());
  }, [dispatch]);

  const handleAddCurrency = () => {
    setCurrentCurrency(null);
    setIsModalOpen(true);
  };

  const handleEditCurrency = (currency) => {
    setCurrentCurrency(currency);
    setIsModalOpen(true);
  };

  const handleDeleteCurrency = (currency) => {
    setCurrencyToDelete(currency);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (currencyToDelete) {
      dispatch(deleteCurrency(currencyToDelete.ID));
      setIsDeleteModalOpen(false);
      setCurrencyToDelete(null);
    }
  };
  
  const handleSubmit = (values, { resetForm }) => {
    if (currentCurrency) {
      dispatch(updateCurrency({ ...values, ID: currentCurrency.ID }));
    } else {
      dispatch(addCurrency(values));
    }
    setIsModalOpen(false);
    resetForm();
  };
  
  // Table columns definition
  const columns = [
    {
      key: 'Code',
      header: 'Code',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'Name',
      header: 'Currency Name',
      sortable: true,
    },
  ];
  
  // Actions for table rows
  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditCurrency,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDeleteCurrency,
      className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50'
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Currencies</h1>
            <p>Manage LGU currencies and their details</p>
          </div>
          <button
            type="button"
            onClick={handleAddCurrency}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Currency
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={currencies}
          actions={actions}
          loading={isLoading}
        />
      </div>

      {/* Currency Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentCurrency ? "Edit Currency" : "Add Currency"}
      >
        <Formik
          initialValues={{
            Code: currentCurrency?.Code || '',
            Name: currentCurrency?.Name || '',
          }}
          validationSchema={currencySchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="space-y-4">
              <FormField
                className='p-3 focus:outline-none'
                label="Currency Code"
                name="Code"
                type="text"
                required
                placeholder="Enter currency code"
                value={values.Code}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.Code}
                touched={touched.Code}
              />
              <FormField
                className='p-3 focus:outline-none'
                label="Currency Name"
                name="Name"
                type="text"
                required
                placeholder="Enter currency name"
                value={values.Name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.Name}
                touched={touched.Name}
              />
              <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="py-3">
          <p className="text-neutral-700">
            Are you sure you want to delete the currency <span className="font-medium">{currencyToDelete?.Name}</span>?
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This action cannot be undone and may affect related records in the system.
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

export default CurrencyPage;