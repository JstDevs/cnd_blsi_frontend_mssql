import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckLine, PencilIcon, PrinterIcon, TrashIcon, X } from 'lucide-react';
import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/common/Modal';
import BudgetSupplementalForm from '@/components/forms/BudgetSupplementalForm';
import { toast } from 'react-hot-toast';
import DataTable from '@/components/common/DataTable';
import { useEffect } from 'react';
import { fetchDepartments } from '@/features/settings/departmentSlice';
import { fetchSubdepartments } from '@/features/settings/subdepartmentSlice';
import { fetchAccounts } from '@/features/settings/chartOfAccountsSlice';
import axiosInstance from '@/utils/axiosInstance';
import { fetchFiscalYears } from '@/features/settings/fiscalYearSlice';
import { fetchFunds } from '@/features/budget/fundsSlice';
import { fetchProjectDetails } from '@/features/settings/projectDetailsSlice';
import { useModulePermissions } from '@/utils/useModulePremission';

const BudgetSupplementalPage = () => {
  const dispatch = useDispatch();

  const { departments } = useSelector((state) => state.departments);
  const { subdepartments } = useSelector((state) => state.subdepartments);
  const chartOfAccounts = useSelector(
    (state) => state.chartOfAccounts?.accounts || []
  );
  const { fiscalYears } = useSelector((state) => state.fiscalYears);
  const { funds } = useSelector((state) => state.funds);
  const { projectDetails } = useSelector((state) => state.projectDetails);
  const [data, setData] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const [isLoading, setIsLoading] = useState('');
  // ---------------------USE MODULE PERMISSIONS------------------START (BudgetSupplementalPage - MODULE ID =  26 )
  const { Add, Edit, Delete, Print } = useModulePermissions(26);
  useEffect(() => {
    dispatch(fetchFiscalYears());
    dispatch(fetchFunds());
    dispatch(fetchProjectDetails());
    dispatch(fetchDepartments());
    dispatch(fetchSubdepartments());
    dispatch(fetchAccounts());
    fetchBudgetSupplementals();
    fetchBudgetList();
  }, []);
  const fetchBudgetSupplementals = async () => {
    try {
      const res = await axiosInstance('/budgetSupplemental/list');

      setData(res?.data);
    } catch (error) {
      toast.error('Failed to load data');
      toast.error(error.message);
    }
  };
  const fetchBudgetList = async () => {
    try {
      const res = await axiosInstance('/budgetSupplemental/budgetList');

      setBudgetList(res?.data);
    } catch (error) {
      toast.error('Failed to load data');
      toast.error(error.message);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  const [filters, setFilters] = useState({
    department: '',
    subDepartment: '',
    chartOfAccounts: '',
  });

  const handleEdit = (row) => {
    setActiveRow(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (row) => {
    // NOTHING IN OLD SOFTWARE
    // toast.success(`Deleted ${row.Name}`);
    try {
      // Make API call using your axiosInstance
      // await axiosInstance.delete(`/budgetSupplemental/${row.ID}`);
      // toast.success('Budget Supplemental dDeleted Successfully');
      // fetchBudgetSupplementals();
    } catch (error) {
      // toast.error(error.message || 'Failed to delete Budget Supplemental');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Make API call using your axiosInstance
      const response = await axiosInstance.post(
        'budgetSupplemental/save',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.data) {
        toast.success(
          activeRow
            ? 'Supplemental updated successfully'
            : 'New supplemental added'
        );

        fetchBudgetSupplementals();
      } else {
        toast.error('Failed to save supplemental');
      }
    } catch (error) {
      console.error('Error submitting supplemental:', error);
      toast.error(error.message || 'Failed to save supplemental');
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    {
      key: 'Status',
      header: 'Status',
      render: (value) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value === 'Requested'
              ? 'bg-warning-100 text-warning-800'
              : value === 'Approved'
              ? 'bg-success-100 text-success-800'
              : 'bg-error-100 text-error-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'InvoiceNumber',
      header: 'Invoice Number',
      render: (_, row) => <span>{row.InvoiceNumber}</span>,
    },
    {
      key: 'Budget',
      header: 'Budget',
      render: (_, row) => <span>{row.Budget?.Name}</span>,
    },
    {
      key: 'InvoiceDate',
      header: 'Invoice Date',
      render: (_, row) => {
        const date = new Date(row.InvoiceDate);
        return (
          <span>
            {date.toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            })}
          </span>
        );
      },
    },
    {
      key: 'Total',
      header: 'Total',
      render: (_, row) => (
        <span>
          {parseFloat(row.Total).toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })}
        </span>
      ),
    },
  ];

  // const actions = [
  //   Edit && {
  //     icon: PencilIcon,
  //     title: 'Edit',
  //     onClick: handleEdit,
  //     className:
  //       'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
  //   },
  //   Delete && {
  //     icon: TrashIcon,
  //     title: 'Delete',
  //     onClick: handleDelete,
  //     className:
  //       'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
  //   },
  // ];
  const handleBSPAction = async (info, action) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        `/budgetSupplemental/${action}`,
        { ID: info.ID, LinkID: info.LinkID, Reason: 'This is the reason' }
      );
      console.log(`${action}d:`, response.data);
      fetchBudgetSupplementals();
      toast.success(`Budget Supplemental ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing Budget Supplemental:`, error);
      toast.error(`Error ${action}ing Budget Supplemental`);
    } finally {
      setIsLoading(false);
    }
  };
  const actions = (row) => {
    const actionList = [];

    if (row.Status.toLowerCase().includes('rejected') && Edit) {
      actionList.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: handleEdit,
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
      actionList.push({
        icon: TrashIcon,
        title: 'Delete',
        onClick: handleDelete,
        className:
          'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
      });
    } else if (row.Status === 'Requested') {
      actionList.push(
        {
          icon: CheckLine,
          title: 'Approve',
          onClick: () => handleBSPAction(row, 'approve'),
          className:
            'text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50',
        },
        {
          icon: X,
          title: 'Reject',
          onClick: () => handleBSPAction(row, 'reject'),
          className:
            'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
        }
      );
    }

    return actionList;
  };
  // Apply filters to data
  const filteredData = data.filter((item) => {
    console.log(filters, item);
    const { Budget } = item;
    return (
      (!filters.department || Budget?.DepartmentID == filters.department) &&
      (!filters.subDepartment ||
        Budget?.SubDepartmentID == filters.subDepartment) &&
      (!filters.chartOfAccounts ||
        Budget?.ChartofAccountsID == filters.chartOfAccounts)
    );
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1>Budget Supplemental</h1>
          <p>Manage your supplemental budgets here</p>
        </div>
        <div className="flex gap-4">
          {Add && (
            <button
              onClick={() => handleEdit(null)}
              className="btn btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Supplemental
            </button>
          )}
          {Print && (
            <button
              // TODO : Add print functionality
              onClick={() => {}}
              className="btn btn-outline flex items-center"
            >
              <PrinterIcon className="h-5 w-5 mr-2" />
              Print
            </button>
          )}
        </div>
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
          {subdepartments?.map((sd) => (
            <option key={sd.ID} value={sd.ID}>
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
          {chartOfAccounts?.map((c) => (
            <option key={c.ID} value={c.ID}>
              {c.Name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        loading={isLoading}
        actions={actions}
        pagination={true}
      />

      {/* Modal */}
      <Modal
        size="md"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeRow ? 'Edit Supplemental' : 'Add New Supplemental'}
      >
        <BudgetSupplementalForm
          budgetList={budgetList}
          departmentOptions={departments.map((dept) => ({
            value: dept.ID,
            label: dept.Name,
          }))}
          subDepartmentOptions={subdepartments.map((subDept) => ({
            value: subDept.ID,
            label: subDept.Name,
          }))}
          chartOfAccountsOptions={chartOfAccounts.map((account) => ({
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

export default BudgetSupplementalPage;
