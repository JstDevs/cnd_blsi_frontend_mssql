import { useEffect, useState } from 'react';
import FormField from '../../components/common/FormField';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

import toast from 'react-hot-toast';
import {
  fetchChartBurial,
  fetchChartCedula,
  fetchChartGeneral,
  fetchChartMarriage,
  fetchCollectionTotals,
} from '../userProfile/profileUtil';

const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

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
  const [timeframe, setTimeframe] = useState('day');
  const [revenueStats, setRevenueStats] = useState({
    general: 0,
    marriage: 0,
    burial: 0,
    cedula: 0,
  });

  const [chartGeneral, setChartGeneral] = useState([]);
  const [chartMarriage, setChartMarriage] = useState([]);
  const [chartBurial, setChartBurial] = useState([]);
  const [chartCedula, setChartCedula] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [totalsRes, generalRes, marriageRes, burialRes, cedulaRes] =
          await Promise.all([
            fetchCollectionTotals(timeframe),
            fetchChartGeneral(),
            fetchChartMarriage(),
            fetchChartBurial(),
            fetchChartCedula(),
          ]);

        const totals = totalsRes?.data || {};

        setRevenueStats({
          general: parseFloat(totals.General || 0),
          marriage: parseFloat(totals.Marriage || 0),
          burial: parseFloat(totals.Burial || 0),
          cedula: parseFloat(totals.Cedula || 0),
        });

        setChartGeneral(formatChart(generalRes.data));
        setChartMarriage(formatChart(marriageRes.data));
        setChartBurial(formatChart(burialRes.data));
        setChartCedula(formatChart(cedulaRes.data));
      } catch (error) {
        console.error(error);
        toast.error('Failed to load collection data');
      }
    };

    loadData();
  }, [timeframe]);

  const formatChart = (data = []) => {
    // Expecting array like: [{ date: 'No Data', total: '0.00' }]
    return data.map((item) => ({
      name: item.date || 'Unknown',
      value: parseFloat(item.total || 0),
    }));
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-start">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">Cedula</h1>
          <CollectionPie title="Cedula" data={chartCedula} />
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-xl">Revenue</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Select View"
              type="select"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
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
              <p className="text-lg text-primary-700 font-semibold">
                PHP {revenueStats.general.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="font-medium">Marriage Service Invoice</p>
              <p className="text-lg text-primary-700 font-semibold">
                PHP {revenueStats.marriage.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="font-medium">Burial Service Invoice</p>
              <p className="text-lg text-primary-700 font-semibold">
                PHP {revenueStats.burial.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="font-medium">Cedula</p>
              <p className="text-lg text-primary-700 font-semibold">
                PHP {revenueStats.cedula.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      <div className="grid grid-cols-1  lg:grid-cols-3 gap-4 mt-6">
        <CollectionPie title="General Service Invoice" data={chartGeneral} />
        <CollectionPie title="Marriage Service Invoice" data={chartMarriage} />
        <CollectionPie title="Burial Service Invoice" data={chartBurial} />
      </div>
    </div>
  );
}
