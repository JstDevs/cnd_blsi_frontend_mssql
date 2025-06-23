import { useState } from 'react';
import FormField from '../../components/common/FormField';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

const mockRevenueStats = {
  general: 0,
  marriage: 0,
  burial: 0,
  cedula: 0
};

const mockChartData = {
  general: [
    { name: 'Paid', value: 60 },
    { name: 'Unpaid', value: 40 },
  ],
  marriage: [
    { name: 'Paid', value: 80 },
    { name: 'Unpaid', value: 20 },
  ],
  burial: [
    { name: 'Paid', value: 70 },
    { name: 'Unpaid', value: 30 },
  ]
};

function CollectionPie({ title, data }) {
  return (
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
}

export default function CollectionDashboardPage() {

  return (
    <div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-start">
        {/* Col 1: Cedula Heading */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cedula</h1>
        </div>

        {/* Col 2: Revenue Section */}
        <div className="space-y-4">
          <h2 className="font-semibold text-xl">Revenue</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Select View"
              type="select"
              options={[
                { value: 'year', label: 'Year' },
                { value: 'month', label: 'Month' },
                { value: 'day', label: 'Day' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="font-medium">General Service Invoice</p>
              <p className="text-lg text-primary-700 font-semibold">PHP {mockRevenueStats.general.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium">Marriage Service Invoice</p>
              <p className="text-lg text-primary-700 font-semibold">PHP {mockRevenueStats.marriage.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium">Burial Service Invoice</p>
              <p className="text-lg text-primary-700 font-semibold">PHP {mockRevenueStats.burial.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium">Cedula</p>
              <p className="text-lg text-primary-700 font-semibold">PHP {mockRevenueStats.cedula.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>


      <hr className="my-6 border-gray-300" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <CollectionPie title="General Service Invoice" data={mockChartData.general} />
        <CollectionPie title="Marriage Service Invoice" data={mockChartData.marriage} />
        <CollectionPie title="Burial Service Invoice" data={mockChartData.burial} />
      </div>
    </div>
  );
}
