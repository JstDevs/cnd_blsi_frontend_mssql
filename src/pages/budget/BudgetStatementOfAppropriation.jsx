import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import axios from '@/utils/axiosInstance';
import DataTable from '@/components/common/DataTable';
import { fetchFiscalYears } from '@/features/settings/fiscalYearSlice';
import { fetchFunds } from '@/features/budget/fundsSlice';
import { fetchDepartments } from '@/features/settings/departmentSlice';
import { useReactToPrint } from 'react-to-print';
import SAAOBPrintView from '@/pages/budget/form-budget/SAAOBPrintView';
import SAOPrintView from '@/pages/budget/form-budget/SAOPrintView';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BudgetStatementOfAppropriation = () => {
  const dispatch = useDispatch();

  const { fiscalYears } = useSelector((state) => state.fiscalYears);
  const { funds } = useSelector((state) => state.funds);
  const { departments } = useSelector((state) => state.departments);

  const [viewMode, setViewMode] = useState('appropriations');

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fiscalYearID, setFiscalYearID] = useState('');
  const [fundsID, setFundsID] = useState('');
  const [departmentID, setDepartmentID] = useState('');

  // Signatories State
  const [preparedByName, setPreparedByName] = useState('');
  const [preparedByTitle, setPreparedByTitle] = useState('Budget Officer');
  const [certifiedByName, setCertifiedByName] = useState('');
  const [certifiedByTitle, setCertifiedByTitle] = useState('Municipal Accountant');

  const saaobRef = useRef();
  const saoRef = useRef();
  useEffect(() => {
    dispatch(fetchFiscalYears());
    dispatch(fetchFunds());
    dispatch(fetchDepartments());
  }, [dispatch]);

  const getPayload = () => ({
    startDate,
    endDate,
    fiscalYearID,
    fundsID,
    departmentID,
  });

  const validateFilters = () => {
    return startDate && endDate && fiscalYearID && fundsID && departmentID;
  };

  const handleFetchData = async (type) => {
    if (!validateFilters()) {
      toast.error('Please select all filters');
      return;
    }

    setLoading(true);
    try {
      setViewMode(type);

      const url =
        type === 'appropriations'
          ? '/statementOfAppropriations/view'
          : '/statementOfAppropriations/viewSAO';

      const res = await axios.post(url, getPayload());
      setTableData(res.data);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const columnsAppropriation = [
    { key: 'Fund', header: 'Fund' },
    { key: 'Year', header: 'Year' },
    { key: 'Month End', header: 'Month End' },
    { key: 'Account Code', header: 'Account Code' },
    { key: 'ID', header: 'ID' },
    { key: 'Category', header: 'Category' },
    { key: 'Name', header: 'Name' },
    { key: 'Appropriation', header: 'Appropriation', numeric: true },
    { key: 'Allotment', header: 'Allotment', numeric: true },
    { key: 'Obligation', header: 'Obligation', numeric: true },
    {
      key: 'Unobligated Appropriation',
      header: 'Unobligated Appropriation',
      numeric: true,
    },
    {
      key: 'Unobligated Allotment',
      header: 'Unobligated Allotment',
      numeric: true,
    },
    { key: 'Municipality', header: 'Municipality' },
    { key: 'Province', header: 'Province' },
    { key: 'Requested By', header: 'Requested By' },
    { key: 'Position', header: 'Position' },
  ];

  const columnsViewSAO = [
    { key: 'Date', header: 'Date' },
    { key: 'OBR No.', header: 'OBR No.' },
    { key: 'Particulars', header: 'Particulars' },
    {
      key: 'Appropriation/ Allotment',
      header: 'Appropriation/ Allotment',
      numeric: true,
    },
    { key: 'Expenses', header: 'Expenses', numeric: true },
    { key: 'Balance', header: 'Balance', numeric: true },
  ];
  const handleExport = async () => {
    if (!validateFilters()) {
      toast.error('Please select all filters');
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/statementOfAppropriations/exportExcel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
          body: JSON.stringify(getPayload()),
        }
      );

      if (!response.ok) throw new Error('Server response was not ok');

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      let filename = `StatementOfAppropriations.xlsx`;

      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1].replace(/['"]/g, '');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      toast.error(err.message || 'Failed to export file');
    }
  };

  const handlePrintSAAOB = useReactToPrint({
    contentRef: saaobRef,
    documentTitle:
      'Statement of Appropriations, Allotment, Obligations and Balances',
  });

  const handlePrintSAO = useReactToPrint({
    contentRef: saoRef,
    documentTitle: 'Statement of Appropriations and Obligations.',
  });

  const handleGenerate = (type) => {
    if (!validateFilters() || tableData.length === 0) {
      toast.error('Please fetch data first before generating report');
      return;
    }
    if (type === 'saaob') handlePrintSAAOB();
    if (type === 'sao') handlePrintSAO();
  };
  return (
    <div className="page-container">
      <div className="page-header mb-4">
        <h1 className="text-2xl font-bold text-neutral-900">
          Statement of Appropriations, Allotment, Obligations and Balances
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          Generate reports to observe the values of the budgets within the system and its released amount, charges, and remaining balances
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div className="w-full sm:w-44">
          <label>Start Date</label>
          <input
            type="date"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-44">
          <label>End Date</label>
          <input
            type="date"
            className="form-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-44">
          <label>Fiscal Year</label>
          <select
            className="form-select"
            value={fiscalYearID}
            onChange={(e) => setFiscalYearID(e.target.value)}
          >
            <option value="">-- Select --</option>
            {fiscalYears.map((y) => (
              <option key={y.ID} value={y.ID}>
                {y.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-44">
          <label>Fund</label>
          <select
            className="form-select"
            value={fundsID}
            onChange={(e) => setFundsID(e.target.value)}
          >
            <option value="">-- Select --</option>
            {funds.map((f) => (
              <option key={f.ID} value={f.ID}>
                {f.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-44">
          <label>Department</label>
          <select
            className="form-select"
            value={departmentID}
            onChange={(e) => setDepartmentID(e.target.value)}
          >
            <option value="">-- Select --</option>
            {departments.map((d) => (
              <option key={d.ID} value={d.ID}>
                {d.Name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-4 border-t border-neutral-200 flex flex-wrap justify-end gap-3 mb-6">
        <button
          onClick={() => handleFetchData('appropriations')}
          className="btn btn-secondary"
        >
          View SAAOB
        </button>
        <button
          onClick={() => handleFetchData('viewSAO')}
          className="btn btn-secondary"
        >
          View SAO
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleGenerate('saaob')}
        >
          Generate SAAOB
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleGenerate('sao')}
        >
          Generate SAO
        </button>
        <button
          className="btn btn-success"
          onClick={handleExport}
        >
          Export to Excel
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={
          viewMode === 'appropriations' ? columnsAppropriation : columnsViewSAO
        }
        data={tableData}
        loading={loading}
      />
      {/* hidden print components */}
      <div className="hidden">
        <SAAOBPrintView
          ref={saaobRef}
          data={tableData}
          preparedByName={preparedByName}
          preparedByTitle={preparedByTitle}
          certifiedByName={certifiedByName}
          certifiedByTitle={certifiedByTitle}
        />
        <SAOPrintView
          ref={saoRef}
          data={tableData}
          preparedByName={preparedByName}
          preparedByTitle={preparedByTitle}
          certifiedByName={certifiedByName}
          certifiedByTitle={certifiedByTitle}
        />
      </div>
    </div>
  );
};

export default BudgetStatementOfAppropriation;





