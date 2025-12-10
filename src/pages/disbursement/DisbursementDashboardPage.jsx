import { useEffect, useState } from 'react';
import FormField from '../../components/common/FormField';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { fetchDepartments } from '@/features/settings/departmentSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  fetchObligationChart,
  fetchTravelOrderChart,
  fetchDisbursementChart,
  fetchDisbursementAmounts,
} from '../userProfile/profileUtil';

const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

const timeOptions = [
  { value: 'year', label: 'Year' },
  { value: 'month', label: 'Month' },
  { value: 'day', label: 'Day' },
];
function DisbursementDashboardPage() {
  const [timeframe1, setTimeframe1] = useState('year');
  const [department1, setDepartment1] = useState('');
  const [timeframe2, setTimeframe2] = useState('year');
  const [department2, setDepartment2] = useState('');
  const [disbursedAmount, setDisbursedAmount] = useState('');
  const [obligatedAmount, setObligatedAmount] = useState('');

  const [chartData2, setChartData2] = useState({
    disbursement: [],
    obligation: [],
    travel: [],
  });
  const dispatch = useDispatch();
  const { departments } = useSelector((state) => state.departments);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, []);

  // Load disbursed and obligated amounts when timeframe or department changes
  useEffect(() => {
    const loadAmounts = async () => {
      try {
        const [obligationRes, disbursementRes] = await Promise.all([
          fetchDisbursementAmounts(
            timeframe1,
            'Obligation Request',
            department1 === 'All' ? '' : department1
          ),
          fetchDisbursementAmounts(
            timeframe1,
            'Disbursement Voucher',
            department1 === 'All' ? '' : department1
          ),
        ]);
        setObligatedAmount(
          `PHP ${parseFloat(obligationRes?.data?.total || 0).toLocaleString()}`
        );
        setDisbursedAmount(
          `PHP ${parseFloat(
            disbursementRes?.data?.total || 0
          ).toLocaleString()}`
        );
      } catch (error) {
        console.error('Error loading disbursement amounts:', error);
        toast.error('Failed to load disbursement amounts');
      }
    };

    loadAmounts();
  }, [timeframe1, department1]);
  // Load chart data when timeframe or department changes
  useEffect(() => {
    const loadCharts = async () => {
      try {
        const dep = department2 === 'All' ? '' : department2;

        const [obligationRes, travelRes, disbursementRes] = await Promise.all([
          fetchObligationChart(timeframe2, dep),
          fetchTravelOrderChart(timeframe2, dep),
          fetchDisbursementChart(timeframe2, dep),
        ]);

        setChartData2({
          obligation: obligationRes?.data || [],
          travel: travelRes?.data || [],
          disbursement: disbursementRes?.data || [],
        });
      } catch (error) {
        console.error('Error loading chart data:', error);
        toast.error('Failed to load chart data');
      }
    };

    loadCharts();
  }, [timeframe2, department2]);

  return (
    <div>
      <div className="page-header">
        <h1>Disbursement Dashboard</h1>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormField
          label="Timeframe"
          type="select"
          value={timeframe1}
          onChange={(e) => setTimeframe1(e.target.value)}
          options={timeOptions}
        />
        <FormField
          label="Department"
          name="Department"
          type="select"
          value={department1}
          onChange={(e) => {
            const selectedDepartmentId =
              e.target.value === 'All Departments' ? 'All' : e.target.value;
            setDepartment1(selectedDepartmentId);
          }}
          options={[
            ...departments?.map((d) => ({ value: d.ID, label: d.Name })),
            { value: 'All Departments', label: 'All Departments' },
          ]}
          required
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="card p-6 text-center text-lg font-medium text-primary-700">
          Disbursed Amount: {disbursedAmount}
        </div>
        <div className="card p-6 text-center text-lg font-medium text-amber-700">
          Obligated Amount: {obligatedAmount}
        </div>
      </div>

      <hr className="my-8 border-t" />

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Timeframe"
          type="select"
          value={timeframe2}
          onChange={(e) => setTimeframe2(e.target.value)}
          options={timeOptions}
        />
        <FormField
          label="Department"
          name="Department"
          type="select"
          value={department1}
          onChange={(e) => {
            const selectedDepartmentId =
              e.target.value === 'All Departments' ? 'All' : e.target.value;
            setDepartment2(selectedDepartmentId);
          }}
          options={[
            ...departments?.map((d) => ({ value: d.ID, label: d.Name })),
            { value: 'All Departments', label: 'All Departments' },
          ]}
          required
        />
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {renderPieCard('Disbursement', [chartData2?.disbursement])}
        {renderPieCard('Obligation', [chartData2?.obligation])}
        {renderPieCard('Travel', [chartData2?.travel])}
      </div>
    </div>
  );
}

export default DisbursementDashboardPage;
const renderPieCard = (title, data) => (
  <div className="card p-4 h-full">
    <h3 className="font-semibold text-lg mb-4">{title}</h3>
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius="80%"
            label
          >
            {data?.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);
