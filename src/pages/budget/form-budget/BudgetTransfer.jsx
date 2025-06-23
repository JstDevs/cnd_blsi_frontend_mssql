import React, { useState } from "react";
import {
  Plus,
  Search,
  ArrowRightLeft,
  Check,
  XCircle,
  Calendar,
  DollarSign,
  FileText,
  Eye,
  Edit2,
  Save,
  X,
} from "lucide-react";

const BudgetTransfer = () => {
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewTransferForm, setShowNewTransferForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [activeTab, setActiveTab] = useState("source");

  const transferRequests = [
    {
      id: "1",
      invoiceNumber: "BT-18-2025",
      sourceBudget: "Travelling Expenses",
      targetBudget: "Office Supplies",
      fiscalYear: "January to December",
      department: "Budget",
      subDepartment: "No Subdepartment",
      chartOfAccounts: "Travelling Expenses - Local",
      fund: "General Fund",
      project: "No Project",
      transferAmount: 5000,
      remarks: "Transfer to cover additional travel requirements",
      sourceAppropriation: 205000,
      sourceBalance: 200000,
      targetAppropriation: 150000,
      targetBalance: 145000,
      status: "pending",
      requestDate: "2025-03-03",
      requestedBy: "John Smith",
    },
    {
      id: "2",
      invoiceNumber: "BT-17-2025",
      sourceBudget: "Electricity Expenses",
      targetBudget: "Maintenance Fund",
      fiscalYear: "January to December",
      department: "Administration",
      subDepartment: "Facilities",
      chartOfAccounts: "Utilities - Electricity",
      fund: "General Fund",
      project: "No Project",
      transferAmount: 15000,
      remarks: "Transfer excess budget to maintenance fund",
      sourceAppropriation: 500000,
      sourceBalance: 485000,
      targetAppropriation: 200000,
      targetBalance: 185000,
      status: "approved",
      requestDate: "2025-02-25",
      requestedBy: "Maria Garcia",
      approvedBy: "David Wilson",
      approvedDate: "2025-02-26",
    },
    {
      id: "3",
      invoiceNumber: "BT-16-2025",
      sourceBudget: "Electricity Expenses",
      targetBudget: "Office Equipment",
      fiscalYear: "January to December",
      department: "Administration",
      subDepartment: "Facilities",
      chartOfAccounts: "Utilities - Electricity",
      fund: "General Fund",
      project: "No Project",
      transferAmount: 8000,
      remarks: "Monthly budget reallocation",
      sourceAppropriation: 500000,
      sourceBalance: 492000,
      targetAppropriation: 300000,
      targetBalance: 292000,
      status: "posted",
      requestDate: "2025-02-23",
      requestedBy: "Sarah Johnson",
      approvedBy: "David Wilson",
      approvedDate: "2025-02-24",
    },
    {
      id: "4",
      invoiceNumber: "BT-15-2025",
      sourceBudget: "Allowance for Bad Debts",
      targetBudget: "Contingency Fund",
      fiscalYear: "January to December",
      department: "Finance",
      subDepartment: "Accounting",
      chartOfAccounts: "Allowance - Bad Debts",
      fund: "General Fund",
      project: "No Project",
      transferAmount: 12000,
      remarks: "Quarterly adjustment transfer",
      sourceAppropriation: 300000,
      sourceBalance: 288000,
      targetAppropriation: 100000,
      targetBalance: 88000,
      status: "rejected",
      requestDate: "2025-02-20",
      requestedBy: "Michael Brown",
    },
  ];

  const departments = [
    "all",
    "Budget",
    "Administration",
    "Finance",
    "IT Department",
  ];
  const statuses = ["all", "pending", "approved", "rejected", "posted"];

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "posted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <Check className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "posted":
        return <FileText className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const filteredTransfers = transferRequests.filter((transfer) => {
    const matchesSearch =
      transfer.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.sourceBudget.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.targetBudget.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || transfer.status === filterStatus;
    const matchesDepartment =
      filterDepartment === "all" || transfer.department === filterDepartment;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const currentTransfer = selectedTransfer || transferRequests[0];

  const handleApprove = () => {
    if (selectedTransfer) {
      console.log("Approving transfer:", selectedTransfer.invoiceNumber);
    }
  };

  const handleReject = () => {
    if (selectedTransfer) {
      console.log("Rejecting transfer:", selectedTransfer.invoiceNumber);
    }
  };

  const handleSave = () => {
    if (isEditing) {
      setIsEditing(false);
      console.log("Saving changes...");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowNewTransferForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Budget Transfer Requests
          </h2>
          <p className="text-gray-600">
            Manage budget transfers between accounts and departments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewTransferForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Transfer
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Transfers
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {transferRequests.length}
              </p>
            </div>
            <ArrowRightLeft className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Approval
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {transferRequests.filter((t) => t.status === "pending").length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {
                  transferRequests.filter(
                    (t) => t.status === "approved" || t.status === "posted"
                  ).length
                }
              </p>
            </div>
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-purple-600">
                $
                {transferRequests
                  .reduce((sum, t) => sum + t.transferAmount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Transfer Details Panel */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Transfer Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentTransfer
                    ? `Transfer ${currentTransfer.invoiceNumber}`
                    : "Select a Transfer"}
                </h3>
                {currentTransfer && (
                  <div className="flex items-center mt-2 space-x-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        currentTransfer.status
                      )}`}
                    >
                      {getStatusIcon(currentTransfer.status)}
                      <span className="ml-1 capitalize">
                        {currentTransfer.status}
                      </span>
                    </span>
                    <span className="text-sm text-gray-500">
                      Requested by {currentTransfer.requestedBy} on{" "}
                      {currentTransfer.requestDate}
                    </span>
                  </div>
                )}
              </div>

              {currentTransfer && (
                // <div className="flex items-center space-x-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-y-2 sm:space-x-2 w-full sm:w-auto">
                  {currentTransfer.status === "pending" && (
                    <>
                      <button
                        onClick={handleApprove}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={handleReject}
                        className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </>
                  )}

                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("source")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "source"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Source Account
              </button>
              <button
                onClick={() => setActiveTab("target")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "target"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Target Account
              </button>
            </div>
          </div>

          {/* Transfer Form */}
          {currentTransfer && (
            <div className="p-2 sm:p-6">
              {/* Transfer Overview */}
              <div className="bg-gray-50 rounded-lg p-0 sm:p-6 mb-6">
              {/* <div className="bg-gray-50 rounded-lg p-6 mb-6"> */}
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Transfer Overview
                </h4>
                <div className="flex items-center justify-between gap-1">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">From</p>
                    <p className="text-md sm:text-lg font-semibold text-red-600">
                      {currentTransfer.sourceBudget}
                    </p>
                    <p className="text-sm text-gray-500">
                      Balance: ${currentTransfer.sourceBalance.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <ArrowRightLeft className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                    <div className="ml-2 sm:ml-4 text-center">
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">
                        ${currentTransfer.transferAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">To</p>
                    <p className="text-md sm:text-lg font-semibold text-green-600">
                      {currentTransfer.targetBudget}
                    </p>
                    <p className="text-sm text-gray-500">
                      Balance: ${currentTransfer.targetBalance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">
                  {activeTab === "source"
                    ? "Source Account Details"
                    : "Target Account Details"}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Name
                    </label>
                    <input
                      type="text"
                      value={
                        activeTab === "source"
                          ? currentTransfer.sourceBudget
                          : currentTransfer.targetBudget
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {activeTab === "source"
                        ? "Transfer Amount"
                        : "Receive Amount"}
                    </label>
                    <input
                      type="number"
                      value={currentTransfer.transferAmount}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={currentTransfer.department}
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
                      Fund
                    </label>
                    <select
                      value={currentTransfer.fund}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      <option value="General Fund">General Fund</option>
                      <option value="Capital Fund">Capital Fund</option>
                      <option value="Special Fund">Special Fund</option>
                      <option value="Trust Fund">Trust Fund</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chart of Accounts
                    </label>
                    <input
                      type="text"
                      value={currentTransfer.chartOfAccounts}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project
                    </label>
                    <input
                      type="text"
                      value={currentTransfer.project}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remarks
                    </label>
                    <textarea
                      value={currentTransfer.remarks}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Financial Impact */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Financial Impact
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">
                        Source Account
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Current Balance:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            ${currentTransfer.sourceBalance.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Transfer Amount:
                          </span>
                          <span className="text-sm font-medium text-red-600">
                            -${currentTransfer.transferAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-sm font-medium text-gray-700">
                            New Balance:
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            $
                            {(
                              currentTransfer.sourceBalance -
                              currentTransfer.transferAmount
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">
                        Target Account
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Current Balance:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            ${currentTransfer.targetBalance.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Transfer Amount:
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            +${currentTransfer.transferAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-sm font-medium text-gray-700">
                            New Balance:
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            $
                            {(
                              currentTransfer.targetBalance +
                              currentTransfer.transferAmount
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transfers List Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Search and Filters */}
          <div className="border-b border-gray-200 p-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transfers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status === "all"
                          ? "All Status"
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
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
                </div>
              </div>
            </div>
          </div>

          {/* Transfers List */}
          <div className="max-h-96 overflow-y-auto">
            <div className="divide-y divide-gray-200">
              {filteredTransfers.map((transfer) => (
                <div
                  key={transfer.id}
                  onClick={() => setSelectedTransfer(transfer)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedTransfer?.id === transfer.id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {transfer.invoiceNumber}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        transfer.status
                      )}`}
                    >
                      {transfer.status}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span className="truncate">{transfer.sourceBudget}</span>
                    <ArrowRightLeft className="w-3 h-3 mx-2 text-gray-400" />
                    <span className="truncate">{transfer.targetBudget}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {transfer.department}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600">
                      ${transfer.transferAmount.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {transfer.requestDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTransfer;
