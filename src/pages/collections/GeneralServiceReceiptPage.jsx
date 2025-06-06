import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { generalServiceReceiptSchema } from '../../utils/validationSchemas';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import DataTable from '../../components/common/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiSearch, FiFilter, FiEdit, FiTrash } from 'react-icons/fi';
import { fetchGeneralServiceReceipts, createGeneralServiceReceipt, updateGeneralServiceReceipt, deleteGeneralServiceReceipt } from '../../features/collections/generalServiceReceiptsSlice';

const GeneralServiceReceiptPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const dispatch = useDispatch();
  const { receipts, loading, error } = useSelector((state) => state.generalServiceReceipts);

  useEffect(() => {
    dispatch(fetchGeneralServiceReceipts());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await generalServiceReceiptSchema.validate(values, { abortEarly: false });
      if (selectedReceipt) {
        await dispatch(updateGeneralServiceReceipt({ id: selectedReceipt.id, ...values })).unwrap();
        toast.success('Receipt updated successfully');
      } else {
        await dispatch(createGeneralServiceReceipt(values)).unwrap();
        toast.success('Receipt created successfully');
      }
      setIsModalOpen(false);
      resetForm();
      setSelectedReceipt(null);
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      console.error('Form submission error:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      try {
        await dispatch(deleteGeneralServiceReceipt(id)).unwrap();
        toast.success('Receipt deleted successfully');
      } catch (err) {
        const errorMessage = err.message || 'An error occurred';
        console.error('Delete error:', errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const filteredReceipts = Array.isArray(receipts) ? receipts.filter(receipt => 
    receipt.payorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.agency.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Status', accessor: 'status' },
    { header: 'Invoice Date', accessor: 'invoiceDate' },
    { header: 'Payor Name', accessor: 'payorName' },
    { header: 'Date', accessor: 'date' },
    { header: 'Agency', accessor: 'agency' },
    { header: 'Fund', accessor: 'fund' },
    { header: 'Taxpayer Type', accessor: 'taxpayerType' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (_, receipt) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(receipt)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FiEdit />
          </button>
          <button
            onClick={() => handleDelete(receipt.id)}
            className="text-red-600 hover:text-red-800"
          >
            <FiTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">General Service Receipts</h1>
        <button
          onClick={() => {
            setSelectedReceipt(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Add New Receipt
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, Payor Name, or Agency..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          {/* Filter button can be added here if needed */}
          {/* <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"><FiFilter />Filter</button> */}
        </div>

        <DataTable
          columns={columns}
          data={filteredReceipts || []}
          loading={loading}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReceipt(null);
        }}
        title={selectedReceipt ? 'Edit General Service Receipt' : 'New General Service Receipt'}
      >
        <Formik
          initialValues={selectedReceipt || {
            id: '',
            status: '',
            invoiceDate: '',
            payorName: '',
            date: new Date().toISOString().split('T')[0],
            agency: '',
            fund: '',
            taxpayerType: '',
          }}
          validationSchema={generalServiceReceiptSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-4">
              <FormField
                label="ID"
                name="id"
                type="text"
                required
                disabled={selectedReceipt !== null} // Disable ID field on edit
              />
              <FormField
                label="Status"
                name="status"
                type="select"
                options={[
                  { value: 'posted', label: 'Posted' },
                  { value: 'rejected', label: 'Rejected' },
                  { value: 'approved', label: 'Approved' },
                ]}
                required
              />
              <FormField
                label="Invoice Date"
                name="invoiceDate"
                type="date"
                required
              />
              <FormField
                label="Payor Name"
                name="payorName"
                type="text"
                required
              />
              <FormField
                label="Date"
                name="date"
                type="date"
                required
              />
              <FormField
                label="Agency"
                name="agency"
                type="text"
                required
              />
              <FormField
                label="Fund"
                name="fund"
                type="select"
                options={[
                   { value: 'General funds', label: 'General funds' },
                   { value: 'Other fund option 1', label: 'Other fund option 1' },
                   { value: 'Other fund option 2', label: 'Other fund option 2' },
                ]} // Mock options
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700">Taxpayer Type</label>
                <div className="mt-1 flex gap-4">
                  <div className="flex items-center">
                    <Field
                      type="radio"
                      name="taxpayerType"
                      id="taxpayerTypeIndividual"
                      value="Individual"
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                    />
                    <label htmlFor="taxpayerTypeIndividual" className="ml-2 block text-sm text-gray-900">
                      Individual
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Field
                      type="radio"
                      name="taxpayerType"
                      id="taxpayerTypeCorporation"
                      value="Corporation"
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                    />
                    <label htmlFor="taxpayerTypeCorporation" className="ml-2 block text-sm text-gray-900">
                      Corporation
                    </label>
                  </div>
                </div>
                {/* You can add validation error display here if needed */}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedReceipt(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
};

export default GeneralServiceReceiptPage; 