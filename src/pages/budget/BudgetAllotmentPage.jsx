import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon } from '@heroicons/react/24/solid';
import {
  CheckLine,
  EyeIcon,
  PencilIcon,
  PrinterIcon,
  TrashIcon,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import Modal from '@/components/common/Modal';
import BudgetAllotmentForm from '@/components/forms/BudgetAllotmentForm';
import DataTable from '@/components/common/DataTable';

import { fetchDepartments } from '@/features/settings/departmentSlice';
import { fetchSubdepartments } from '@/features/settings/subdepartmentSlice';
import { fetchAccounts } from '@/features/settings/chartOfAccountsSlice';
import axiosInstance from '@/utils/axiosInstance';
import { useModulePermissions } from '@/utils/useModulePremission';

const API_URL = import.meta.env.VITE_API_URL;

const BudgetAllotmentPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // ---------------------USE MODULE PERMISSIONS------------------START (BudgetAllotmentPage - MODULE ID =  23 )
  const { Add, Edit, Print } = useModulePermissions(23);
  const { departments } = useSelector((state) => state.departments);
  const { subdepartments } = useSelector((state) => state.subdepartments);
  const chartOfAccounts = useSelector(
    (state) => state.chartOfAccounts?.accounts || []
  );
  const { fiscalYears } = useSelector((state) => state.fiscalYears);
  const { funds } = useSelector((state) => state.funds);
  const { projectDetails } = useSelector((state) => state.projectDetails);

  const [data, setData] = useState([]);
  const [allotmentList, setAllotmentList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isView, setIsView] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [isLoadingBAPAction, setIsLoadingBAPAction] = useState(false);
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
    fetchAllotmentList();
  }, []);

  const fetchBudgetAllotments = async () => {
    try {
      const res = await axiosInstance(`/budgetAllotment/list`);

      setData(res.data);
    } catch (error) {
      toast.error('Failed to load data');
      toast.error(error.message);
    }
  };
  const fetchAllotmentList = async () => {
    try {
      const res = await axiosInstance('/budgetSupplemental/budgetList');

      setAllotmentList(res?.data);
    } catch (error) {
      toast.error('Failed to load data');
      toast.error(error.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (formData) => {
    try {
      // Make API call using your axiosInstance
      const response = await axiosInstance.post('budgetAllotment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data) {
        toast.success(
          activeRow ? 'Allotment updated successfully' : 'New Allotment added'
        );

        fetchBudgetAllotments();
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

  const handleEdit = (row) => {
    setActiveRow(row);
    setIsModalOpen(true);
  };
  const handleView = (row) => {
    setActiveRow(row);
    setIsModalOpen(true);
    setIsView(true);
  };

  const columns = [
    {
      key: 'Status',
      header: 'Status',
      render: (value) => <span>{value}</span>,
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
      render: (value, row) => (
        <span>
          {parseFloat(row?.Budget?.TotalAmount || value || 0).toLocaleString(
            'en-US',
            {
              minimumFractionDigits: 2,
            }
          )}
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
  // ];
  const handleBAPAction = async (dv, action) => {
    setIsLoadingBAPAction(true);
    try {
      // TODO : add action
      // const response = await axiosInstance.post(
      //   `/disbursementVoucher/${action}`,
      //   { ID: dv.ID }
      // );
      console.log(`${action}d:`, response.data);
      // dispatch(fetchGeneralServiceReceipts());
      toast.success(`Budget Allotment ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing Budget Allotment:`, error);
      toast.error(`Error ${action}ing Budget Allotment`);
    } finally {
      setIsLoadingBAPAction(false);
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
        onClick: () => handleDelete(row),
        className:
          'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
      });
    } else if (row.Status.toLowerCase().includes('requested')) {
      actionList.push(
        {
          icon: CheckLine,
          title: 'Approve',
          onClick: () => handleBAPAction(row, 'approve'),
          className:
            'text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50',
        },
        {
          icon: X,
          title: 'Reject',
          onClick: () => handleBAPAction(row, 'reject'),
          className:
            'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
        }
      );
    }
    actionList.push({
      icon: EyeIcon,
      title: 'View',
      onClick: handleView,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    });
    return actionList;
  };
  const handleDelete = async (row) => {
    console.log('Delete row', row);
    // await dispatch(deleteBudgetAllotment(row.ID)).unwrap();
    // dispatch(fetchBudgetAllotments());
  };
  const filteredData = data?.filter((item) => {
    // console.log('item', item, filters);
    const { Budget } = item;
    return (
      (!filters.department || Budget?.DepartmentID == filters.department) &&
      (!filters.subDepartment ||
        Budget?.SubDepartmentID == filters.subDepartment) &&
      (!filters.chartOfAccounts ||
        Budget?.ChartofAccountsID == filters.chartOfAccounts)
    );
  });
  // console.log('filteredData', filteredData, data);
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1>Budget Allotment</h1>
          <p>Manage budget allotments here</p>
        </div>
        <div className="flex gap-4">
          {Add && (
            <button
              onClick={() => handleEdit(null)}
              className="btn btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Allotment
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
          <option value="">All Department</option>
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
          <option value="">All Sub Department</option>
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
          <option value="">All Chart of Account</option>
          {chartOfAccounts?.map((a) => (
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
        loading={isLoadingBAPAction}
        onRowClick={(row) => {
          setActiveRow(row);
        }}
        selectedRow={activeRow}
        pagination
      />

      {/* Modal */}
      <Modal
        size="md"
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveRow(null);
          setIsView(false);
        }}
        title={
          isView
            ? 'View Allotment'
            : activeRow
            ? 'Edit Allotment'
            : 'Add Allotment'
        }
      >
        <BudgetAllotmentForm
          isView={isView}
          allotmentList={allotmentList}
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

export default BudgetAllotmentPage;
