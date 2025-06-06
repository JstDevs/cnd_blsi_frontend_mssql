import { useState } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import { journalEntrySchema } from '../../utils/validationSchemas';

function JournalEntryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  
  // Mock data for table
  const entries = [
    {
      id: 1,
      date: '2024-01-15',
      reference: 'JEV-2024-01-0001',
      particulars: 'To record collection of real property tax',
      totalAmount: 50000,
      status: 'Posted',
      postedBy: 'John Smith',
      postedDate: '2024-01-15T10:30:00',
    },
    {
      id: 2,
      date: '2024-01-16',
      reference: 'JEV-2024-01-0002',
      particulars: 'To record payment of office supplies',
      totalAmount: 15000,
      status: 'Draft',
      postedBy: null,
      postedDate: null,
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
      key: 'reference',
      header: 'Reference',
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
      key: 'particulars',
      header: 'Particulars',
      sortable: true,
    },
    {
      key: 'totalAmount',
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
          value === 'Posted' ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'postedBy',
      header: 'Posted By',
      sortable: true,
      render: (value) => value || '-',
    },
    {
      key: 'postedDate',
      header: 'Posted Date',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleString() : '-',
    },
  ];
  
  const handleCreateEntry = () => {
    setCurrentEntry(null);
    setIsModalOpen(true);
  };
  
  const handleEditEntry = (entry) => {
    setCurrentEntry(entry);
    setIsModalOpen(true);
  };
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await journalEntrySchema.validate(values, { abortEarly: false });
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
            <h1>Journal Entries</h1>
            <p>Record and manage journal entries</p>
          </div>
          <button
            type="button"
            onClick={handleCreateEntry}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Entry
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={entries}
          pagination={true}
        />
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentEntry ? "Edit Journal Entry" : "New Journal Entry"}
        size="lg"
      >
        <Formik
          initialValues={{
            date: new Date().toISOString().split('T')[0],
            reference: '',
            particulars: '',
            debitEntries: [{ accountCode: '', amount: '' }],
            creditEntries: [{ accountCode: '', amount: '' }],
            ...currentEntry,
          }}
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
                  label="Reference"
                  name="reference"
                  type="text"
                  placeholder="Enter reference number"
                  value={values.reference}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.reference}
                  touched={touched.reference}
                />
              </div>
              
              <FormField
                label="Particulars"
                name="particulars"
                type="textarea"
                required
                placeholder="Enter transaction details"
                value={values.particulars}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.particulars}
                touched={touched.particulars}
                rows={3}
              />
              
              {/* Debit Entries */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Debit Entries</label>
                <FieldArray name="debitEntries">
                  {({ push, remove }) => (
                    <div className="space-y-2">
                      {values.debitEntries.map((_, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-1">
                            <FormField
                              name={`debitEntries.${index}.accountCode`}
                              type="select"
                              placeholder="Select account"
                              value={values.debitEntries[index].accountCode}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                errors.debitEntries?.[index]?.accountCode
                              }
                              touched={
                                touched.debitEntries?.[index]?.accountCode
                              }
                              options={[
                                { value: '1-01-01-010', label: '1-01-01-010 - Cash in Bank' },
                                { value: '1-01-02-020', label: '1-01-02-020 - Cash - Treasury' },
                              ]}
                            />
                          </div>
                          <div className="w-48">
                            <FormField
                              name={`debitEntries.${index}.amount`}
                              type="number"
                              placeholder="Amount"
                              value={values.debitEntries[index].amount}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                errors.debitEntries?.[index]?.amount
                              }
                              touched={
                                touched.debitEntries?.[index]?.amount
                              }
                              min="0"
                              step="0.01"
                            />
                          </div>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-error-600 hover:text-error-800"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push({ accountCode: '', amount: '' })}
                        className="text-sm text-primary-600 hover:text-primary-800"
                      >
                        + Add Debit Entry
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
              
              {/* Credit Entries */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Credit Entries</label>
                <FieldArray name="creditEntries">
                  {({ push, remove }) => (
                    <div className="space-y-2">
                      {values.creditEntries.map((_, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-1">
                            <FormField
                              name={`creditEntries.${index}.accountCode`}
                              type="select"
                              placeholder="Select account"
                              value={values.creditEntries[index].accountCode}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                errors.creditEntries?.[index]?.accountCode
                              }
                              touched={
                                touched.creditEntries?.[index]?.accountCode
                              }
                              options={[
                                { value: '1-01-01-010', label: '1-01-01-010 - Cash in Bank' },
                                { value: '1-01-02-020', label: '1-01-02-020 - Cash - Treasury' },
                              ]}
                            />
                          </div>
                          <div className="w-48">
                            <FormField
                              name={`creditEntries.${index}.amount`}
                              type="number"
                              placeholder="Amount"
                              value={values.creditEntries[index].amount}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                errors.creditEntries?.[index]?.amount
                              }
                              touched={
                                touched.creditEntries?.[index]?.amount
                              }
                              min="0"
                              step="0.01"
                            />
                          </div>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-error-600 hover:text-error-800"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push({ accountCode: '', amount: '' })}
                        className="text-sm text-primary-600 hover:text-primary-800"
                      >
                        + Add Credit Entry
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
              
              <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-600">Total Debits</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(
                        values.debitEntries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Total Credits</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(
                        values.creditEntries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
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
                  {isSubmitting ? 'Saving...' : currentEntry ? 'Update' : 'Save'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
}

export default JournalEntryPage;