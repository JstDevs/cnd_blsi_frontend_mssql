import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon } from '@heroicons/react/24/solid';
import { PencilIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

import Modal from '@/components/common/Modal';
import BudgetAllotmentForm from '@/components/forms/BudgetAllotmentForm';
import DataTable from '@/components/common/DataTable';

import { fetchDepartments } from '@/features/settings/departmentSlice';
import { fetchSubdepartments } from '@/features/settings/subdepartmentSlice';
import { fetchAccounts } from '@/features/settings/chartOfAccountsSlice';

const API_URL = import.meta.env.VITE_API_URL;

const BudgetAllotmentPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { departments } = useSelector((state) => state.departments);
  const { subdepartments } = useSelector((state) => state.subdepartments);
  const accounts = useSelector(
    (state) => state.chartOfAccounts?.accounts || []
  );

  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  const [filters, setFilters] = useState({
    department: '',
    subDepartment: '',
    chartOfAccounts: '',
  });

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchSubdepartments());
    dispatch(fetchAccounts());
    fetchBudgetAllotments();
  }, []);

  const fetchBudgetAllotments = async () => {
    try {
      const res = await fetch(`${API_URL}/budgetAllotment/budgetList`);
      const data = await res.json();

      setData(data);
    } catch (error) {
      toast.error('Failed to load data');
      toast.error(error.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (values) => {
    activeRow ? handleUpdate(values) : handleCreate(values);
  };

  const handleCreate = async (values) => {
    try {
      const response = await fetch(`${API_URL}/budgetAllotment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          userId: user?.ID,
          isNew: 'true',
        }),
      });
      const res = await response.json();
      if (res) {
        fetchBudgetAllotments();
        toast.success('Allotment added');
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdate = async (values) => {
    try {
      const response = await fetch(`${API_URL}/budget/${values?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          userId: user?.ID,
        }),
      });
      const res = await response.json();
      if (res) {
        fetchBudgetAllotments();
        toast.success('Allotment updated');
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (row) => {
    setActiveRow(row);
    setIsModalOpen(true);
  };

  const columns = [
    { key: 'Name', header: 'Name' },
    {
      key: 'FiscalYearID',
      header: 'Fiscal Year',
      render: (_, row) => <span>{row?.FiscalYear?.Name}</span>,
    },
    {
      key: 'DepartmentID',
      header: 'Department',
      render: (_, row) => <span>{row?.Department?.Name}</span>,
    },
    {
      key: 'SubDepartmentID',
      header: 'Sub Department',
      render: (_, row) => <span>{row?.SubDepartment?.Name}</span>,
    },
    {
      key: 'ChartofAccountsID',
      header: 'Chart of Accounts',
      render: (_, row) => <span>{row?.ChartofAccounts?.Name}</span>,
    },
    {
      key: 'FundID',
      header: 'Fund',
      render: (_, row) => <span>{row?.Funds?.Name}</span>,
    },
    {
      key: 'ProjectID',
      header: 'Project',
      render: (_, row) => <span>{row?.Project?.Title}</span>,
    },
    { key: 'Appropriation', header: 'Appropriation' },
    { key: 'AppropriationBalance', header: 'Appropriation Balance' },
    { key: 'TotalAmount', header: 'Total Amount' },
    { key: 'Allotment', header: 'Allotment' },
    { key: 'AllotmentBalance', header: 'Allotment Balance' },
  ];

  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
  ];

  const filteredData = data?.filter((item) => {
    return (
      (!filters.department || item.DepartmentID === filters.department) &&
      (!filters.subDepartment ||
        item.SubDepartmentID === filters.subDepartment) &&
      (!filters.chartOfAccounts ||
        item.ChartofAccountsID === filters.chartOfAccounts)
    );
  });
  console.log('filteredData', filteredData, data);
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Budget Allotment</h1>
          <p>Manage budget allotments here</p>
        </div>
        <button
          onClick={() => handleEdit(null)}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Allotment
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="form-select"
        >
          <option value="">Select Department</option>
          {departments?.map((d) => (
            <option key={d.ID} value={d.Name}>
              {d.Name}
            </option>
          ))}
        </select>

        <select
          name="subDepartment"
          value={filters.subDepartment}
          onChange={handleFilterChange}
          className="form-select"
        >
          <option value="">Select Sub Department</option>
          {subdepartments?.map((sd) => (
            <option key={sd.ID} value={sd.Name}>
              {sd.Name}
            </option>
          ))}
        </select>

        <select
          name="chartOfAccounts"
          value={filters.chartOfAccounts}
          onChange={handleFilterChange}
          className="form-select"
        >
          <option value="">Select Chart of Account</option>
          {accounts?.map((a) => (
            <option key={a.ID} value={a.Name}>
              {a.Name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        actions={actions}
        loading={false}
        pagination
      />

      {/* Modal */}
      <Modal
        size="md"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeRow ? 'Edit Allotment' : 'Add Allotment'}
      >
        <BudgetAllotmentForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default BudgetAllotmentPage;
