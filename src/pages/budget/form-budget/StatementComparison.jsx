import React, { useState } from "react";

const StatementComparison = () => {
  const [fiscalYear, setFiscalYear] = useState("Test");

  return (
    <div className=" bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Summary of Comparison of Budget and Actual Amount
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Fiscal Year
            </label>
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm"
            >
              <option>Test</option>
              <option>2025</option>
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button className="bg-blue-600 mt-2 sm:mt-0 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              View
            </button>
            <button className="bg-green-600 mt-2 sm:mt-0 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Generate Journal
            </button>
            <button className="bg-gray-700 mt-2 sm:mt-0 text-white px-4 py-2 rounded-md hover:bg-gray-800">
              Export to Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white border rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Department</th>
                <th className="px-4 py-2">Budget</th>
                <th className="px-4 py-2">Actual</th>
                <th className="px-4 py-2">Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-t">
                <td className="px-4 py-2" colSpan={4}>
                  No data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatementComparison;
