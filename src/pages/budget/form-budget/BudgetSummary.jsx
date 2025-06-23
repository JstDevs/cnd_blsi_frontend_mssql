import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Eye,
  Edit2,
  FileText,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
} from "lucide-react";

const BudgetSummary = () => {
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFiscalYear, setFilterFiscalYear] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");

  const budgets = [
    {
      id: "1",
      name: "Transportation System Fees",
      department: "Municipal Transportation Management",
      fiscalYear: "January to December",
      account: "Transportation System Fees",
      fund: "General Fund",
      project: "No Project",
      originalAppropriation: 1000000,
      adjustments: -500,
      adjustedAppropriation: 999500,
      releasedAllotted: 100000,
      charges: 0,
      appropriationBalance: 599500,
      status: "active",
      monthlyAllocations: [
        85000, 82000, 88000, 75000, 90000, 85000, 78000, 82000, 88000, 92000,
        85000, 89000,
      ],
      utilizationRate: 40.0,
      lastUpdated: "2025-01-15",
    },
    {
      id: "2",
      name: "Electricity Expenses",
      department: "General Fund",
      fiscalYear: "January to December",
      account: "Utilities and Communications",
      fund: "General Fund",
      project: "No Project",
      originalAppropriation: 1000000,
      adjustments: 0,
      adjustedAppropriation: 1000000,
      releasedAllotted: 100000,
      charges: 0,
      appropriationBalance: 900000,
      status: "active",
      monthlyAllocations: [
        95000, 88000, 92000, 85000, 98000, 102000, 105000, 108000, 95000, 88000,
        82000, 85000,
      ],
      utilizationRate: 10.0,
      lastUpdated: "2025-01-14",
    },
    {
      id: "3",
      name: "Petty Cash",
      department: "Accounting",
      fiscalYear: "Feb to Aug",
      account: "Petty Cash Fund",
      fund: "General Fund",
      project: "No Project",
      originalAppropriation: 1050000,
      adjustments: 0,
      adjustedAppropriation: 1050000,
      releasedAllotted: 0,
      charges: 0,
      appropriationBalance: 1050000,
      status: "active",
      monthlyAllocations: [
        0, 150000, 150000, 150000, 150000, 150000, 150000, 150000, 0, 0, 0, 0,
      ],
      utilizationRate: 0.0,
      lastUpdated: "2025-01-13",
    },
    {
      id: "4",
      name: "Office Supplies",
      department: "Administration",
      fiscalYear: "January to December",
      account: "Office Supplies",
      fund: "General Fund",
      project: "Office Operations",
      originalAppropriation: 500000,
      adjustments: 25000,
      adjustedAppropriation: 525000,
      releasedAllotted: 150000,
      charges: 75000,
      appropriationBalance: 300000,
      status: "active",
      monthlyAllocations: [
        45000, 42000, 48000, 40000, 50000, 45000, 38000, 42000, 48000, 52000,
        45000, 49000,
      ],
      utilizationRate: 42.9,
      lastUpdated: "2025-01-12",
    },
  ];

  const departments = [
    "all",
    "Municipal Transportation Management",
    "General Fund",
    "Accounting",
    "Administration",
  ];
  const fiscalYears = ["all", "January to December", "Feb to Aug"];
  const statuses = ["all", "active", "inactive", "suspended"];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUtilizationColor = (rate) => {
    if (rate >= 80) return "text-red-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  const filteredBudgets = budgets.filter((budget) => {
    const matchesSearch =
      budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFiscalYear =
      filterFiscalYear === "all" || budget.fiscalYear === filterFiscalYear;
    const matchesDepartment =
      filterDepartment === "all" || budget.department === filterDepartment;
    const matchesStatus =
      filterStatus === "all" || budget.status === filterStatus;

    return (
      matchesSearch && matchesFiscalYear && matchesDepartment && matchesStatus
    );
  });

  const sortedBudgets = [...filteredBudgets].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(sortedBudgets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBudgets = sortedBudgets.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const currentBudget = selectedBudget || budgets[0];
  const spentAndAllotted =
    currentBudget.releasedAllotted + currentBudget.charges;

  const totalSummary = {
    totalBudgets: budgets.length,
    totalAppropriation: budgets.reduce(
      (sum, b) => sum + b.adjustedAppropriation,
      0
    ),
    totalUtilized: budgets.reduce(
      (sum, b) => sum + b.releasedAllotted + b.charges,
      0
    ),
    totalBalance: budgets.reduce((sum, b) => sum + b.appropriationBalance, 0),
    avgUtilization:
      budgets.reduce((sum, b) => sum + b.utilizationRate, 0) / budgets.length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Primary Actions */}
      {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"> */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-4 gap-x-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Budget Summary
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Comprehensive budget overview and management dashboard
          </p>
        </div>
        {/* <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"> */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-y-3 sm:gap-x-3 w-full sm:w-auto">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Table
            </button>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">New Budget</span>
              <span className="sm:hidden">New</span>
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budgets</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {totalSummary.totalBudgets}
              </p>
              <p className="text-xs sm:text-sm text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {
                  filteredBudgets.filter((b) => b.status === "active").length
                }{" "}
                active
              </p>
            </div>
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Appropriation
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                ${totalSummary.totalAppropriation.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Across all budgets
              </p>
            </div>
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Utilized
              </p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                ${totalSummary.totalUtilized.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {(
                  (totalSummary.totalUtilized /
                    totalSummary.totalAppropriation) *
                  100
                ).toFixed(1)}
                % of total
              </p>
            </div>
            <PieChart className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Available Balance
              </p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                ${totalSummary.totalBalance.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Avg. utilization: {totalSummary.avgUtilization.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Featured Budget Overview */}
      {currentBudget && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Featured Budget: {currentBudget.name}
              </h3>
              <p className="text-sm text-gray-600">
                {currentBudget.department} • {currentBudget.fiscalYear}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  currentBudget.status
                )}`}
              >
                {currentBudget.status}
              </span>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Financial Overview */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                Financial Overview
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600">Original</p>
                  <p className="text-sm sm:text-lg font-semibold text-gray-900">
                    ${currentBudget.originalAppropriation.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Adjustments
                  </p>
                  <p
                    className={`text-sm sm:text-lg font-semibold ${
                      currentBudget.adjustments >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {currentBudget.adjustments >= 0 ? "+" : ""}$
                    {currentBudget.adjustments.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600">Utilized</p>
                  <p className="text-sm sm:text-lg font-semibold text-blue-600">
                    ${spentAndAllotted.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600">Balance</p>
                  <p className="text-sm sm:text-lg font-semibold text-green-600">
                    ${currentBudget.appropriationBalance.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Utilization Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Budget Utilization
                  </span>
                  <span
                    className={`text-sm font-medium ${getUtilizationColor(
                      currentBudget.utilizationRate
                    )}`}
                  >
                    {currentBudget.utilizationRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      currentBudget.utilizationRate >= 80
                        ? "bg-red-500"
                        : currentBudget.utilizationRate >= 60
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(currentBudget.utilizationRate, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Monthly Allocation Chart */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                Monthly Allocation Trend
              </h4>
              <div className="flex items-end justify-between h-24 sm:h-32 space-x-1">
                {currentBudget.monthlyAllocations.map((amount, index) => {
                  const maxAmount = Math.max(
                    ...currentBudget.monthlyAllocations
                  );
                  const height = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;

                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center group"
                    >
                      <div
                        className="w-full bg-blue-600 rounded-t hover:bg-blue-700 transition-colors cursor-pointer relative"
                        style={{
                          height: `${height}%`,
                          minHeight: amount > 0 ? "4px" : "0px",
                        }}
                        title={`${months[index]}: $${amount.toLocaleString()}`}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          ${amount.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {months[index]}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-center text-xs sm:text-sm text-gray-600 mt-2">
                Annual Total: $
                {currentBudget.monthlyAllocations
                  .reduce((sum, amount) => sum + amount, 0)
                  .toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, department, project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <select
              value={filterFiscalYear}
              onChange={(e) => setFilterFiscalYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {fiscalYears.map((year) => (
                <option key={year} value={year}>
                  {year === "all" ? "All Fiscal Years" : year}
                </option>
              ))}
            </select>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "All Statuses"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Budget List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {paginatedBudgets.map((budget) => (
            <div
              key={budget.id}
              onClick={() => setSelectedBudget(budget)}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 cursor-pointer hover:shadow-md transition-all ${
                selectedBudget?.id === budget.id
                  ? "ring-2 ring-blue-500 border-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
                    {budget.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {budget.department}
                  </p>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2 ${getStatusColor(
                    budget.status
                  )}`}
                >
                  {budget.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Appropriation</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${budget.adjustedAppropriation.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Balance</span>
                  <span className="text-sm font-medium text-green-600">
                    ${budget.appropriationBalance.toLocaleString()}
                  </span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Utilization</span>
                    <span
                      className={`text-sm font-medium ${getUtilizationColor(
                        budget.utilizationRate
                      )}`}
                    >
                      {budget.utilizationRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        budget.utilizationRate >= 80
                          ? "bg-red-500"
                          : budget.utilizationRate >= 60
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(budget.utilizationRate, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Updated {budget.lastUpdated}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-800 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Budget Name
                      {sortColumn === "name" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden sm:table-cell"
                    onClick={() => handleSort("department")}
                  >
                    <div className="flex items-center">
                      Department
                      {sortColumn === "department" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("adjustedAppropriation")}
                  >
                    <div className="flex items-center justify-end">
                      Appropriation
                      {sortColumn === "adjustedAppropriation" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden md:table-cell"
                    onClick={() => handleSort("appropriationBalance")}
                  >
                    <div className="flex items-center justify-end">
                      Balance
                      {sortColumn === "appropriationBalance" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("utilizationRate")}
                  >
                    <div className="flex items-center justify-center">
                      Utilization
                      {sortColumn === "utilizationRate" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden lg:table-cell"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center justify-center">
                      Status
                      {sortColumn === "status" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedBudgets.map((budget) => (
                  <tr
                    key={budget.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedBudget?.id === budget.id
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                    }`}
                    onClick={() => setSelectedBudget(budget)}
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {budget.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate sm:hidden">
                        {budget.department}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {budget.account}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 hidden sm:table-cell">
                      <div className="truncate">
                        {budget.department.length > 25
                          ? `${budget.department.substring(0, 25)}...`
                          : budget.department}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right text-sm font-medium text-gray-900">
                      ${budget.adjustedAppropriation.toLocaleString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right text-sm font-medium text-green-600 hidden md:table-cell">
                      ${budget.appropriationBalance.toLocaleString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-full max-w-20">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span
                              className={getUtilizationColor(
                                budget.utilizationRate
                              )}
                            >
                              {budget.utilizationRate.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                budget.utilizationRate >= 80
                                  ? "bg-red-500"
                                  : budget.utilizationRate >= 60
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{
                                width: `${Math.min(
                                  budget.utilizationRate,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center hidden lg:table-cell">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          budget.status
                        )}`}
                      >
                        {budget.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, sortedBudgets.length)} of{" "}
            {sortedBudgets.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 border rounded-lg text-sm ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span className="text-gray-500">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-3 py-1 border rounded-lg text-sm ${
                    currentPage === totalPages
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetSummary;
