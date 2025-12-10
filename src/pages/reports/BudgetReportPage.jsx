import { useEffect, useState } from 'react';
import { PrinterIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFunds } from '@/features/budget/fundsSlice';
import { fetchDepartments } from '@/features/settings/departmentSlice';
import { fetchFiscalYears } from '@/features/settings/fiscalYearSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

function BudgetReportPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fiscalYearID, setFiscalYearID] = useState('');
  const [fundsID, setFundsID] = useState('');
  const [departmentID, setDepartmentID] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { funds } = useSelector((state) => state.funds);
  const { departments } = useSelector((state) => state.departments);
  const { fiscalYears } = useSelector((state) => state.fiscalYears);

  useEffect(() => {
    dispatch(fetchFunds());
    dispatch(fetchDepartments());
    dispatch(fetchFiscalYears());
  }, [dispatch]);

  const columns = [
    { key: 'Name', header: 'Name', sortable: true },
    { key: 'Account Code', header: 'Account Code', sortable: true },
    {
      key: 'Appropriated',
      header: 'Appropriation',
      sortable: true,
      render: (v) => formatCurrency(v),
      className: 'text-right',
    },
    {
      key: 'Adjustments',
      header: 'Adjustments',
      sortable: true,
      render: (v) => formatCurrency(v),
      className: 'text-right',
    },
    {
      key: 'Allotments',
      header: 'Allotments',
      sortable: true,
      render: (v) => formatCurrency(v),
      className: 'text-right',
    },
    {
      key: 'Obligations',
      header: 'Obligations',
      sortable: true,
      render: (v) => formatCurrency(v),
      className: 'text-right',
    },
    {
      key: 'Appropriation Balance',
      header: 'Appropriation Balance',
      sortable: true,
      render: (v) => formatCurrency(v),
      className: 'text-right',
    },
    {
      key: 'Allotment Balance',
      header: 'Allotment Balance',
      sortable: true,
      render: (v) => formatCurrency(v),
      className: 'text-right',
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const buildPayload = () => ({
    startDate,
    endDate,
    fiscalYearID,
    fundsID,
    departmentID,
  });

  const handleView = async () => {
    if (!validateFilters()) {
      toast.error('Please select all filters');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/budgetReport/view`,
        buildPayload(),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setEntries(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  const validateFilters = () => {
    return startDate && endDate && fiscalYearID && fundsID && departmentID;
  };
  const handleExport = async () => {
    if (!validateFilters()) {
      toast.error('Please select all filters');
      return;
    }
    try {
      const res = await axios.post(
        `${API_URL}/budgetReport/exportExcel`,
        buildPayload(),
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Budget_Report.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast.error('Export failed');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1>Budget Reports</h1>
            <p>View and generate budget utilization reports</p>
          </div>
          <div className="flex space-x-2  max-sm:w-full ">
            <button
              onClick={handleExport}
              className="btn btn-outline  max-sm:w-full "
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" /> Export
            </button>
            {/* <button className="btn btn-outline flex items-center">
              <PrinterIcon className="h-5 w-5 mr-2" /> Print
            </button> */}
          </div>
        </div>
      </div>

      <div className="mt-4 card p-4">
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <div className="w-full sm:w-44">
            <FormField
              label="Start Date"
              name="startDate"
              type="date"
              value={startDate}
              required
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-44">
            <FormField
              label="End Date"
              name="endDate"
              type="date"
              value={endDate}
              required
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-44">
            <FormField
              label="Fiscal Year"
              name="fiscalYearID"
              type="select"
              value={fiscalYearID}
              required
              onChange={(e) => setFiscalYearID(e.target.value)}
              options={fiscalYears.map((y) => ({ label: y.Name, value: y.ID }))}
            />
          </div>
          <div className="w-full sm:w-44">
            <FormField
              label="Fund"
              name="fundsID"
              type="select"
              value={fundsID}
              required
              onChange={(e) => setFundsID(e.target.value)}
              options={[
                { label: 'All Funds', value: '%' },
                ...funds.map((f) => ({ label: f.Name, value: f.ID })),
              ]}
            />
          </div>
          <div className="w-full sm:w-44">
            <FormField
              label="Department"
              name="departmentID"
              type="select"
              value={departmentID}
              required
              onChange={(e) => setDepartmentID(e.target.value)}
              options={[
                { label: 'All Departments', value: '%' },
                ...departments.map((d) => ({ label: d.Name, value: d.ID })),
              ]}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleView}
          >
            View
          </button>
        </div>
      </div>

      <div className="mt-8">
        <DataTable
          columns={columns}
          data={entries}
          pagination={true}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default BudgetReportPage;
