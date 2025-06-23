import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

export default function EncumbrancePieChart({ data }) {
  if (!data || data.length === 0) return (
    <div className="text-center text-gray-500">No data</div>
  );

  return (
    <div className="card p-4 h-full">
      <h3 className="font-semibold text-lg mb-4">Encumbrance vs Charges</h3>
      <div className="w-full h-64"> {/* Adjust height here as needed */}
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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
