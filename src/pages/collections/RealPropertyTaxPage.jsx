import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../../components/common/Modal';
import DataTable from '../../components/common/DataTable';
import RealPropertyTaxForm from '../../components/forms/RealPropertyTaxForm';

function RealPropertyTaxPage() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { realPropertyTaxes, isLoading } = useSelector((state) => state.realPropertyTax);

  // Mock data for demonstration
  const mockData = [
    {
      id: 1,
      tdNo: 'TD-001',
      owner: 'John Doe',
      address: '123 Main St',
      beneficialUser: 'Jane Doe',
      beneficialAddress: '456 Oak St',
      octTctCloaNo: 'OCT-123',
      cct: 'CCT-456',
      dated: '2024-03-20',
      propertyIdentificationNo: '12345',
      tin: '123-456-789',
      ownerTelephoneNo: '1234567890',
      beneficialTin: '987-654-321',
      beneficialTelephoneNo: '0987654321',
      surveyNo: 'S-001',
      lotNo: 'L-001',
      blockNo: 'B-001',
      boundaries: {
        taxable: true,
        north: 'Street A',
        south: 'Street B',
        east: 'Street C',
        west: 'Street D',
      },
      cancelledTdNo: 'TD-000',
      cancelledOwner: 'Previous Owner',
      effectivityOfAssessment: '2024-01-01',
      previousOwner: 'Previous Owner',
      previousAssessedValue: '1000000',
      propertyDetails: {
        kind: 'Land',
        numberOf: '1',
        description: 'Residential lot',
      },
      assessmentDetails: {
        kind: 'Land',
        actualUse: 'Residential',
        classification: 'Class 1',
        areaSize: 'Medium',
        assessmentLevel: '20%',
        marketValue: '1500000',
      },
      status: 'active',
    },
    // Add more mock data as needed
  ];

  const columns = [
    {
      header: 'TD No.',
      accessorKey: 'tdNo',
      enableSorting: true,
    },
    {
      header: 'Owner',
      accessorKey: 'owner',
      enableSorting: true,
    },
    {
      header: 'Address',
      accessorKey: 'address',
    },
    {
      header: 'Property ID',
      accessorKey: 'propertyIdentificationNo',
    },
    {
      header: 'Date',
      accessorKey: 'dated',
      cell: ({ row }) => new Date(row.original.dated).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.original.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
  ];

  const handleAddNew = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    // Implement delete functionality
    console.log('Delete record:', record);
  };

  const handleSubmit = async (values) => {
    try {
      if (selectedRecord) {
        // Update existing record
        console.log('Update record:', values);
      } else {
        // Create new record
        console.log('Create record:', values);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Real Property Tax</h1>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add New
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <DataTable
          columns={columns}
          data={mockData}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRecord ? 'Edit Real Property Tax' : 'Add New Real Property Tax'}
      >
        <RealPropertyTaxForm
          initialData={selectedRecord}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default RealPropertyTaxPage;