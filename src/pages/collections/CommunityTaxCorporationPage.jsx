import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import DataTable from '../../components/common/DataTable';
import { PlusIcon } from '@heroicons/react/24/outline';

// Validation schema
const corporationTaxSchema = Yup.object().shape({
  certificateNo: Yup.string()
    .required('Certificate number is required')
    .matches(/^[A-Z0-9-]+$/, 'Certificate number can only contain uppercase letters, numbers, and hyphens'),
  date: Yup.date()
    .required('Date is required')
    .max(new Date(), 'Date cannot be in the future'),
  corporationName: Yup.string()
    .required('Corporation name is required')
    .min(2, 'Corporation name must be at least 2 characters')
    .max(200, 'Corporation name must not exceed 200 characters'),
  tin: Yup.string()
    .required('TIN is required')
    .matches(/^\d{9}(\d{3})?$/, 'Invalid TIN format (9 or 12 digits)'),
  address: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters'),
  businessType: Yup.string()
    .required('Business type is required'),
  grossReceipts: Yup.number()
    .required('Gross receipts is required')
    .min(0, 'Amount cannot be negative'),
  purpose: Yup.string()
    .required('Purpose is required')
    .min(5, 'Purpose must be at least 5 characters')
    .max(500, 'Purpose must not exceed 500 characters'),
  amount: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be greater than or equal to 0'),
  interest: Yup.number()
    .min(0, 'Interest cannot be negative')
    .nullable(),
});

function CommunityTaxCorporationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Mock data for demonstration
  const mockData = [
    {
      id: 1,
      certificateNo: 'CTC-2024-001',
      date: '2024-03-20',
      corporationName: 'ABC Corporation',
      tin: '123456789000',
      address: '123 Business Ave, Makati City',
      businessType: 'Manufacturing',
      grossReceipts: 5000000.00,
      purpose: 'Business Registration',
      amount: 5000.00,
      interest: 0,
      status: 'Paid'
    },
    {
      id: 2,
      certificateNo: 'CTC-2024-002',
      date: '2024-03-19',
      corporationName: 'XYZ Enterprises',
      tin: '987654321000',
      address: '456 Corporate Blvd, Taguig City',
      businessType: 'Trading',
      grossReceipts: 3000000.00,
      purpose: 'Business Renewal',
      amount: 3000.00,
      interest: 0,
      status: 'Paid'
    }
  ];

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  // Table columns definition
  const columns = [
    {
      key: 'certificateNo',
      header: 'Certificate No.',
      sortable: true,
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'corporationName',
      header: 'Corporation Name',
      sortable: true,
    },
    {
      key: 'tin',
      header: 'TIN',
      sortable: true,
    },
    {
      key: 'businessType',
      header: 'Business Type',
      sortable: true,
    },
    {
      key: 'grossReceipts',
      header: 'Gross Receipts',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // TODO: Implement API call to save/update record
      console.log('Form values:', values);
      setIsModalOpen(false);
      resetForm();
      setSelectedRecord(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Community Tax Corporation</h1>
          <p className="text-gray-600">Manage corporation community tax certificates</p>
        </div>
        <button
          onClick={() => {
            setSelectedRecord(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Certificate
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <DataTable
          columns={columns}
          data={mockData}
          pagination={true}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecord(null);
        }}
        title={selectedRecord ? 'Edit Certificate' : 'New Corporation Certificate'}
        size="lg"
      >
        <Formik
          initialValues={selectedRecord || {
            certificateNo: '',
            date: new Date().toISOString().split('T')[0],
            corporationName: '',
            tin: '',
            address: '',
            businessType: '',
            grossReceipts: '',
            purpose: '',
            amount: '',
            interest: ''
          }}
          validationSchema={corporationTaxSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Certificate No."
                  name="certificateNo"
                  type="text"
                  required
                />
                <FormField
                  label="Date"
                  name="date"
                  type="date"
                  required
                />
              </div>

              <FormField
                label="Corporation Name"
                name="corporationName"
                type="text"
                required
              />

              <FormField
                label="TIN"
                name="tin"
                type="text"
                required
              />

              <FormField
                label="Address"
                name="address"
                type="text"
                required
              />

              <FormField
                label="Business Type"
                name="businessType"
                type="select"
                options={[
                  { value: 'Manufacturing', label: 'Manufacturing' },
                  { value: 'Trading', label: 'Trading' },
                  { value: 'Services', label: 'Services' },
                  { value: 'Construction', label: 'Construction' },
                  { value: 'Real Estate', label: 'Real Estate' },
                  { value: 'Others', label: 'Others' }
                ]}
                required
              />

              <FormField
                label="Gross Receipts"
                name="grossReceipts"
                type="number"
                required
              />

              <FormField
                label="Purpose"
                name="purpose"
                type="textarea"
                required
              />

              <FormField
                label="Amount"
                name="amount"
                type="number"
                required
              />

              <FormField
                label="Interest (%)"
                name="interest"
                type="number"
              />

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedRecord(null);
                  }}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
}

export default CommunityTaxCorporationPage; 