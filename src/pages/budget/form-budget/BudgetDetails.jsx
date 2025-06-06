import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
  Building2,
  FileText,
  Save,
  X,
  Check,
} from "lucide-react";

const BudgetDetails = () => {
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterSubDepartment, setFilterSubDepartment] = useState("all");
  const [filterAccount, setFilterAccount] = useState("all");
  const [filterFund, setFilterFund] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const budgetItems = [
    {
      id: "1",
      code: "CASH-001",
      name: "Cash - Local Treasury",
      fiscalYear: "January to December",
      department: "Office of the Mayor",
      subDepartment: "Network Operations",
      chartOfAccounts: "Cash - Local Treasury",
      fund: "General Fund",
      project: "No Project",
      appropriation: 0,
      appropriationBalance: 0,
      totalAmount: 10000,
      allotment: 0,
      allotmentBalance: 0,
      charges: 0,
      preEncumbrance: 0,
      encumbrance: 0,
      monthlyAllocations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      status: "active",
      lastModified: "2024-01-15",
    },
    {
      id: "2",
      code: "INV-001",
      name: "Investments",
      fiscalYear: "Feb Aug",
      department: "Accounting",
      subDepartment: "Payroll",
      chartOfAccounts: "Investments",
      fund: "General Fund",
      project: "No Project",
      appropriation: 80000000,
      appropriationBalance: 80000000,
      totalAmount: 80000000,
      allotment: 0,
      allotmentBalance: 0,
      charges: 0,
      preEncumbrance: 0,
      encumbrance: 0,
      monthlyAllocations: [
        0, 6666666.67, 6666666.67, 6666666.67, 6666666.67, 6666666.67,
        6666666.67, 0, 0, 0, 0, 0,
      ],
      status: "active",
      lastModified: "2024-01-14",
    },
    {
      id: "3",
      code: "ALL-001",
      name: "Allowance for Bad Debts",
      fiscalYear: "Fiscal Year",
      department: "Office of the Mayor",
      subDepartment: "Network Operations",
      chartOfAccounts: "Allowance for Bad Debts",
      fund: "Trust Fund",
      project: "No Project",
      appropriation: 124141240,
      appropriationBalance: 123021240,
      totalAmount: 123141240,
      allotment: 120000000,
      allotmentBalance: 120000000,
      charges: 0,
      preEncumbrance: 0,
      encumbrance: 0,
      monthlyAllocations: [
        10345103.33, 10345103.33, 10345103.33, 10345103.33, 10345103.33,
        10345103.33, 10345103.33, 10345103.33, 10345103.33, 10345103.33,
        10345103.33, 10345103.33,
      ],
      status: "active",
      lastModified: "2024-01-13",
    },
    {
      id: "4",
      code: "PREP-001",
      name: "Prepaid Registration",
      fiscalYear: "January to December",
      department: "Treasury",
      subDepartment: "No Subdepartments",
      chartOfAccounts: "Prepaid Registration",
      fund: "General Fund",
      project: "No Project",
      appropriation: 10000000,
      appropriationBalance: 0,
      totalAmount: 10000000,
      allotment: 10000000,
      allotmentBalance: 9999999.8,
      charges: 9.8,
      preEncumbrance: 0,
      encumbrance: 0.2,
      monthlyAllocations: [
        833333.33, 833333.33, 833333.33, 833333.33, 833333.33, 833333.33,
        833333.33, 833333.33, 833333.33, 833333.33, 833333.33, 833333.33,
      ],
      status: "active",
      lastModified: "2024-01-12",
    },
    {
      id: "5",
      code: "WEL-001",
      name: "Welfare Goods",
      fiscalYear: "January to December",
      department: "Municipal Social Welfare",
      subDepartment: "No Subdepartments",
      chartOfAccounts: "Welfare Goods",
      fund: "General Fund",
      project: "No Project",
      appropriation: 1000000,
      appropriationBalance: 720000,
      totalAmount: 970000,
      allotment: 250000,
      allotmentBalance: 250000,
      charges: 0,
      preEncumbrance: 0,
      encumbrance: 0,
      monthlyAllocations: [
        83333.33, 83333.33, 83333.33, 83333.33, 83333.33, 83333.33, 83333.33,
        83333.33, 83333.33, 83333.33, 83333.33, 83333.33,
      ],
      status: "active",
      lastModified: "2024-01-11",
    },
    {
      id: "6",
      code: "OFF-001",
      name: "Office Equipment",
      fiscalYear: "January to December",
      department: "Municipal Engineering",
      subDepartment: "Network Operations",
      chartOfAccounts: "Office Equipment",
      fund: "General Fund",
      project: "No Project",
      appropriation: 1000000,
      appropriationBalance: 750000,
      totalAmount: 1000000,
      allotment: 250000,
      allotmentBalance: 250000,
      charges: 0,
      preEncumbrance: 0,
      encumbrance: 0,
      monthlyAllocations: [
        83333.33, 83333.33, 83333.33, 83333.33, 83333.33, 83333.33, 83333.33,
        83333.33, 83333.33, 83333.33, 83333.33, 83333.33,
      ],
      status: "active",
      lastModified: "2024-01-10",
    },
    {
      id: "7",
      code: "OFC-001",
      name: "Office Equipment",
      fiscalYear: "January to December",
      department: "Accounting",
      subDepartment: "No Subdepartments",
      chartOfAccounts: "Office Equipment",
      fund: "General Fund",
      project: "No Project",
      appropriation: 100000,
      appropriationBalance: 0,
      totalAmount: 100000,
      allotment: 100000,
      allotmentBalance: 100000,
      charges: 967172.07,
      preEncumbrance: 1000,
      encumbrance: 73926.93,
      monthlyAllocations: [
        8333.33, 8333.33, 8333.33, 8333.33, 8333.33, 8333.33, 8333.33, 8333.33,
        8333.33, 8333.33, 8333.33, 8333.33,
      ],
      status: "active",
      lastModified: "2024-01-09",
    },
    {
      id: "8",
      code: "DUE-001",
      name: "Due to LGUs",
      fiscalYear: "Feb Aug",
      department: "Accounting",
      subDepartment: "Payroll",
      chartOfAccounts: "Due to LGUs",
      fund: "General Fund",
      project: "No Project",
      appropriation: 0,
      appropriationBalance: 0,
      totalAmount: 0,
      allotment: 0,
      allotmentBalance: 0,
      charges: 0,
      preEncumbrance: 0,
      encumbrance: 0,
      monthlyAllocations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      status: "inactive",
      lastModified: "2024-01-08",
    },
  ];

  const departments = [
    "all",
    "Office of the Mayor",
    "Accounting",
    "Treasury",
    "Municipal Social Welfare",
    "Municipal Engineering",
  ];
  const subDepartments = [
    "all",
    "Network Operations",
    "Payroll",
    "No Subdepartments",
  ];
  const accounts = [
    "all",
    "Cash - Local Treasury",
    "Investments",
    "Allowance for Bad Debts",
    "Prepaid Registration",
    "Welfare Goods",
    "Office Equipment",
    "Due to LGUs",
  ];
  const funds = [
    "all",
    "General Fund",
    "Trust Fund",
    "Special Fund",
    "Capital Fund",
  ];
  const fiscalYears = ["all", "January to December", "Feb Aug", "Fiscal Year"];

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

  const getUtilizationPercentage = (allocated, utilized) => {
    return allocated > 0 ? ((utilized / allocated) * 100).toFixed(1) : "0";
  };

  const filteredItems = budgetItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" || item.department === filterDepartment;
    const matchesSubDepartment =
      filterSubDepartment === "all" ||
      item.subDepartment === filterSubDepartment;
    const matchesAccount =
      filterAccount === "all" || item.chartOfAccounts === filterAccount;
    const matchesFund = filterFund === "all" || item.fund === filterFund;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesSubDepartment &&
      matchesAccount &&
      matchesFund
    );
  });

  const currentBudget = selectedBudget || budgetItems[0];

  const totalSummary = {
    totalBudgets: budgetItems.length,
    totalAppropriation: budgetItems.reduce(
      (sum, item) => sum + item.appropriation,
      0
    ),
    totalUtilized: budgetItems.reduce((sum, item) => sum + item.charges, 0),
    totalBalance: budgetItems.reduce(
      (sum, item) => sum + item.appropriationBalance,
      0
    ),
    totalAllotment: budgetItems.reduce((sum, item) => sum + item.allotment, 0),
  };

  const handleSave = () => {
    if (isEditing) {
      setIsEditing(false);
      console.log("Saving changes...");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Budget Details Management
          </h2>
          <p className="text-gray-600">
            Comprehensive budget planning and allocation tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
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
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Budget
          </button>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budgets</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalSummary.totalBudgets}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {filteredItems.filter((b) => b.status === "active").length}{" "}
                active
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Appropriation
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalSummary.totalAppropriation.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">Across all budgets</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Allotment
              </p>
              <p className="text-2xl font-bold text-blue-600">
                ${totalSummary.totalAllotment.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {totalSummary.totalAppropriation > 0
                  ? (
                      (totalSummary.totalAllotment /
                        totalSummary.totalAppropriation) *
                      100
                    ).toFixed(1)
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
              <p className="text-sm font-medium text-gray-600">Total Charges</p>
              <p className="text-2xl font-bold text-purple-600">
                ${totalSummary.totalUtilized.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {totalSummary.totalAllotment > 0
                  ? (
                      (totalSummary.totalUtilized /
                        totalSummary.totalAllotment) *
                      100
                    ).toFixed(1)
                  : 0}
                % utilized
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Available Balance
              </p>
              <p className="text-2xl font-bold text-green-600">
                ${totalSummary.totalBalance.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">Remaining funds</p>
            </div>
            <Building2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Featured Budget Overview */}
      {currentBudget && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Featured Budget: {currentBudget.name}
              </h3>
              <p className="text-gray-600">
                {currentBudget.department} • {currentBudget.fiscalYear}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  currentBudget.status
                )}`}
              >
                {currentBudget.status}
              </span>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Budget Information */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                Budget Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Name
                  </label>
                  <input
                    type="text"
                    value={currentBudget.name}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiscal Year
                  </label>
                  <select
                    value={currentBudget.fiscalYear}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    {fiscalYears
                      .filter((y) => y !== "all")
                      .map((year) => (
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
                    value={currentBudget.department}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    {departments
                      .filter((d) => d !== "all")
                      .map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Department
                  </label>
                  <select
                    value={currentBudget.subDepartment}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    {subDepartments
                      .filter((s) => s !== "all")
                      .map((subDept) => (
                        <option key={subDept} value={subDept}>
                          {subDept}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chart of Accounts
                  </label>
                  <select
                    value={currentBudget.chartOfAccounts}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    {accounts
                      .filter((a) => a !== "all")
                      .map((account) => (
                        <option key={account} value={account}>
                          {account}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fund
                  </label>
                  <select
                    value={currentBudget.fund}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    {funds
                      .filter((f) => f !== "all")
                      .map((fund) => (
                        <option key={fund} value={fund}>
                          {fund}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project
                  </label>
                  <input
                    type="text"
                    value={currentBudget.project}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">
                  Financial Summary
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Appropriation</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${currentBudget.appropriation.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Amount</p>
                    <p className="text-lg font-semibold text-blue-600">
                      ${currentBudget.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Allotment</p>
                    <p className="text-lg font-semibold text-green-600">
                      ${currentBudget.allotment.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Charges</p>
                    <p className="text-lg font-semibold text-purple-600">
                      ${currentBudget.charges.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Allocation Chart */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                Monthly Allocation Distribution
              </h4>
              <div className="flex items-end justify-between h-32 space-x-1 mb-4">
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
              <div className="text-center text-sm text-gray-600">
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, code, department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </option>
              ))}
            </select>
            <select
              value={filterSubDepartment}
              onChange={(e) => setFilterSubDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subDepartments.map((subDept) => (
                <option key={subDept} value={subDept}>
                  {subDept === "all" ? "All Sub Departments" : subDept}
                </option>
              ))}
            </select>
            <select
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {accounts.map((account) => (
                <option key={account} value={account}>
                  {account === "all" ? "All Accounts" : account}
                </option>
              ))}
            </select>
            <select
              value={filterFund}
              onChange={(e) => setFilterFund(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {funds.map((fund) => (
                <option key={fund} value={fund}>
                  {fund === "all" ? "All Funds" : fund}
                </option>
              ))}
            </select>
            <div className="flex items-center">
              <Filter className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">
                {filteredItems.length} results
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Items List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedBudget(item)}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all ${
                selectedBudget?.id === item.id
                  ? "ring-2 ring-blue-500 border-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">{item.code}</p>
                  <p className="text-sm text-gray-500">{item.department}</p>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Appropriation</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${item.appropriation.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Allotment</span>
                  <span className="text-sm font-medium text-blue-600">
                    ${item.allotment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Charges</span>
                  <span className="text-sm font-medium text-purple-600">
                    ${item.charges.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Balance</span>
                  <span className="text-sm font-medium text-green-600">
                    ${item.appropriationBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Updated {item.lastModified}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appropriation
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allotment
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Charges
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedBudget?.id === item.id
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                    }`}
                    onClick={() => setSelectedBudget(item)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">{item.code}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {item.department}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.subDepartment}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      ${item.appropriation.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-blue-600">
                      ${item.allotment.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-purple-600">
                      ${item.charges.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                      ${item.appropriationBalance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800 transition-colors">
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
};

export default BudgetDetails;
