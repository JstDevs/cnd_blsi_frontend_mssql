import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../../features/settings/departmentSlice';
// import { fetchBudgetList, fetchBudgetAPARList } from '../../api/dashboardApi'; // Make sure these are implemented
import FormField from '../../components/common/FormField';
import BudgetPieChart from '../../components/charts/BudgetPieChart';
import EncumbrancePieChart from '../../components/charts/EncumbrancePieChart';
import DataTable from '../../components/common/DataTable';
import {
  fetchBudgetAPARList,
  fetchBudgetList,
} from '../userProfile/profileUtil';

function BudgetDashboardPage() {
  const dispatch = useDispatch();

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [subDepartmentOptions, setSubDepartmentOptions] = useState([]);
  const [selectedBudgetID, setSelectedBudgetID] = useState('');
  const [budgetData, setBudgetData] = useState({
    chart1: [],
    chart2: [],
    table: [],
  });
  const [loading, setLoading] = useState(false);

  const { departments, isLoading } = useSelector((state) => state.departments);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      setLoading(true);
      fetchBudgetList(selectedDepartment === 'All' ? '' : selectedDepartment)
        .then((res) => {
          const list = res?.data || [];
          setSubDepartmentOptions(
            list.map((item) => ({
              value: item.ID,
              label: item.Name,
              ...item,
            }))
          );
        })
        .finally(() => setLoading(false));
    } else {
      setSubDepartmentOptions([]);
    }

    setSelectedBudgetID('');
    setBudgetData({ chart1: [], chart2: [], table: [] });
  }, [selectedDepartment]);

  const handleSubDeptChange = (budgetID) => {
    const row = subDepartmentOptions.find((r) => r.value === Number(budgetID));
    if (!row) return;

    const appropriation = parseFloat(row.Appropriation || 0);
    const supplemental = parseFloat(row.Supplemental || 0);
    const transfer = parseFloat(row.Transfer || 0);
    const charges = parseFloat(row.Charges || 0);
    const preEncumbrance = parseFloat(row.PreEncumbrance || 0);
    const encumbrance = parseFloat(row.Encumbrance || 0);

    const budgetAmount = appropriation + supplemental + transfer - charges;

    const chart1 = [
      { name: 'Budget Amount', value: budgetAmount },
      { name: 'Charges', value: charges },
    ];
    const chart2 = [
      { name: 'PreEncumbrance', value: preEncumbrance },
      { name: 'Encumbrance', value: encumbrance },
      { name: 'Charges', value: charges },
    ];

    setBudgetData((prev) => ({
      ...prev,
      chart1,
      chart2,
    }));

    setLoading(true);
    fetchBudgetAPARList(budgetID)
      .then((res) => {
        const aparData = res?.data || [];
        setBudgetData((prev) => ({ ...prev, table: aparData }));
      })
      .finally(() => setLoading(false));
  };

  const tableColumns = [
    { key: 'APAR', header: 'APAR', sortable: false },
    { key: 'Total', header: 'Total', sortable: false },
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
          onChange={(e) => {
            const selectedDepartmentId =
              e.target.value === 'All Departments' ? 'All' : e.target.value;
            setSelectedDepartment(selectedDepartmentId);
            setSelectedBudgetID('');
            setBudgetData({ chart1: [], chart2: [], table: [] });
          }}
          options={[
            ...departments?.map((d) => ({ value: d.ID, label: d.Name })),
            { value: 'All Departments', label: 'All Departments' },
          ]}
          required
        />
        <FormField
          label="Sub-Department"
          name="SubDepartment"
          type="select"
          value={selectedBudgetID}
          onChange={(e) => {
            console.log('e.target.value', e.target.value);
            setSelectedBudgetID(e.target.value);
            handleSubDeptChange(e.target.value);
          }}
          options={subDepartmentOptions}
          className="disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
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
          loading={loading || isLoading}
          emptyMessage="No budget data found for selected sub-department."
        />
      </div>
    </div>
  );
}

export default BudgetDashboardPage;
