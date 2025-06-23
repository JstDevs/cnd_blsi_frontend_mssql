import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#FF8042'];

export default function BudgetPieChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No data</div>;
  }

  return (
    <div className="card p-4 h-full">
      <h3 className="font-semibold text-lg mb-4">Budget vs Charges</h3>
      <div className="w-full h-72"> {/* Slightly increased height */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius="70%" // Reduced from 80% to avoid clipping
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
