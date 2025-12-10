import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '@/components/common/DataTable';
import { fetchDepartments } from '@/features/settings/departmentSlice';
import { fetchSubdepartments } from '@/features/settings/subdepartmentSlice';
import { fetchAccounts } from '@/features/settings/chartOfAccountsSlice';
import Modal from '@/components/common/Modal';
import axiosInstance from '@/utils/axiosInstance';

const API_URL = import.meta.env.VITE_API_URL;

const BudgetSummaryPage = () => {
  const dispatch = useDispatch();

  const { departments, isLoading: departmentsLoading } = useSelector(
    (state) => state.departments
  );
  const { subdepartments, isLoading: subdepartmentsLoading } = useSelector(
    (state) => state.subdepartments
  );
  const accounts = useSelector(
    (state) => state.chartOfAccounts?.accounts || []
  );

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    subDepartment: '',
    chartOfAccounts: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchSubdepartments());
    dispatch(fetchAccounts());
    fetchBudgetSummaries();
  }, []);

  const fetchBudgetSummaries = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance(`/budgetSummary`);
      // const res = await response.json();

      setData(response.data || []);
    } catch (error) {
      console.error('Error fetching budget summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredData = data.filter((item) => {
    return (
      (!filters.department || item.Department?.Name === filters.department) &&
      (!filters.subDepartment ||
        item.SubDepartment?.Name === filters.subDepartment) &&
      (!filters.chartOfAccounts ||
        item.ChartOfAccounts === filters.chartOfAccounts)
    );
  });

  const columns = [
    { key: 'Name', header: 'Name', sortable: true },
    {
      key: 'FiscalYearID',
      header: 'Fiscal Year',
      sortable: true,
      render: (_, row) => row?.FiscalYear.Name,
    },
    {
      key: 'DepartmentID',
      header: 'Department',
      sortable: true,
      render: (_, row) => row?.Department?.Name,
    },
    {
      key: 'SubDepartmentID',
      header: 'Sub Department',
      sortable: true,
      render: (_, row) => row?.SubDepartment?.Name,
    },
    {
      key: 'ChartofAccountsID',
      header: 'Chart of Accounts',
      sortable: true,
      render: (_, row) => row?.ChartofAccounts?.Name,
    },
    {
      key: 'FundsID',
      header: 'Fund',
      sortable: true,
      render: (_, row) => row?.Funds?.Name,
    },
    {
      key: 'ProjectID',
      header: 'Project',
      sortable: true,
      render: (_, row) => row?.Project?.Title,
    },
    { key: 'Appropriation', header: 'Appropriation', sortable: true },
    {
      key: 'AppropriationBalance',
      header: 'Appropriation Balance',
      sortable: true,
    },
    { key: 'TotalAmount', header: 'Total Amount', sortable: true },
    { key: 'ChargedAllotment', header: 'Allotment', sortable: true },
    { key: 'AllotmentBalance', header: 'Allotment Balance', sortable: true },
    { key: 'Change', header: 'Change', sortable: true },
    { key: 'Supplemental', header: 'Supplemental', sortable: true },
    { key: 'Released', header: 'Released', sortable: true },
    { key: 'Charges', header: 'Charges', sortable: true },
    { key: 'PreEncumbrance', header: 'Pre Encumbr.', sortable: true },
    { key: 'Encumbrance', header: 'Encumbrance', sortable: true },
    { key: 'January', header: 'January', sortable: true },
    { key: 'February', header: 'February', sortable: true },
    { key: 'March', header: 'March', sortable: true },
    { key: 'April', header: 'April', sortable: true },
    { key: 'May', header: 'May', sortable: true },
    { key: 'June', header: 'June', sortable: true },
    { key: 'July', header: 'July', sortable: true },
    { key: 'August', header: 'August', sortable: true },
    { key: 'September', header: 'September', sortable: true },
    { key: 'October', header: 'October', sortable: true },
    { key: 'November', header: 'November', sortable: true },
    { key: 'December', header: 'December', sortable: true },
  ];
  const handleRowClick = (row) => {
    setSelectedBudget(row);
    setIsModalOpen(true);
  };
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1>Budget Summary</h1>
        <p>Review the budget performance across months and categories.</p>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="form-select"
        >
          <option value="">All Department</option>
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
          <option value="">All Sub Department</option>
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
          <option value="">All Chart of Account</option>
          {accounts?.map((a) => (
            <option key={a.ID} value={a.Name}>
              {a.Name}
            </option>
          ))}
        </select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        loading={loading || departmentsLoading || subdepartmentsLoading}
        pagination={true}
        onRowClick={handleRowClick}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Budget Summary Details"
        size="5xl"
      >
        <BudgetSummaryDetail data={selectedBudget} />
      </Modal>
    </div>
  );
};

export default BudgetSummaryPage;
const BudgetSummaryDetail = ({ data }) => {
  if (!data) return null;

  const get = (val) => val || '—';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
      {/* Column 1 - Basic Info */}
      <div className="space-y-2">
        <div>
          <strong>Budget Name:</strong> {get(data.Name)}
        </div>
        <div>
          <strong>Fiscal Year:</strong> {get(data.FiscalYear?.Name)}
        </div>
        <div>
          <strong>Department:</strong> {get(data.Department?.Name)}
        </div>
        <div>
          <strong>SubDepartment:</strong> {get(data.SubDepartment?.Name)}
        </div>
        <div>
          <strong>Chart of Accounts:</strong> {get(data.ChartofAccounts?.Name)}
        </div>
        <div>
          <strong>Fund:</strong> {get(data.Funds?.Name)}
        </div>
        <div>
          <strong>Project:</strong> {get(data.Project?.Title)}
        </div>
      </div>

      {/* Column 2 - Appropriation and Allotment */}
      <div className="space-y-2">
        <div>
          <strong>Appropriation (Original):</strong> {get(data.Appropriation)}
        </div>
        <div>
          <strong>Appropriation Balance:</strong>{' '}
          {get(data.AppropriationBalance)}
        </div>
        <div>
          <strong>Appropriation (Adjusted):</strong> {get(data.RevisedAmount)}
        </div>
        <div>
          <strong>Adjustments:</strong> {get(data.Change)}
        </div>
        <div>
          <strong>Total Allotment:</strong> {get(data.ChargedAllotment)}
        </div>
        <div>
          <strong>Allotment Balance:</strong> {get(data.AllotmentBalance)}
        </div>
        <div>
          <strong>Pre Encumbrance:</strong> {get(data.PreEncumbrance)}
        </div>
        <div>
          <strong>Encumbrance:</strong> {get(data.Encumbrance)}
        </div>
        <div>
          <strong>Charges:</strong> {get(data.Charges)}
        </div>
      </div>

      {/* Column 3 - Monthly Distribution */}
      <div className="space-y-2">
        {[
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ].map((month) => (
          <div key={month}>
            <strong>{month}:</strong> {get(data[month])}
          </div>
        ))}
        <div className="font-semibold pt-2 border-t">
          <strong>Total Amount:</strong> {get(data.TotalAmount)}
        </div>
      </div>
    </div>
  );
};
