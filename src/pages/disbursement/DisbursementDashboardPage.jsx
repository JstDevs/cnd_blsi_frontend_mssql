import { useEffect, useState } from 'react';
import FormField from '../../components/common/FormField';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

const mockAmounts = {
  year: {
    disbursed: 'PHP 10,00,00,000',
    obligated: 'PHP 8,50,00,000'
  },
  month: {
    disbursed: 'PHP 2,50,00,000',
    obligated: 'PHP 2,00,00,000'
  },
  day: {
    disbursed: 'PHP 10,00,000',
    obligated: 'PHP 8,00,000'
  }
};

const mockChartData = {
  year: {
    disbursement: [
      { name: 'Posted', value: 80 },
      { name: 'Rejected', value: 20 }
    ],
    obligation: [
      { name: 'Posted', value: 60 },
      { name: 'Requested', value: 30 },
      { name: 'Rejected', value: 10 }
    ],
    travel: [
      { name: 'Posted', value: 40 },
      { name: 'Requested', value: 40 },
      { name: 'Rejected', value: 20 }
    ]
  },
  month: {
    disbursement: [
      { name: 'Posted', value: 70 },
      { name: 'Rejected', value: 30 }
    ],
    obligation: [
      { name: 'Posted', value: 50 },
      { name: 'Requested', value: 40 },
      { name: 'Rejected', value: 10 }
    ],
    travel: [
      { name: 'Posted', value: 60 },
      { name: 'Requested', value: 30 },
      { name: 'Rejected', value: 10 }
    ]
  },
  day: {
    disbursement: [
      { name: 'Posted', value: 90 },
      { name: 'Rejected', value: 10 }
    ],
    obligation: [
      { name: 'Posted', value: 55 },
      { name: 'Requested', value: 35 },
      { name: 'Rejected', value: 10 }
    ],
    travel: [
      { name: 'Posted', value: 65 },
      { name: 'Requested', value: 25 },
      { name: 'Rejected', value: 10 }
    ]
  }
};

function DisbursementDashboardPage() {
  const [timeframe1, setTimeframe1] = useState('year');
  const [department1, setDepartment1] = useState('');
  const [timeframe2, setTimeframe2] = useState('year');
  const [department2, setDepartment2] = useState('');

  const disbursed = mockAmounts[timeframe1]?.disbursed || '';
  const obligated = mockAmounts[timeframe1]?.obligated || '';

  const chartData = mockChartData[timeframe2];

  const timeOptions = [
    { value: 'year', label: 'Year' },
    { value: 'month', label: 'Month' },
    { value: 'day', label: 'Day' }
  ];

  const deptOptions = [
    { value: 'dept1', label: 'Department A' },
    { value: 'dept2', label: 'Department B' }
  ];

  const renderPieCard = (title, data) => (
    <div className="card p-4 h-full">
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius="80%" label>
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

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
          onChange={e => setTimeframe1(e.target.value)}
          options={timeOptions}
        />
        <FormField
          label="Department"
          type="select"
          value={department1}
          onChange={e => setDepartment1(e.target.value)}
          options={deptOptions}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="card p-6 text-center text-lg font-medium text-primary-700">
          Disbursed Amount: {disbursed}
        </div>
        <div className="card p-6 text-center text-lg font-medium text-amber-700">
          Obligated Amount: {obligated}
        </div>
      </div>

      <hr className="my-8 border-t" />

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Timeframe"
          type="select"
          value={timeframe2}
          onChange={e => setTimeframe2(e.target.value)}
          options={timeOptions}
        />
        <FormField
          label="Department"
          type="select"
          value={department2}
          onChange={e => setDepartment2(e.target.value)}
          options={deptOptions}
        />
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {renderPieCard('Disbursement', chartData.disbursement)}
        {renderPieCard('Obligation', chartData.obligation)}
        {renderPieCard('Travel', chartData.travel)}
      </div>
    </div>
  );
}

export default DisbursementDashboardPage;
