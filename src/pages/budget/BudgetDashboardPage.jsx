import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../../features/settings/departmentSlice';
import { fetchSubdepartments } from '../../features/settings/subdepartmentSlice';
import { fetchBudgetData } from '../../features/budget/budgetDashboardSlice';
import FormField from '../../components/common/FormField';
import BudgetPieChart from '../../components/charts/BudgetPieChart';
import EncumbrancePieChart from '../../components/charts/EncumbrancePieChart';
import DataTable from '../../components/common/DataTable';

function BudgetDashboardPage() {
  const dispatch = useDispatch();

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSubDepartment, setSelectedSubDepartment] = useState('');
  
  // mock data for testing
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [budgetData, setBudgetData] = useState({ chart1: [], chart2: [], table: [] });
  const [loading, setLoading] = useState(false);

  const mockDepartments = [
    { ID: 'dept1', Name: 'Finance' },
    { ID: 'dept2', Name: 'Operations' },
  ];

  const mockSubDepartments = {
    dept1: [
      { ID: 'sub1', Name: 'Accounts Payable' },
      { ID: 'sub2', Name: 'Budgeting' },
    ],
    dept2: [
      { ID: 'sub3', Name: 'Logistics' },
      { ID: 'sub4', Name: 'Maintenance' },
    ],
  };
  const mockBudgetData = {
    chart1: [
      { name: 'Budget Amount', value: 600000 },
      { name: 'Charges', value: 450000 },
    ],
    chart2: [
      { name: 'PreEncumbrance', value: 100000 },
      { name: 'Encumbrance', value: 200000 },
      { name: 'Charges', value: 150000 },
    ],
    table: [
      { name: 'Accounts Payable', total: '₹250,000' },
      { name: 'Accounts Receivable', total: '₹300,000' },
    ],
  };
  useEffect(() => {
    // Simulate department API fetch
    setDepartments(mockDepartments);
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      // Simulate sub-department fetch
      setSubDepartments(mockSubDepartments[selectedDepartment] || []);
      setSelectedSubDepartment('');
      setBudgetData({ chart1: [], chart2: [], table: [] }); // reset data
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedSubDepartment) {
      // Simulate budget data fetch
      setLoading(true);
      setTimeout(() => {
        setBudgetData(mockBudgetData);
        setLoading(false);
      }, 800);
    }
  }, [selectedSubDepartment]);
  // mock data ends






  // const { departments, subDepartments, budgetData, loading } = useSelector(state => state.budget);
  // const {
  //   departments = [],
  //   subDepartments = [],
  //   budgetData,
  //   loading,
  // } = useSelector((state) => state.budget);



  // useEffect(() => {
  //   dispatch(fetchDepartments());
  // }, [dispatch]);

  // useEffect(() => {
  //   if (selectedDepartment) {
  //     dispatch(fetchSubDepartments(selectedDepartment));
  //     setSelectedSubDepartment('');
  //   }
  // }, [dispatch, selectedDepartment]);

  // useEffect(() => {
  //   if (selectedSubDepartment) {
  //     dispatch(fetchBudgetData(selectedSubDepartment));
  //   }
  // }, [dispatch, selectedSubDepartment]);

  const tableColumns = [
    { key: 'name', header: 'AP AR', sortable: false },
    { key: 'total', header: 'Total', sortable: false }
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Budget Dashboard</h1>
        <p>Analyze department-wise budget allocations and expenses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormField
          label="Department"
          name="Department"
          type="select"
          value={selectedDepartment}
          onChange={e => setSelectedDepartment(e.target.value)}
          options={departments.map(d => ({ value: d.ID, label: d.Name }))}
          required
        />
        <FormField
          label="Sub-Department"
          name="SubDepartment"
          type="select"
          value={selectedSubDepartment}
          onChange={e => setSelectedSubDepartment(e.target.value)}
          options={subDepartments.map(sd => ({ value: sd.ID, label: sd.Name }))}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <BudgetPieChart data={budgetData?.chart1} loading={loading} />
        <EncumbrancePieChart data={budgetData?.chart2} loading={loading} />
      </div>

      <div className="mt-6">
        <DataTable
          columns={tableColumns}
          data={budgetData?.table || []}
          loading={loading}
          emptyMessage="No budget data found for selected sub-department."
        />
      </div>
    </div>
  );
}

export default BudgetDashboardPage;
