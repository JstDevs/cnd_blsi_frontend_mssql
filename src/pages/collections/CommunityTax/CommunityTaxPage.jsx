import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ArrowLeftIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/common/DataTable';
import CommunityTaxForm from './CommunityTaxForm';
// import CommunityTaxDetails from './CommunityTaxDetails';
// import { fetchCommunityTaxCertificates } from '@/features/tax/communityTaxSlice';
// Add sample data (will be used if Redux state is empty)
const sampleCertificates = [
  {
    id: 1,
    certificateNo: 'CTC-2024-001',
    date: '2024-01-15',
    name: 'Leivan Jake Baguio',
    address: '123 Main St, Baguio City',
    amount: 96.0,
    totalAmount: 96.0,
    receivedAmount: 100.0,
    change: 4.0,
    status: 'Active',
    purpose: 'Business Permit',
    issuedBy: 'Treasury S Head',
    employee: 'Juan Dela Cruz',
    employeeId: 'EMP-001',
    postedDate: '2024-01-16',
  },
  {
    id: 2,
    certificateNo: 'CTC-2024-002',
    date: '2024-02-20',
    name: 'Maria Santos',
    address: '456 Pine St, Baguio City',
    amount: 120.5,
    totalAmount: 120.5,
    receivedAmount: 150.0,
    change: 29.5,
    status: 'Active',
    purpose: 'Employment Requirement',
    issuedBy: 'Treasury S Head',
    employee: 'Ana Reyes',
    employeeId: 'EMP-002',
    postedDate: '2024-02-21',
  },
  // ... other sample certificates
];
function CommunityTaxPage() {
  const dispatch = useDispatch();
  const { certificates: reduxCertificates, isLoading } = useSelector(
    (state) => state.communityTax
  );

  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'details'
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // Use sample data if Redux state is empty
  const certificates =
    reduxCertificates && reduxCertificates.length > 0
      ? reduxCertificates
      : sampleCertificates;
  // useEffect(() => {
  //   dispatch(fetchCommunityTaxCertificates());
  // }, [dispatch]);

  const handleCreateCertificate = () => {
    setCurrentCertificate(null);
    setCurrentView('form');
  };

  const handleViewCertificate = (certificate) => {
    setCurrentCertificate(certificate);
    setCurrentView('details');
  };

  const handleEditCertificate = (certificate) => {
    setCurrentCertificate(certificate);
    setCurrentView('form');
  };

  const handlePrintCertificate = (certificate) => {
    // Implement print functionality
    console.log('Print certificate:', certificate);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setCurrentCertificate(null);
  };

  // Filter certificates based on search term
  const filteredCertificates = certificates?.filter((cert) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cert.certificateNo.toLowerCase().includes(searchLower) ||
      cert.name.toLowerCase().includes(searchLower) ||
      cert.address.toLowerCase().includes(searchLower)
    );
  });

  // Table columns definition
  const columns = [
    {
      key: 'certificateNo',
      header: 'Certificate No.',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'name',
      header: 'Taxpayer Name',
      sortable: true,
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'receivedAmount',
      header: 'Received Amount',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'employee',
      header: 'Employee',
      sortable: true,
    },
    {
      key: 'change',
      header: 'Change',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => renderStatusBadge(value),
    },
  ];
  // Helper function for currency formatting
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount || 0);
  };
  // Helper function for status badges
  const renderStatusBadge = (value) => {
    let bgColor = 'bg-neutral-100 text-neutral-800';

    switch (value) {
      case 'Active':
        bgColor = 'bg-success-100 text-success-800';
        break;
      case 'Expired':
        bgColor = 'bg-warning-100 text-warning-800';
        break;
      case 'Cancelled':
        bgColor = 'bg-error-100 text-error-800';
        break;
      default:
        break;
    }

    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
      >
        {value === 'Active'
          ? 'Posted'
          : value === 'Expired'
          ? 'Requested'
          : 'Cancelled'}
      </span>
    );
  };
  // Actions for table rows
  const actions = [
    {
      icon: EyeIcon,
      title: 'View',
      onClick: handleViewCertificate,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditCertificate,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    // {
    //   icon: PrinterIcon,
    //   title: 'Print',
    //   onClick: handlePrintCertificate,
    //   className:
    //     'text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-50',
    // },
  ];

  return (
    <div className="container mx-auto p-2 sm:px-4 sm:py-8">
      {currentView === 'list' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Community Tax Certificates
              </h1>
              <p className="text-gray-600">Manage community tax certificates</p>
            </div>
            <button
              type="button"
              onClick={handleCreateCertificate}
              className="btn btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              New Certificate
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-wrap items-start gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by certificate no., name, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <DataTable
              columns={columns}
              data={filteredCertificates}
              actions={actions}
              loading={isLoading}
              onRowClick={handleViewCertificate}
            />
          </div>
        </div>
      )}

      {currentView === 'form' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <button
                onClick={handleBackToList}
                className="mr-4 p-1 rounded-full hover:bg-neutral-100"
              >
                <ArrowLeftIcon className="h-5 w-5 text-neutral-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {currentCertificate
                    ? 'Edit Community Tax Certificate'
                    : 'Create Community Tax Certificate'}
                </h1>
                <p className="text-gray-600">
                  {currentCertificate
                    ? 'Update the certificate details'
                    : 'Fill out the form to create a new certificate'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
            <CommunityTaxForm
              initialData={currentCertificate}
              onCancel={handleBackToList}
              onSubmitSuccess={handleBackToList}
            />
          </div>
        </div>
      )}

      {currentView === 'details' && currentCertificate && (
        <div>
          <div className="flex justify-between items-center mb-6  gap-4 flex-wrap">
            <div className="flex items-center">
              <button
                onClick={handleBackToList}
                className="mr-4 p-1 rounded-full hover:bg-neutral-100"
              >
                <ArrowLeftIcon className="h-5 w-5 text-neutral-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Certificate Details
                </h1>
                <p className="text-gray-600">
                  View and manage certificate details
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleEditCertificate(currentCertificate)}
                className="btn btn-primary flex items-center"
              >
                <PencilIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handlePrintCertificate(currentCertificate)}
                className="btn btn-outline flex items-center"
              >
                <PrinterIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Print
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
            <CommunityTaxForm
              certificate={currentCertificate}
              onBack={handleBackToList}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunityTaxPage;
//  {selectedRecord && (
//           <div className="p-6">
//             <div className="text-center mb-8">
//               <h2 className="text-xl font-bold">COMMUNITY TAX CERTIFICATE</h2>
//               <p className="text-sm text-gray-600">
//                 Republic of the Philippines
//               </p>
//               <p className="text-sm text-gray-600">
//                 City/Municipality of{' '}
//                 {selectedRecord.placeOfIssue || '[Your City]'}
//               </p>
//             </div>

//             <div className="space-y-4 text-sm">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="font-semibold">Certificate No:</p>
//                   <p>{selectedRecord.certificateNo}</p>
//                 </div>
//                 <div>
//                   <p className="font-semibold">Date Issued:</p>
//                   <p>{selectedRecord.date}</p>
//                 </div>
//               </div>

//               <div>
//                 <p className="font-semibold">Name:</p>
//                 <p>{selectedRecord.name}</p>
//               </div>

//               <div>
//                 <p className="font-semibold">Address:</p>
//                 <p>{selectedRecord.address}</p>
//               </div>

//               {selectedRecord.tin && (
//                 <div>
//                   <p className="font-semibold">TIN:</p>
//                   <p>{selectedRecord.tin}</p>
//                 </div>
//               )}

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="font-semibold">Civil Status:</p>
//                   <p>{selectedRecord.civilStatus}</p>
//                 </div>
//                 <div>
//                   <p className="font-semibold">Gender:</p>
//                   <p>{selectedRecord.gender}</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="font-semibold">Height:</p>
//                   <p>{selectedRecord.height} cm</p>
//                 </div>
//                 <div>
//                   <p className="font-semibold">Weight:</p>
//                   <p>{selectedRecord.weight} kg</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="font-semibold">Date of Birth:</p>
//                   <p>{selectedRecord.dateOfBirth}</p>
//                 </div>
//                 <div>
//                   <p className="font-semibold">Place of Birth:</p>
//                   <p>{selectedRecord.placeOfBirth}</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="font-semibold">Nationality:</p>
//                   <p>{selectedRecord.nationality}</p>
//                 </div>
//                 <div>
//                   <p className="font-semibold">Occupation/Business:</p>
//                   <p>{selectedRecord.occupation}</p>
//                 </div>
//               </div>

//               {selectedRecord.contactNumber && (
//                 <div>
//                   <p className="font-semibold">Contact Number:</p>
//                   <p>{selectedRecord.contactNumber}</p>
//                 </div>
//               )}

//               <div>
//                 <p className="font-semibold">Basic Community Tax:</p>
//                 <p>₱{selectedRecord.basicTax || '5.00'}</p>{' '}
//                 {/* Assuming a default basic tax */}
//               </div>

//               {(selectedRecord.businessGrossReceipts ||
//                 selectedRecord.occupationGrossReceipts ||
//                 selectedRecord.realPropertyIncome) && (
//                 <div>
//                   <p className="font-semibold">
//                     Additional Community Tax Basis:
//                   </p>
//                   {selectedRecord.businessGrossReceipts && (
//                     <p>
//                       Business Gross Receipts: ₱
//                       {selectedRecord.businessGrossReceipts.toFixed(2)}
//                     </p>
//                   )}
//                   {selectedRecord.occupationGrossReceipts && (
//                     <p>
//                       Occupation Gross Receipts: ₱
//                       {selectedRecord.occupationGrossReceipts.toFixed(2)}
//                     </p>
//                   )}
//                   {selectedRecord.realPropertyIncome && (
//                     <p>
//                       Real Property Income: ₱
//                       {selectedRecord.realPropertyIncome.toFixed(2)}
//                     </p>
//                   )}
//                 </div>
//               )}

//               <div>
//                 <p className="font-semibold">Taxable Amount:</p>
//                 <p>₱{selectedRecord.taxableAmount || '0.00'}</p>{' '}
//                 {/* Placeholder */}
//               </div>

//               <div>
//                 <p className="font-semibold">Community Tax Due:</p>
//                 <p>₱{selectedRecord.communityTaxDue || '0.00'}</p>{' '}
//                 {/* Placeholder */}
//               </div>

//               <div>
//                 <p className="font-semibold">Interest:</p>
//                 <p>{selectedRecord.interest || '0.00'}%</p>
//               </div>

//               <div>
//                 <p className="font-semibold">Purpose:</p>
//                 <p>{selectedRecord.purpose}</p>
//               </div>

//               <div>
//                 <p className="font-semibold">Total Amount Paid:</p>
//                 <p className="text-lg font-bold">
//                   ₱
//                   {selectedRecord.amount
//                     ? selectedRecord.amount.toFixed(2)
//                     : '0.00'}
//                 </p>
//               </div>

//               {/* Placeholder for Amount in Words */}
//               {/*
//                <div>
//                  <p className="font-semibold">Amount in Words:</p>
//                  <p>{selectedRecord.totalAmountPaidWords || '[Amount in Words]'}</p>
//                </div>
//                */}
//             </div>

//             <div className="mt-8 text-center">
//               <p className="font-semibold">Authorized Signature</p>
//               <div className="mt-4">
//                 <p className="font-semibold">[Your Name]</p>
//                 <p className="text-sm">City/Municipal Treasurer</p>
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 mt-8">
//               <button
//                 onClick={() => setIsPrintModalOpen(false)}
//                 className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => window.print()}
//                 className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary-dark"
//               >
//                 Print Certificate
//               </button>
//             </div>
//           </div>
//         )}
//  <Formik
//           initialValues={
//             selectedRecord || {
//               certificateNo: '',
//               date: new Date().toISOString().split('T')[0],
//               placeOfIssue: '',
//               name: '',
//               address: '',
//               tin: '',
//               civilStatus: '',
//               nationality: '',
//               occupation: '',
//               placeOfBirth: '',
//               dateOfBirth: '',
//               gender: '',
//               height: '',
//               weight: '',
//               contactNumber: '',
//               businessGrossReceipts: '',
//               occupationGrossReceipts: '',
//               realPropertyIncome: '',
//               purpose: '',
//               amount: '',
//               interest: '',
//             }
//           }
//           validationSchema={communityTaxSchema}
//           onSubmit={handleSubmit}
//           enableReinitialize
//         >
//           {({ isSubmitting }) => (
//             <Form className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                   label="Certificate No."
//                   name="certificateNo"
//                   type="text"
//                   required
//                 />
//                 <FormField label="Date" name="date" type="date" required />
//               </div>

//               <FormField
//                 label="Place of Issue"
//                 name="placeOfIssue"
//                 type="text"
//                 required
//               />

//               <FormField label="Full Name" name="name" type="text" required />

//               <FormField label="Address" name="address" type="text" required />

//               <FormField label="TIN (If Any)" name="tin" type="text" />

//               <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                   label="Civil Status"
//                   name="civilStatus"
//                   type="select"
//                   options={[
//                     { value: 'single', label: 'Single' },
//                     { value: 'married', label: 'Married' },
//                     { value: 'widowed', label: 'Widowed' },
//                     { value: 'separated', label: 'Separated' },
//                     { value: 'divorced', label: 'Divorced' },
//                   ]}
//                   required
//                 />
//                 <FormField
//                   label="Gender"
//                   name="gender"
//                   type="select"
//                   options={[
//                     { value: 'male', label: 'Male' },
//                     { value: 'female', label: 'Female' },
//                   ]}
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                   label="Date of Birth"
//                   name="dateOfBirth"
//                   type="date"
//                   required
//                 />
//                 <FormField
//                   label="Place of Birth"
//                   name="placeOfBirth"
//                   type="text"
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <FormField label="Height" name="height" type="number" />
//                 <FormField label="Weight" name="weight" type="number" />
//               </div>

//               <FormField
//                 label="Nationality"
//                 name="nationality"
//                 type="text"
//                 required
//               />

//               <FormField
//                 label="Occupation/Business"
//                 name="occupation"
//                 type="text"
//                 required
//               />

//               <FormField
//                 label="Contact Number"
//                 name="contactNumber"
//                 type="tel"
//               />

//               <h3 className="text-lg font-semibold">
//                 Additional Community Tax Basis
//               </h3>

//               <FormField
//                 label="Gross Receipts/Earnings from Business (Preceding Year)"
//                 name="businessGrossReceipts"
//                 type="number"
//               />

//               <FormField
//                 label="Salaries/Gross Receipt from Profession/Occupation"
//                 name="occupationGrossReceipts"
//                 type="number"
//               />

//               <FormField
//                 label="Income from Real Property"
//                 name="realPropertyIncome"
//                 type="number"
//               />

//               <FormField
//                 label="Purpose"
//                 name="purpose"
//                 type="textarea"
//                 required
//               />

//               <FormField label="Amount" name="amount" type="number" required />

//               <FormField label="Interest (%)" name="interest" type="number" />

//               {/* Placeholder fields for calculated values */}
//               {/*
//               <FormField
//                 label="Taxable Amount"
//                 name="taxableAmount"
//                 type="text"
//                 disabled
//               />
//                <FormField
//                 label="Community Tax Due"
//                 name="communityTaxDue"
//                 type="text"
//                 disabled
//               />
//                <FormField
//                 label="Total Amount Paid"
//                 name="totalAmountPaid"
//                 type="text"
//                 disabled
//               />
//               <FormField
//                 label="Total Amount Paid (in words)"
//                 name="totalAmountPaidWords"
//                 type="text"
//                 disabled
//               />
//               */}

//               <div className="flex justify-end gap-2 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsModalOpen(false);
//                     setSelectedRecord(null);
//                   }}
//                   className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
//                 >
//                   {isSubmitting ? 'Saving...' : 'Save'}
//                 </button>
//               </div>
//             </Form>
//           )}
//         </Formik>
