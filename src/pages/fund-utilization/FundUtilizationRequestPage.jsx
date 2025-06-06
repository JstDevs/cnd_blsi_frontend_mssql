import React, { useState } from 'react';
import  DataTable  from '../../components/common/DataTable';
import FundUtilizationRequestForm from '../../components/forms/FundUtilizationRequestForm';
import { Button } from '../../components/common/Button';
import  Modal  from '../../components/common/Modal';

// Mock data for the table
const mockData = [
  {
    id: 1,
    status: 'Pending',
    invoiceDate: '2024-03-15',
    invoiceNumber: 'INV-001',
    total: 1500.00,
    fiscalYear: '2024',
    project: 'Project 1',
    customerId: 'CUST-001'
  },
  {
    id: 2,
    status: 'Approved',
    invoiceDate: '2024-03-14',
    invoiceNumber: 'INV-002',
    total: 2500.00,
    fiscalYear: '2024',
    project: 'Project 2',
    customerId: 'CUST-002'
  },
  // Add more mock data as needed
];

const columns = [
  { header: 'Status', accessor: 'status' },
  { header: 'Invoice Date', accessor: 'invoiceDate' },
  { header: 'Invoice Number', accessor: 'invoiceNumber' },
  { 
    header: 'Total', 
    accessor: 'total',
    cell: (value) => `$${value.toFixed(2)}`
  },
  { header: 'Fiscal Year', accessor: 'fiscalYear' },
  { header: 'Project', accessor: 'project' },
  { header: 'Customer ID', accessor: 'customerId' },
];

function FundUtilizationRequestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState(mockData);

  const handleSubmit = (values) => {
    // Here you would typically make an API call to save the request
    console.log('Form submitted:', values);
    setIsModalOpen(false);
    // Add the new request to the table
    setRequests([...requests, { id: requests.length + 1, ...values }]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Fund Utilization Requests</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
        >
          New Request
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={requests}
        className="bg-white rounded-lg shadow"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Fund Utilization Request"
      >
        <FundUtilizationRequestForm
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default FundUtilizationRequestPage; 