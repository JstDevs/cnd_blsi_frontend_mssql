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
  Building2,
} from "lucide-react";

const FundTransfer = () => {
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewTransferForm, setShowNewTransferForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const transferRequests = [
    {
      id: "1",
      transferNumber: "FT-2025-001",
      sourceFund: "General Fund",
      targetFund: "Capital Fund",
      sourceSubFund: "Operations Sub-Fund",
      targetSubFund: "Infrastructure Projects",
      transferAmount: 250000,
      purpose: "Infrastructure Development",
      remarks:
        "Transfer for urgent infrastructure projects as approved by the board",
      sourceBalance: 1800000,
      targetBalance: 2800000,
      status: "pending",
      requestDate: "2025-01-15",
      requestedBy: "John Smith",
      transferType: "subfund-to-subfund",
      priority: "high",
    },
    {
      id: "2",
      transferNumber: "FT-2025-002",
      sourceFund: "Special Fund",
      targetFund: "General Fund",
      transferAmount: 100000,
      purpose: "Emergency Operations",
      remarks: "Emergency transfer to cover unexpected operational costs",
      sourceBalance: 1850000,
      targetBalance: 5250000,
      status: "approved",
      requestDate: "2025-01-12",
      requestedBy: "Maria Garcia",
      approvedBy: "David Wilson",
      approvedDate: "2025-01-13",
      transferType: "fund-to-fund",
      priority: "urgent",
    },
    {
      id: "3",
      transferNumber: "FT-2025-003",
      sourceFund: "Trust Fund",
      targetFund: "Special Fund",
      sourceSubFund: undefined,
      targetSubFund: "Training Programs",
      transferAmount: 75000,
      purpose: "Staff Development",
      remarks: "Quarterly transfer for staff training and development programs",
      sourceBalance: 3200000,
      targetBalance: 650000,
      status: "completed",
      requestDate: "2025-01-10",
      requestedBy: "Sarah Johnson",
      approvedBy: "David Wilson",
      approvedDate: "2025-01-11",
      transferType: "fund-to-subfund",
      priority: "medium",
    },
    {
      id: "4",
      transferNumber: "FT-2025-004",
      sourceFund: "Capital Fund",
      targetFund: "General Fund",
      sourceSubFund: "Equipment Acquisition",
      targetSubFund: "Personnel Sub-Fund",
      transferAmount: 150000,
      purpose: "Personnel Costs",
      remarks: "Transfer to cover additional personnel costs for Q1",
      sourceBalance: 1200000,
      targetBalance: 2450000,
      status: "rejected",
      requestDate: "2025-01-08",
      requestedBy: "Michael Brown",
      transferType: "subfund-to-subfund",
      priority: "low",
    },
  ];

  const statuses = ["all", "pending", "approved", "rejected", "completed"];
  const transferTypes = [
    "all",
    "fund-to-fund",
    "subfund-to-subfund",
    "fund-to-subfund",
  ];
  const priorities = ["all", "low", "medium", "high", "urgent"];

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <Check className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "completed":
        return <FileText className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const filteredTransfers = transferRequests.filter((transfer) => {
    const matchesSearch =
      transfer.transferNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transfer.sourceFund.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.targetFund.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || transfer.status === filterStatus;
    const matchesType =
      filterType === "all" || transfer.transferType === filterType;
    const matchesPriority =
      filterPriority === "all" || transfer.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const currentTransfer = selectedTransfer || transferRequests[0];

  const handleApprove = () => {
    if (selectedTransfer) {
      console.log("Approving fund transfer:", selectedTransfer.transferNumber);
    }
  };

  const handleReject = () => {
    if (selectedTransfer) {
      console.log("Rejecting fund transfer:", selectedTransfer.transferNumber);
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
            Fund Transfer Management
          </h2>
          <p className="text-gray-600">
            Manage transfers between funds and sub-funds
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
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {
                  transferRequests.filter((t) => t.status === "completed")
                    .length
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentTransfer
                    ? `Transfer ${currentTransfer.transferNumber}`
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
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                        currentTransfer.priority
                      )}`}
                    >
                      {currentTransfer.priority.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      Requested by {currentTransfer.requestedBy} on{" "}
                      {currentTransfer.requestDate}
                    </span>
                  </div>
                )}
              </div>

              {currentTransfer && (
                <div className="flex items-center space-x-2">
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

          {/* Transfer Form */}
          {currentTransfer && (
            <div className="p-6">
              {/* Transfer Overview */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Fund Transfer Overview
                </h4>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-2">
                      <Building2 className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-sm text-gray-600">From</p>
                    <p className="text-lg font-semibold text-red-600">
                      {currentTransfer.sourceFund}
                    </p>
                    {currentTransfer.sourceSubFund && (
                      <p className="text-sm text-gray-500">
                        {currentTransfer.sourceSubFund}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Balance: ${currentTransfer.sourceBalance.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <ArrowRightLeft className="w-8 h-8 text-blue-600" />
                    <div className="ml-4 text-center">
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${currentTransfer.transferAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {currentTransfer.transferType.replace("-", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
                      <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">To</p>
                    <p className="text-lg font-semibold text-green-600">
                      {currentTransfer.targetFund}
                    </p>
                    {currentTransfer.targetSubFund && (
                      <p className="text-sm text-gray-500">
                        {currentTransfer.targetSubFund}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Balance: ${currentTransfer.targetBalance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transfer Details */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">
                  Transfer Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source Fund
                    </label>
                    <input
                      type="text"
                      value={currentTransfer.sourceFund}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Fund
                    </label>
                    <input
                      type="text"
                      value={currentTransfer.targetFund}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source Sub-Fund
                    </label>
                    <input
                      type="text"
                      value={currentTransfer.sourceSubFund || "N/A"}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Sub-Fund
                    </label>
                    <input
                      type="text"
                      value={currentTransfer.targetSubFund || "N/A"}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transfer Amount
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
                      Priority
                    </label>
                    <select
                      value={currentTransfer.priority}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose
                    </label>
                    <input
                      type="text"
                      value={currentTransfer.purpose}
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
                    Financial Impact Analysis
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">
                        Source Fund Impact
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
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  (currentTransfer.transferAmount /
                                    currentTransfer.sourceBalance) *
                                    100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {(
                              (currentTransfer.transferAmount /
                                currentTransfer.sourceBalance) *
                              100
                            ).toFixed(1)}
                            % of current balance
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">
                        Target Fund Impact
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
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  (currentTransfer.transferAmount /
                                    currentTransfer.targetBalance) *
                                    100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {(
                              (currentTransfer.transferAmount /
                                currentTransfer.targetBalance) *
                              100
                            ).toFixed(1)}
                            % increase
                          </p>
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

              <div className="space-y-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "all"
                        ? "All Status"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {transferTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "all"
                        ? "All Types"
                        : type
                            .replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority === "all"
                        ? "All Priorities"
                        : priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
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
                      {transfer.transferNumber}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                          transfer.priority
                        )}`}
                      >
                        {transfer.priority}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          transfer.status
                        )}`}
                      >
                        {transfer.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span className="truncate">{transfer.sourceFund}</span>
                    <ArrowRightLeft className="w-3 h-3 mx-2 text-gray-400" />
                    <span className="truncate">{transfer.targetFund}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2 truncate">
                    {transfer.purpose}
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

export default FundTransfer;
