import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { communityTaxSchema } from '../../utils/validationSchemas';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import DataTable from '../../components/common/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import  toast  from 'react-hot-toast';
import { FiPrinter, FiSearch, FiFilter } from 'react-icons/fi';

const CommunityTaxPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { records, loading, error } = useSelector((state) => state.communityTax);

  useEffect(() => {
    // Fetch records on component mount
    dispatch({ type: 'communityTax/fetchRecords' });
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await communityTaxSchema.validate(values, { abortEarly: false });
      if (selectedRecord) {
        await dispatch({ type: 'communityTax/updateRecord', payload: { id: selectedRecord.id, ...values } });
        toast.success('Record updated successfully');
      } else {
        await dispatch({ type: 'communityTax/createRecord', payload: values });
        toast.success('Record created successfully');
      }
      setIsModalOpen(false);
      resetForm();
      setSelectedRecord(null);
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handlePrint = (record) => {
    setSelectedRecord(record);
    setIsPrintModalOpen(true);
  };

  const filteredRecords = records?.filter(record => 
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.certificateNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Community Tax Certificates</h1>
        <button
          onClick={() => {
            setSelectedRecord(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Add New Certificate
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or certificate number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <FiFilter />
            Filter
          </button>
        </div>

        <DataTable
          columns={[
            { header: 'Certificate No.', accessor: 'certificateNo' },
            { header: 'Date', accessor: 'date' },
            { header: 'Name', accessor: 'name' },
            { header: 'Address', accessor: 'address' },
            { header: 'Amount', accessor: 'amount', cell: (value) => `₱${value ? value.toFixed(2) : '0.00'}` },
            { header: 'Purpose', accessor: 'purpose' },
            {
              header: 'Actions',
              accessor: 'actions',
              cell: (_, record) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(record)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handlePrint(record)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <FiPrinter />
                  </button>
                </div>
              ),
            },
          ]}
          data={filteredRecords || []}
          loading={loading}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecord(null);
        }}
        title={selectedRecord ? 'Edit Certificate' : 'New Community Tax Certificate'}
      >
        <Formik
          initialValues={selectedRecord || {
            certificateNo: '',
            date: new Date().toISOString().split('T')[0],
            placeOfIssue: '',
            name: '',
            address: '',
            tin: '',
            civilStatus: '',
            nationality: '',
            occupation: '',
            placeOfBirth: '',
            dateOfBirth: '',
            gender: '',
            height: '',
            weight: '',
            contactNumber: '',
            businessGrossReceipts: '',
            occupationGrossReceipts: '',
            realPropertyIncome: '',
            purpose: '',
            amount: '',
            interest: ''
          }}
          validationSchema={communityTaxSchema}
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
                label="Place of Issue"
                name="placeOfIssue"
                type="text"
                required
              />

              <FormField
                label="Full Name"
                name="name"
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
                label="TIN (If Any)"
                name="tin"
                type="text"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Civil Status"
                  name="civilStatus"
                  type="select"
                  options={[
                    { value: 'single', label: 'Single' },
                    { value: 'married', label: 'Married' },
                    { value: 'widowed', label: 'Widowed' },
                    { value: 'separated', label: 'Separated' },
                    { value: 'divorced', label: 'Divorced' }
                  ]}
                  required
                />
                <FormField
                  label="Gender"
                  name="gender"
                  type="select"
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' }
                  ]}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  required
                />
                <FormField
                  label="Place of Birth"
                  name="placeOfBirth"
                  type="text"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField
                  label="Height"
                  name="height"
                  type="number"
                />
                 <FormField
                  label="Weight"
                  name="weight"
                  type="number"
                />
              </div>

              <FormField
                label="Nationality"
                name="nationality"
                type="text"
                required
              />

              <FormField
                label="Occupation/Business"
                name="occupation"
                type="text"
                required
              />

              <FormField
                label="Contact Number"
                name="contactNumber"
                type="tel"
              />

              <h3 className="text-lg font-semibold">Additional Community Tax Basis</h3>

              <FormField
                label="Gross Receipts/Earnings from Business (Preceding Year)"
                name="businessGrossReceipts"
                type="number"
              />

              <FormField
                label="Salaries/Gross Receipt from Profession/Occupation"
                name="occupationGrossReceipts"
                type="number"
              />

              <FormField
                label="Income from Real Property"
                name="realPropertyIncome"
                type="number"
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

              {/* Placeholder fields for calculated values */}
              {/*
              <FormField
                label="Taxable Amount"
                name="taxableAmount"
                type="text"
                disabled
              />
               <FormField
                label="Community Tax Due"
                name="communityTaxDue"
                type="text"
                disabled
              />
               <FormField
                label="Total Amount Paid"
                name="totalAmountPaid"
                type="text"
                disabled
              />
              <FormField
                label="Total Amount Paid (in words)"
                name="totalAmountPaidWords"
                type="text"
                disabled
              />
              */}

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

      <Modal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Print Certificate"
        size="lg"
      >
        {selectedRecord && (
          <div className="p-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">COMMUNITY TAX CERTIFICATE</h2>
              <p className="text-sm text-gray-600">Republic of the Philippines</p>
              <p className="text-sm text-gray-600">City/Municipality of {selectedRecord.placeOfIssue || '[Your City]'}</p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Certificate No:</p>
                  <p>{selectedRecord.certificateNo}</p>
                </div>
                <div>
                  <p className="font-semibold">Date Issued:</p>
                  <p>{selectedRecord.date}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold">Name:</p>
                <p>{selectedRecord.name}</p>
              </div>

              <div>
                <p className="font-semibold">Address:</p>
                <p>{selectedRecord.address}</p>
              </div>

              {selectedRecord.tin && (
                <div>
                  <p className="font-semibold">TIN:</p>
                  <p>{selectedRecord.tin}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Civil Status:</p>
                  <p>{selectedRecord.civilStatus}</p>
                </div>
                <div>
                  <p className="font-semibold">Gender:</p>
                  <p>{selectedRecord.gender}</p>
                </div>
              </div>

               <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Height:</p>
                  <p>{selectedRecord.height} cm</p>
                </div>
                <div>
                  <p className="font-semibold">Weight:</p>
                  <p>{selectedRecord.weight} kg</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Date of Birth:</p>
                  <p>{selectedRecord.dateOfBirth}</p>
                </div>
                <div>
                  <p className="font-semibold">Place of Birth:</p>
                  <p>{selectedRecord.placeOfBirth}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Nationality:</p>
                  <p>{selectedRecord.nationality}</p>
                </div>
                <div>
                  <p className="font-semibold">Occupation/Business:</p>
                  <p>{selectedRecord.occupation}</p>
                </div>
              </div>

               {selectedRecord.contactNumber && (
                 <div>
                   <p className="font-semibold">Contact Number:</p>
                   <p>{selectedRecord.contactNumber}</p>
                 </div>
               )}

               <div>
                 <p className="font-semibold">Basic Community Tax:</p>
                 <p>₱{selectedRecord.basicTax || '5.00'}</p> {/* Assuming a default basic tax */}
               </div>

              {(selectedRecord.businessGrossReceipts || selectedRecord.occupationGrossReceipts || selectedRecord.realPropertyIncome) && (
                <div>
                  <p className="font-semibold">Additional Community Tax Basis:</p>
                   {selectedRecord.businessGrossReceipts && <p>Business Gross Receipts: ₱{selectedRecord.businessGrossReceipts.toFixed(2)}</p>}
                   {selectedRecord.occupationGrossReceipts && <p>Occupation Gross Receipts: ₱{selectedRecord.occupationGrossReceipts.toFixed(2)}</p>}
                   {selectedRecord.realPropertyIncome && <p>Real Property Income: ₱{selectedRecord.realPropertyIncome.toFixed(2)}</p>}
                </div>
              )}

               <div>
                 <p className="font-semibold">Taxable Amount:</p>
                 <p>₱{selectedRecord.taxableAmount || '0.00'}</p> {/* Placeholder */}
               </div>

               <div>
                 <p className="font-semibold">Community Tax Due:</p>
                 <p>₱{selectedRecord.communityTaxDue || '0.00'}</p> {/* Placeholder */}
               </div>

                <div>
                 <p className="font-semibold">Interest:</p>
                 <p>{selectedRecord.interest || '0.00'}%</p>
               </div>

              <div>
                <p className="font-semibold">Purpose:</p>
                <p>{selectedRecord.purpose}</p>
              </div>

              <div>
                <p className="font-semibold">Total Amount Paid:</p>
                <p className="text-lg font-bold">₱{selectedRecord.amount ? selectedRecord.amount.toFixed(2) : '0.00'}</p>
              </div>

               {/* Placeholder for Amount in Words */}
               {/*
               <div>
                 <p className="font-semibold">Amount in Words:</p>
                 <p>{selectedRecord.totalAmountPaidWords || '[Amount in Words]'}</p>
               </div>
               */}

            </div>

            <div className="mt-8 text-center">
              <p className="font-semibold">Authorized Signature</p>
              <div className="mt-4">
                <p className="font-semibold">[Your Name]</p>
                <p className="text-sm">City/Municipal Treasurer</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-8">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary-dark"
              >
                Print Certificate
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CommunityTaxPage;