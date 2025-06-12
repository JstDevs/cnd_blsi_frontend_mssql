import React, { useState } from "react";
import {
  Plus,
  Building2,
  ArrowUpDown,
  Eye,
  Edit2,
  Trash2,
  PieChart,
  Search,
  Filter,
  Save,
  X,
  Check,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const FundsManagement = () => {
  const [selectedFund, setSelectedFund] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("funds");

  const funds = [
    {
      id: "1",
      code: "100",
      name: "General Fund",
      description:
        "The general fund for all basic operations and administrative expenses",
      amount: 50100000050.0,
      type: "general",
      balance: 5250000,
      allocated: 4800000,
      utilized: 3200000,
      subFunds: [],
      status: "active",
      createdDate: "2024-01-01",
    },
    {
      id: "2",
      code: "200",
      name: "Special Education Fund",
      description:
        "The special education fund for educational programs and initiatives",
      amount: 200000.0,
      type: "special",
      balance: 1850000,
      allocated: 1600000,
      utilized: 980000,
      subFunds: [],
      status: "active",
      createdDate: "2024-01-02",
    },
    {
      id: "3",
      code: "300",
      name: "Trust Fund",
      description:
        "The trust fund for long-term investments and special projects",
      amount: 199950.0,
      type: "trust",
      balance: 3200000,
      allocated: 2800000,
      utilized: 1750000,
      subFunds: [],
      status: "active",
      createdDate: "2024-01-03",
    },
  ];

  const subFunds = [
    {
      id: "1",
      code: "20%",
      name: "20% Fund",
      parentFundId: "1",
      parentFundName: "General Fund",
      description: "The twenty percent fund for special allocations",
      amount: 12000.0,
      balance: 650000,
      allocated: 550000,
      utilized: 320000,
      status: "active",
      createdDate: "2024-01-15",
    },
    {
      id: "2",
      code: "GF",
      name: "General Fund",
      parentFundId: "1",
      parentFundName: "General Fund",
      description: "The main general fund subdivision",
      amount: 20000.0,
      balance: 1200000,
      allocated: 1100000,
      utilized: 650000,
      status: "active",
      createdDate: "2024-01-16",
    },
    {
      id: "3",
      code: "SEF",
      name: "Special Education Fund",
      parentFundId: "2",
      parentFundName: "Special Education Fund",
      description: "The main special education fund subdivision",
      amount: 35000.0,
      balance: 800000,
      allocated: 750000,
      utilized: 450000,
      status: "active",
      createdDate: "2024-01-17",
    },
    {
      id: "4",
      code: "TF",
      name: "Trust Fund",
      parentFundId: "3",
      parentFundName: "Trust Fund",
      description: "The main trust fund subdivision",
      amount: 25000.0,
      balance: 900000,
      allocated: 850000,
      utilized: 500000,
      status: "active",
      createdDate: "2024-01-18",
    },
  ];

  const fundTypes = ["all", "general", "special", "trust", "capital"];
  const statuses = ["all", "active", "inactive"];

  const getFundTypeColor = (type) => {
    switch (type) {
      case "general":
        return "bg-blue-100 text-blue-800";
      case "special":
        return "bg-green-100 text-green-800";
      case "trust":
        return "bg-purple-100 text-purple-800";
      case "capital":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUtilizationPercentage = (allocated, utilized) => {
    return allocated > 0 ? ((utilized / allocated) * 100).toFixed(1) : "0";
  };

  const filteredFunds = funds.filter((fund) => {
    const matchesSearch =
      fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || fund.type === filterType;
    const matchesStatus =
      filterStatus === "all" || fund.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredSubFunds = subFunds.filter((subFund) => {
    const matchesSearch =
      subFund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subFund.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subFund.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subFund.parentFundName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || subFund.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const currentFund = selectedFund || funds[0];

  const totalSummary = {
    totalFunds: funds.length,
    totalSubFunds: subFunds.length,
    totalAmount: funds.reduce((sum, fund) => sum + fund.amount, 0),
    totalBalance: funds.reduce((sum, fund) => sum + fund.balance, 0),
    totalAllocated: funds.reduce((sum, fund) => sum + fund.allocated, 0),
    totalUtilized: funds.reduce((sum, fund) => sum + fund.utilized, 0),
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
            Funds & Sub-Funds Management
          </h2>
          <p className="text-gray-600">
            Comprehensive fund hierarchy and allocation management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("funds")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeTab === "funds"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Funds
            </button>
            <button
              onClick={() => setActiveTab("subfunds")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeTab === "subfunds"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Sub-Funds
            </button>
          </div>
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
            New {activeTab === "funds" ? "Fund" : "Sub-Fund"}
          </button>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Funds</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalSummary.totalFunds}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {totalSummary.totalSubFunds} sub-funds
              </p>
            </div>
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">
                ${totalSummary.totalAmount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">Across all funds</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Allocated
              </p>
              <p className="text-2xl font-bold text-blue-600">
                ${totalSummary.totalAllocated.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {totalSummary.totalAmount > 0
                  ? (
                      (totalSummary.totalAllocated / totalSummary.totalAmount) *
                      100
                    ).toFixed(1)
                  : 0}
                % of total
              </p>
            </div>
            <PieChart className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Utilized
              </p>
              <p className="text-2xl font-bold text-purple-600">
                ${totalSummary.totalUtilized.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {totalSummary.totalAllocated > 0
                  ? (
                      (totalSummary.totalUtilized /
                        totalSummary.totalAllocated) *
                      100
                    ).toFixed(1)
                  : 0}
                % utilized
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Featured Fund/Sub-Fund Overview */}
      {activeTab === "funds" && currentFund && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Featured Fund: {currentFund.name}
              </h3>
              <p className="text-gray-600">
                {currentFund.code} •{" "}
                {currentFund.type.charAt(0).toUpperCase() +
                  currentFund.type.slice(1)}{" "}
                Fund
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getFundTypeColor(
                  currentFund.type
                )}`}
              >
                {currentFund.type}
              </span>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  currentFund.status
                )}`}
              >
                {currentFund.status}
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
            {/* Fund Information */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                Fund Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code
                  </label>
                  <input
                    type="text"
                    value={currentFund.code}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={currentFund.amount}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={currentFund.name}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={currentFund.description}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                Financial Summary
              </h4>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Total Amount:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ${currentFund.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Balance:</span>
                      <span className="text-sm font-medium text-green-600">
                        ${currentFund.balance.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Allocated:</span>
                      <span className="text-sm font-medium text-blue-600">
                        ${currentFund.allocated.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-sm font-medium text-gray-700">
                        Utilized:
                      </span>
                      <span className="text-sm font-bold text-purple-600">
                        ${currentFund.utilized.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Utilization Rate
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Progress:</span>
                      <span className="text-sm font-medium text-blue-600">
                        {getUtilizationPercentage(
                          currentFund.allocated,
                          currentFund.utilized
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${getUtilizationPercentage(
                            currentFund.allocated,
                            currentFund.utilized
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
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
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activeTab === "funds" && (
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fundTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all"
                      ? "All Types"
                      : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            )}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "All Statuses"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <div className="flex items-center">
              <Filter className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">
                {activeTab === "funds"
                  ? filteredFunds.length
                  : filteredSubFunds.length}{" "}
                results
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content List */}
      {activeTab === "funds" ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFunds.map((fund) => (
              <div
                key={fund.id}
                onClick={() => setSelectedFund(fund)}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all ${
                  selectedFund?.id === fund.id
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {fund.name}
                    </h3>
                    <p className="text-sm text-gray-600">{fund.code}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {fund.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getFundTypeColor(
                        fund.type
                      )}`}
                    >
                      {fund.type}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        fund.status
                      )}`}
                    >
                      {fund.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${fund.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Balance</span>
                    <span className="text-sm font-medium text-green-600">
                      ${fund.balance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Utilized</span>
                    <span className="text-sm font-medium text-purple-600">
                      ${fund.utilized.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Created {fund.createdDate}
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
                      Fund Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilized
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
                  {filteredFunds.map((fund) => (
                    <tr
                      key={fund.id}
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedFund?.id === fund.id
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      }`}
                      onClick={() => setSelectedFund(fund)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {fund.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {fund.code}
                          </div>
                          <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                            {fund.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getFundTypeColor(
                            fund.type
                          )}`}
                        >
                          {fund.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        ${fund.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                        ${fund.balance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-purple-600">
                        ${fund.utilized.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            fund.status
                          )}`}
                        >
                          {fund.status}
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
        )
      ) : // Sub-Funds Content
      viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSubFunds.map((subFund) => (
            <div
              key={subFund.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {subFund.name}
                  </h3>
                  <p className="text-sm text-gray-600">{subFund.code}</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Parent: {subFund.parentFundName}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {subFund.description}
                  </p>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    subFund.status
                  )}`}
                >
                  {subFund.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${subFund.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Balance</span>
                  <span className="text-sm font-medium text-green-600">
                    ${subFund.balance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Utilized</span>
                  <span className="text-sm font-medium text-purple-600">
                    ${subFund.utilized.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Created {subFund.createdDate}
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
                    Sub-Fund Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent Fund
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilized
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
                {filteredSubFunds.map((subFund) => (
                  <tr
                    key={subFund.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {subFund.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {subFund.code}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                          {subFund.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-blue-600 font-medium">
                        {subFund.parentFundName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      ${subFund.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                      ${subFund.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-purple-600">
                      ${subFund.utilized.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          subFund.status
                        )}`}
                      >
                        {subFund.status}
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

export default FundsManagement;
