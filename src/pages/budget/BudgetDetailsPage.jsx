import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

import Modal from '@/components/common/Modal';
import DataTable from '@/components/common/DataTable';
import BudgetForm from '@/components/forms/BudgetForm';

import { fetchDepartments } from '@/features/settings/departmentSlice';
import { fetchSubdepartments } from '@/features/settings/subdepartmentSlice';
import { fetchAccounts } from '@/features/settings/chartOfAccountsSlice';
import { fetchFiscalYears } from '@/features/settings/fiscalYearSlice';
import { fetchFunds } from '@/features/budget/fundsSlice';
import { fetchProjectDetails } from '@/features/settings/projectDetailsSlice';
import { useModulePermissions } from '@/utils/useModulePremission';
import { formatCurrency } from '@/utils/currencyFormater';

const API_URL = import.meta.env.VITE_API_URL;
const mapFormToPayload = (values) => {
  return {
    IsNew: !values?.ID,
    ID: values?.ID || '',
    Name: values.Name,
    FiscalYearID: Number(values.FiscalYearID),
    DepartmentID: Number(values.DepartmentID),
    SubDepartmentID: Number(values.SubDepartmentID),
    ChartOfAccountsID: Number(values.ChartofAccountsID),
    FundID: Number(values.FundID),
    ProjectID: Number(values.ProjectID),
    Appropriation: Number(values.Appropriation),
    Charges: Number(values.Charges),
    January: Number(values.January),
    February: Number(values.February),
    March: Number(values.March),
    April: Number(values.April),
    May: Number(values.May),
    June: Number(values.June),
    July: Number(values.July),
    August: Number(values.August),
    September: Number(values.September),
    October: Number(values.October),
    November: Number(values.November),
    December: Number(values.December),
  };
};

const BudgetDetailsPage = () => {
  const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.auth);
  const { departments } = useSelector((state) => state.departments);
  const { subdepartments } = useSelector((state) => state.subdepartments);
  const accounts = useSelector(
    (state) => state.chartOfAccounts?.accounts || []
  );
  const { fiscalYears } = useSelector((state) => state.fiscalYears);
  const { funds } = useSelector((state) => state.funds);
  const { projectDetails } = useSelector((state) => state.projectDetails);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    subDepartment: '',
    chartOfAccounts: '',
  });
  // ---------------------USE MODULE PERMISSIONS------------------START (BudgetDetailsPage - MODULE ID =  22 )
  const { Add, Edit, Delete } = useModulePermissions(22);
  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchSubdepartments());
    dispatch(fetchAccounts());
    dispatch(fetchFiscalYears());
    dispatch(fetchFunds());
    dispatch(fetchProjectDetails());
    fetchBudgetDetails();
  }, []);

  const fetchBudgetDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/budget`);
      const json = await res.json();
      if (json?.status) {
        setData(json?.items || []);
      } else {
        toast.error('Failed to fetch budget details');
      }
    } catch (error) {
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
      const res = await fetch(`${API_URL}/budgetDetails/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(mapFormToPayload(values)),
      });
      const json = await res.json();
      if (json) {
        fetchBudgetDetails();
        setIsModalOpen(false);
        toast.success('Budget added successfully');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdate = async (values) => {
    try {
      const res = await fetch(`${API_URL}/budgetDetails/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(mapFormToPayload(values)),
      });
      const json = await res.json();
      if (json) {
        fetchBudgetDetails();
        setIsModalOpen(false);
        toast.success('Budget updated successfully');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/budget/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json) {
        fetchBudgetDetails();
        toast.success('Budget deleted');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const columns = [
    { key: 'Name', header: 'Name' },
    {
      key: 'FiscalYearID',
      header: 'Fiscal Year',
      render: (_, row) => {
        // const row = fiscalYears?.find((f) => f.ID === value);
        return <span>{row?.FiscalYear?.Name || 'N/A'}</span>;
      },
    },
    {
      key: 'DepartmentID',
      header: 'Department',

      render: (_, row) => {
        // const departmentName = departments?.find((d) => d.ID === value)?.Name;
        return <span>{row?.Department?.Name || 'N/A'}</span>;
      },
    },
    {
      key: 'SubDepartmentID',
      header: 'Sub Department',
      render: (_, row) => {
        // const departmentName = subdepartments?.find(
        //   (d) => d.ID === value
        // )?.Name;
        return <span>{row?.SubDepartment?.Name || 'N/A'}</span>;
      },
    },
    {
      key: 'ChartofAccountsID',
      header: 'Chart of Accounts',
      render: (_, row) => {
        // const departmentName = accounts?.find((d) => d.ID === value)?.Name;
        return <span>{row?.ChartofAccounts?.Name || 'N/A'}</span>;
      },
    },
    {
      key: 'FundID',
      header: 'Fund',
      render: (_, row) => {
        // const departmentName = funds?.find((d) => d.ID === value)?.Name;
        return <span>{row?.Funds?.Name || 'N/A'}</span>;
      },
    },
    {
      key: 'ProjectID',
      header: 'Project',
      render: (_, row) => {
        // const departmentName = projectDetails?.find(
        //   (d) => d.ID === value
        // )?.Title;
        return <span>{row?.Project?.Title || 'N/A'}</span>;
      },
    },
    { key: 'Appropriation', header: 'Appropriation', render: formatCurrency },
    {
      key: 'AppropriationBalance',
      header: 'Appropriation Balance',
      render: formatCurrency,
    },
    { key: 'TotalAmount', header: 'Total Amount', render: formatCurrency },
    // { key: 'Allotment', header: 'Allotment' },
    {
      key: 'AllotmentBalance',
      header: 'Allotment Balance',
      render: formatCurrency,
    },
    { key: 'ChargedAllotment', header: 'Charges', render: formatCurrency },
    {
      key: 'PreEncumbrance',
      header: 'Pre Encumbrance',
      render: formatCurrency,
    },
    { key: 'Encumbrance', header: 'Encumbrance', render: formatCurrency },
    { key: 'January', header: 'January', render: formatCurrency },
    { key: 'February', header: 'February', render: formatCurrency },
    { key: 'March', header: 'March', render: formatCurrency },
    { key: 'April', header: 'April', render: formatCurrency },
    { key: 'May', header: 'May', render: formatCurrency },
    { key: 'June', header: 'June', render: formatCurrency },
    { key: 'July', header: 'July', render: formatCurrency },
    { key: 'August', header: 'August', render: formatCurrency },
    { key: 'September', header: 'September', render: formatCurrency },
    { key: 'October', header: 'October', render: formatCurrency },
    { key: 'November', header: 'November', render: formatCurrency },
    { key: 'December', header: 'December', render: formatCurrency },
  ];

  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: (row) => {
        setActiveRow(row);
        setIsModalOpen(true);
      },
      className: 'text-primary-600 hover:text-primary-900 p-1',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: (row) => handleDelete(row?.ID),
      className: 'text-red-600 hover:text-red-800 p-1',
    },
  ];

  const filteredData = data.filter((item) => {
    return (
      (!filters.department || item.Department?.ID == filters.department) &&
      (!filters.subDepartment ||
        item.SubDepartment?.ID == filters.subDepartment) &&
      (!filters.chartOfAccounts ||
        item.ChartofAccounts?.ID == filters.chartOfAccounts)
    );
  });

  return (
    <div className="page-container">
      <div className="page-header flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1>Budget Details</h1>
          <p>View and manage detailed budget entries</p>
        </div>
        {Add && (
          <button
            onClick={() => {
              setActiveRow(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary max-sm:w-full "
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Budget
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4">
        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="form-select"
        >
          <option value="">Select Department</option>
          {departments?.map((d) => (
            <option key={d.ID} value={d.ID}>
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
          {subdepartments?.map((s) => (
            <option key={s.ID} value={s.ID}>
              {s.Name}
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
            <option key={a.ID} value={a.ID}>
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
        pagination
      />

      {/* Modal */}
      <Modal
        size="lg"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeRow ? 'Edit Budget' : 'Add Budget'}
      >
        <BudgetForm
          departmentOptions={departments.map((dept) => ({
            value: dept.ID,
            label: dept.Name,
          }))}
          subDepartmentOptions={subdepartments.map((subDept) => ({
            value: subDept.ID,
            label: subDept.Name,
          }))}
          chartOfAccountsOptions={accounts.map((account) => ({
            value: account.ID,
            label: account.Name,
          }))}
          fundOptions={funds.map((fund) => ({
            value: fund.ID,
            label: fund.Name,
          }))}
          projectOptions={projectDetails.map((project) => ({
            value: project.ID,
            label: project.Title,
          }))}
          fiscalYearOptions={fiscalYears.map((fiscalYear) => ({
            value: fiscalYear.ID,
            label: fiscalYear.Name,
          }))}
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default BudgetDetailsPage;
