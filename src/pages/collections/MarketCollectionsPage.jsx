import { useState } from 'react';
import { PlusIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import { marketCollectionSchema } from '../../utils/validationSchemas';
import { Formik, Form } from 'formik';

function MarketCollectionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);
  
  // Mock data for table
  const collections = [
    {
      id: 1,
      receiptNumber: 'MC-2024-01-0001',
      date: '2024-01-15',
      stallNumber: 'A-101',
      stallType: 'Dry Goods',
      stallOwner: 'John Smith',
      period: 'January 2024',
      amount: 1500,
      status: 'Paid',
    },
    {
      id: 2,
      receiptNumber: 'MC-2024-01-0002',
      date: '2024-01-15',
      stallNumber: 'B-203',
      stallType: 'Wet Market',
      stallOwner: 'Jane Doe',
      period: 'January 2024',
      amount: 2000,
      status: 'Paid',
    },
  ];
  
  // Format amount as Philippine Peso
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };
  
  // Table columns
  const columns = [
    {
      key: 'receiptNumber',
      header: 'Receipt No.',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'stallNumber',
      header: 'Stall No.',
      sortable: true,
    },
    {
      key: 'stallType',
      header: 'Type',
      sortable: true,
    },
    {
      key: 'stallOwner',
      header: 'Owner',
      sortable: true,
    },
    {
      key: 'period',
      header: 'Period',
      sortable: true,
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'Paid' ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
        }`}>
          {value}
        </span>
      ),
    },
  ];
  
  // Actions for table rows
  const actions = [
    {
      icon: EyeIcon,
      title: 'View',
      onClick: (collection) => handleViewCollection(collection),
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: (collection) => handleEditCollection(collection),
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
  ];
  
  const handleCreateCollection = () => {
    setCurrentCollection(null);
    setIsModalOpen(true);
  };
  
  const handleViewCollection = (collection) => {
    setCurrentCollection(collection);
    setIsModalOpen(true);
  };
  
  const handleEditCollection = (collection) => {
    setCurrentCollection(collection);
    setIsModalOpen(true);
  };
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await marketCollectionSchema.validate(values, { abortEarly: false });
      console.log('Form data:', values);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Validation errors:', err.errors);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Market Collections</h1>
            <p>Manage market stall rental collections</p>
          </div>
          <button
            type="button"
            onClick={handleCreateCollection}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Collection
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={collections}
          actions={actions}
          pagination={true}
        />
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentCollection ? "Edit Collection" : "New Collection"}
        size="lg"
      >
        <Formik
          initialValues={{
            date: new Date().toISOString().split('T')[0],
            stallNumber: '',
            stallType: '',
            stallOwner: '',
            period: '',
            amount: '',
            ...currentCollection,
          }}
          validationSchema={marketCollectionSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Date"
                  name="date"
                  type="date"
                  required
                  value={values.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.date}
                  touched={touched.date}
                />
                
                <FormField
                  label="Period"
                  name="period"
                  type="select"
                  required
                  value={values.period}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.period}
                  touched={touched.period}
                  options={[
                    { value: 'January 2024', label: 'January 2024' },
                    { value: 'February 2024', label: 'February 2024' },
                    { value: 'March 2024', label: 'March 2024' },
                  ]}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Stall Number"
                  name="stallNumber"
                  type="text"
                  required
                  placeholder="Enter stall number"
                  value={values.stallNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.stallNumber}
                  touched={touched.stallNumber}
                />
                
                <FormField
                  label="Stall Type"
                  name="stallType"
                  type="select"
                  required
                  value={values.stallType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.stallType}
                  touched={touched.stallType}
                  options={[
                    { value: 'Dry Goods', label: 'Dry Goods' },
                    { value: 'Wet Market', label: 'Wet Market' },
                    { value: 'Food Stall', label: 'Food Stall' },
                  ]}
                />
              </div>
              
              <FormField
                label="Stall Owner"
                name="stallOwner"
                type="text"
                required
                placeholder="Enter stall owner name"
                value={values.stallOwner}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.stallOwner}
                touched={touched.stallOwner}
              />
              
              <FormField
                label="Amount"
                name="amount"
                type="number"
                required
                placeholder="0.00"
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.amount}
                touched={touched.amount}
                min="0"
                step="0.01"
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
                  {isSubmitting ? 'Saving...' : currentCollection ? 'Update' : 'Save'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
}

export default MarketCollectionsPage;