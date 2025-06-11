import React, { useState } from "react";

const StatementComparison = () => {
  const [fiscalYear, setFiscalYear] = useState("Test");

  return (
    <div className=" bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Summary of Comparison of Budget and Actual Amount
        </h1>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 items-stretch sm:items-end">
          {/* Fiscal Year Dropdown */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Fiscal Year
            </label>
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2"
            >
              <option>Test</option>
              <option>2025</option>
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full sm:w-auto">
              View
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full sm:w-auto">
              Generate Journal
            </button>
            <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 w-full sm:w-auto">
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
