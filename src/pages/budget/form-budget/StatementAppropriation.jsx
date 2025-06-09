import React, { useState } from "react";

const StatementAppropriation = () => {
  const [startDate, setStartDate] = useState("2025-06-01");
  const [endDate, setEndDate] = useState("2025-06-09");
  const [fund, setFund] = useState("Trust Fund");
  const [fiscalYear, setFiscalYear] = useState("Test");
  const [department, setDepartment] = useState(
    "Municipal Social Welfare and Development"
  );

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Statement of Appropriations, Allotment, Obligations and Balances
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Fund
            </label>
            <select
              value={fund}
              onChange={(e) => setFund(e.target.value)}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
            >
              <option>Trust Fund</option>
              <option>General Fund</option>
              <option>Special Fund</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Fiscal Year
            </label>
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
            >
              <option>Test</option>
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
            >
              <option>Municipal Social Welfare and Development</option>
              <option>Engineering Department</option>
              <option>Health Services</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            View
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Generate SAAOB
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            View SAO
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            Generate SAO
          </button>
          <button className="ml-auto bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800">
            Export to Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Fund</th>
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Month End</th>
                <th className="px-4 py-2">Account Code</th>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Appropriation</th>
                <th className="px-4 py-2">Allotment</th>
                <th className="px-4 py-2">Obligation</th>
                <th className="px-4 py-2">Unobligated Appropriation</th>
                <th className="px-4 py-2">Unobligated Allotment</th>
                <th className="px-4 py-2">Municipality</th>
                <th className="px-4 py-2">Province</th>
                <th className="px-4 py-2">Requested By</th>
                <th className="px-4 py-2">Position</th>
              </tr>
            </thead>
            <tbody>
              {/* Render rows here dynamically */}
              <tr className="bg-white">
                <td className="px-4 py-2" colSpan={16}>
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

export default StatementAppropriation;
