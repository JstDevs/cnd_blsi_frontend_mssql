import React, { useState } from "react";
import {
  Calendar,
  Download,
  Eye,
  Filter,
  Search,
  FileText,
  Printer,
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
} from "lucide-react";

const BudgetReport = () => {
  const [startDate, setStartDate] = useState("2025-05-30");
  const [endDate, setEndDate] = useState("2025-05-30");
  const [selectedFund, setSelectedFund] = useState("General Fund");
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("feb aug");
  const [selectedDepartment, setSelectedDepartment] = useState("Accounting");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("summary");

  const budgetData = [
    {
      id: "1",
      name: "Petty Cash",
      accountCode: "101010020",
      appropriated: 40000.0,
      adjustments: 0,
      allotments: 0,
      obligations: 0,
      appropriationBalance: 40000.0,
      allotmentBalance: 0,
      fund: "General Fund",
      department: "Accounting",
      fiscalYear: "feb aug",
      utilizationRate: 0,
    },
    {
      id: "2",
      name: "Petty Cash",
      accountCode: "101010020",
      appropriated: 1000000.0,
      adjustments: 0,
      allotments: 0,
      obligations: 0,
      appropriationBalance: 1000000.0,
      allotmentBalance: 0,
      fund: "General Fund",
      department: "Accounting",
      fiscalYear: "feb aug",
      utilizationRate: 0,
    },
    {
      id: "3",
      name: "Treasury Bills",
      accountCode: "102010030",
      appropriated: 2820001.0,
      adjustments: 0,
      allotments: 0,
      obligations: 0,
      appropriationBalance: 2820001.0,
      allotmentBalance: 0,
      fund: "General Fund",
      department: "Accounting",
      fiscalYear: "feb aug",
      utilizationRate: 0,
    },
    {
      id: "4",
      name: "Investments in Bonds - Long Term",
      accountCode: "102030020",
      appropriated: 60000.0,
      adjustments: 0,
      allotments: 0,
      obligations: 0,
      appropriationBalance: 60000.0,
      allotmentBalance: 0,
      fund: "General Fund",
      department: "Accounting",
      fiscalYear: "feb aug",
      utilizationRate: 0,
    },
    {
      id: "5",
      name: "Guaranty Deposits",
      accountCode: "102050020",
      appropriated: 40000.0,
      adjustments: 0,
      allotments: 0,
      obligations: 0,
      appropriationBalance: 40000.0,
      allotmentBalance: 0,
      fund: "General Fund",
      department: "Accounting",
      fiscalYear: "feb aug",
      utilizationRate: 0,
    },
    {
      id: "6",
      name: "Real Property Tax Receivable",
      accountCode: "103010020",
      appropriated: 30000.0,
      adjustments: 0,
      allotments: 0,
      obligations: 0,
      appropriationBalance: 30000.0,
      allotmentBalance: 0,
      fund: "General Fund",
      department: "Accounting",
      fiscalYear: "feb aug",
      utilizationRate: 0,
    },
    {
      id: "7",
      name: "Notes Receivable",
      accountCode: "103010040",
      appropriated: 480000.0,
      adjustments: 0,
      allotments: 0,
      obligations: 0,
      appropriationBalance: 480000.0,
      allotmentBalance: 0,
      fund: "General Fund",
      department: "Accounting",
      fiscalYear: "feb aug",
      utilizationRate: 0,
    },
    {
      id: "8",
      name: "Investment Property, Land",
      accountCode: "106010010",
      appropriated: 50.0,
      adjustments: 0,
      allotments: 0,
      obligations: 0,
      appropriationBalance: 50.0,
      allotmentBalance: 0,
      fund: "General Fund",
      department: "Accounting",
      fiscalYear: "feb aug",
      utilizationRate: 0,
    },
    {
      id: "9",
      name: "Due to LGUs",
      accountCode: "202010070",
      appropriated: 0.0,
      adjustments: 0,
      allotments: 0,
      obligations: 0,
      appropriationBalance: 0.0,
      allotmentBalance: 0,
      fund: "General Fund",
      department: "Accounting",
      fiscalYear: "feb aug",
      utilizationRate: 0,
    },
  ];

  const funds = ["General Fund", "Special Fund", "Trust Fund", "Capital Fund"];
  const fiscalYears = ["feb aug", "January to December", "April to March"];
  const departments = [
    "Accounting",
    "Administration",
    "Finance",
    "IT Department",
    "Human Resources",
  ];

  const filteredData = budgetData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.accountCode.includes(searchTerm);
    const matchesFund =
      selectedFund === "All Funds" || item.fund === selectedFund;
    const matchesFiscalYear =
      selectedFiscalYear === "All Years" ||
      item.fiscalYear === selectedFiscalYear;
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      item.department === selectedDepartment;

    return (
      matchesSearch && matchesFund && matchesFiscalYear && matchesDepartment
    );
  });

  const totals = filteredData.reduce(
    (acc, item) => ({
      appropriated: acc.appropriated + item.appropriated,
      adjustments: acc.adjustments + item.adjustments,
      allotments: acc.allotments + item.allotments,
      obligations: acc.obligations + item.obligations,
      appropriationBalance:
        acc.appropriationBalance + item.appropriationBalance,
      allotmentBalance: acc.allotmentBalance + item.allotmentBalance,
    }),
    {
      appropriated: 0,
      adjustments: 0,
      allotments: 0,
      obligations: 0,
      appropriationBalance: 0,
      allotmentBalance: 0,
    }
  );

  const handleExportToExcel = () => {
    console.log("Exporting to Excel...");
  };

  const handleViewReport = () => {
    console.log("Viewing report...");
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Budget Reports</h2>
          <p className="text-gray-600">
            Comprehensive budget analysis and reporting dashboard
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("summary")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === "summary"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setViewMode("detailed")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === "detailed"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Detailed
            </button>
          </div>
          <button
            onClick={handlePrintReport}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <button
            onClick={handleExportToExcel}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Appropriated
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${totals.appropriated.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {filteredData.length} accounts
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Allotments
              </p>
              <p className="text-2xl font-bold text-blue-600">
                ${totals.allotments.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {totals.appropriated > 0
                  ? ((totals.allotments / totals.appropriated) * 100).toFixed(1)
                  : 0}
                % allocated
              </p>
            </div>
            <PieChart className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Obligations
              </p>
              <p className="text-2xl font-bold text-purple-600">
                ${totals.obligations.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {totals.allotments > 0
                  ? ((totals.obligations / totals.allotments) * 100).toFixed(1)
                  : 0}
                % utilized
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Available Balance
              </p>
              <p className="text-2xl font-bold text-green-600">
                ${totals.appropriationBalance.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">Remaining funds</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fund
            </label>
            <select
              value={selectedFund}
              onChange={(e) => setSelectedFund(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {funds.map((fund) => (
                <option key={fund} value={fund}>
                  {fund}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fiscal Year
            </label>
            <select
              value={selectedFiscalYear}
              onChange={(e) => setSelectedFiscalYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {fiscalYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleViewReport}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Generate
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by account name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Report Content */}
      {viewMode === "summary" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Distribution Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Budget Distribution by Account
            </h3>
            <div className="space-y-4">
              {filteredData.slice(0, 6).map((item) => {
                const percentage =
                  totals.appropriated > 0
                    ? (item.appropriated / totals.appropriated) * 100
                    : 0;

                return (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {item.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      ${item.appropriated.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Accounts Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Budget Accounts
            </h3>
            <div className="space-y-4">
              {filteredData
                .sort((a, b) => b.appropriated - a.appropriated)
                .slice(0, 6)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.accountCode}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ${item.appropriated.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Balance: ${item.appropriationBalance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Account Code
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Appropriated
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Adjustments
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Allotments
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Obligations
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Appropriation Balance
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Allotment Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.accountCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                      {item.appropriated.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {item.adjustments.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {item.allotments.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {item.obligations.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                      {item.appropriationBalance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {item.allotmentBalance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}

                {/* Totals Row */}
                <tr className="bg-green-100 border-t-2 border-green-700 font-semibold">
                  <td
                    className="px-4 py-3 text-sm text-gray-900 font-bold"
                    colSpan={2}
                  >
                    TOTAL ({filteredData.length} items)
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-bold">
                    {totals.appropriated.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-bold">
                    {totals.adjustments.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-bold">
                    {totals.allotments.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-bold">
                    {totals.obligations.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-bold">
                    {totals.appropriationBalance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-bold">
                    {totals.allotmentBalance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>
              Report for {selectedDepartment} - {selectedFiscalYear}
            </span>
            <span>
              Period: {startDate} to {endDate}
            </span>
            <span>Fund: {selectedFund}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Showing {filteredData.length} accounts</span>
            <span>Generated on {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetReport;
