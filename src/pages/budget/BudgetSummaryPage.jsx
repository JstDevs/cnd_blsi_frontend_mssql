import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '@/components/common/DataTable';
import { fetchDepartments } from '@/features/settings/departmentSlice';
import { fetchSubdepartments } from '@/features/settings/subdepartmentSlice';
import { fetchAccounts } from '@/features/settings/chartOfAccountsSlice';

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
      const response = await fetch(`${API_URL}/budgetSummary/`);
      const res = await response.json();

      setData(res || []);
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
    { key: 'FiscalYearID', header: 'Fiscal Year', sortable: true },
    { key: 'DepartmentID', header: 'Department', sortable: true },
    { key: 'SubDepartmentID', header: 'Sub Department', sortable: true },
    { key: 'ChartOfAccountsID', header: 'Chart of Accounts', sortable: true },
    { key: 'FundsID', header: 'Fund', sortable: true },
    { key: 'ProjectID', header: 'Project', sortable: true },
    { key: 'Appropriation', header: 'Appropriation', sortable: true },
    {
      key: 'AppropriationBalance',
      header: 'Appropriation Balance',
      sortable: true,
    },
    { key: 'TotalAmount', header: 'Total Amount', sortable: true },
    { key: 'ChargedAllotment', header: 'Allotment', sortable: true },
    { key: 'AllotmentBalance', header: 'Allotment Balance', sortable: true },
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

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        loading={loading || departmentsLoading || subdepartmentsLoading}
        pagination={true}
      />
    </div>
  );
};

export default BudgetSummaryPage;
