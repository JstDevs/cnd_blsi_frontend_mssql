import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Save,
  X,
  FileText,
  Check,
  XCircle,
  Calendar,
  DollarSign,
} from "lucide-react";

const BudgetSupplemental = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");

  const supplementalRequests = [
    {
      id: "1",
      invoiceNumber: "BS-26-2025",
      budgetName: "Work/Zoo Animals",
      fiscalYear: "January to December",
      department: "Treasury",
      subDepartment: "No Subdepartments",
      chartOfAccounts: "Work/Zoo Animals",
      fund: "General Fund",
      project: "No Project",
      supplemental: 1000000.0,
      remarks: "Additional funding required for animal care and maintenance",
      appropriation: 21111200.0,
      balance: 1000000.0,
      releasedAllotments: 21111200.0,
      finalBalance: 2000010.0,
      status: "pending",
      invoiceDate: "2/26/2025",
      totalAmount: 1000000.0,
      requestedBy: "John Smith",
      requestDate: "2025-02-20",
    },
    {
      id: "2",
      invoiceNumber: "BS-25-2025",
      budgetName: "Cash - Local Treasury",
      fiscalYear: "January to December",
      department: "Treasury",
      subDepartment: "No Subdepartments",
      chartOfAccounts: "Cash - Local Treasury",
      fund: "General Fund",
      project: "No Project",
      supplemental: 10000.0,
      remarks: "Emergency cash flow supplemental request",
      appropriation: 5000000.0,
      balance: 4500000.0,
      releasedAllotments: 500000.0,
      finalBalance: 4510000.0,
      status: "approved",
      invoiceDate: "2/23/2025",
      totalAmount: 10000.0,
      requestedBy: "Maria Garcia",
      requestDate: "2025-02-18",
    },
    {
      id: "3",
      invoiceNumber: "BS-24-2025",
      budgetName: "Affiliation Fees",
      fiscalYear: "January to December",
      department: "Administration",
      subDepartment: "General Services",
      chartOfAccounts: "Affiliation Fees",
      fund: "General Fund",
      project: "No Project",
      supplemental: 10000.0,
      remarks: "Additional professional membership fees",
      appropriation: 150000.0,
      balance: 120000.0,
      releasedAllotments: 30000.0,
      finalBalance: 130000.0,
      status: "posted",
      invoiceDate: "2/20/2025",
      totalAmount: 10000.0,
      requestedBy: "David Wilson",
      requestDate: "2025-02-15",
    },
    {
      id: "4",
      invoiceNumber: "BS-23-2025",
      budgetName: "Office Equipment",
      fiscalYear: "January to December",
      department: "IT Department",
      subDepartment: "Infrastructure",
      chartOfAccounts: "Office Equipment",
      fund: "Capital Fund",
      project: "Office Modernization",
      supplemental: 1000000.0,
      remarks: "Urgent equipment replacement and upgrades",
      appropriation: 3000000.0,
      balance: 2500000.0,
      releasedAllotments: 500000.0,
      finalBalance: 3500000.0,
      status: "rejected",
      invoiceDate: "2/20/2025",
      totalAmount: 1000000.0,
      requestedBy: "Sarah Johnson",
      requestDate: "2025-02-12",
    },
  ];

  const departments = [
    "all",
    "Treasury",
    "Administration",
    "IT Department",
    "Finance",
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

  const filteredRequests = supplementalRequests.filter((request) => {
    const matchesSearch =
      request.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.budgetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;
    const matchesDepartment =
      filterDepartment === "all" || request.department === filterDepartment;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const currentRequest = selectedRequest || supplementalRequests[0];

  const handleApprove = () => {
    if (selectedRequest) {
      // Handle approval logic
      console.log("Approving request:", selectedRequest.invoiceNumber);
    }
  };

  const handleReject = () => {
    if (selectedRequest) {
      // Handle rejection logic
      console.log("Rejecting request:", selectedRequest.invoiceNumber);
    }
  };

  const handleSave = () => {
    if (isEditing) {
      setIsEditing(false);
      // Handle save logic
      console.log("Saving changes...");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowNewRequestForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Budget Supplemental Requests
          </h2>
          <p className="text-gray-600">
            Manage and approve supplemental budget requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewRequestForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Requests
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {supplementalRequests.length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Approval
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {
                  supplementalRequests.filter((r) => r.status === "pending")
                    .length
                }
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
                  supplementalRequests.filter((r) => r.status === "approved")
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
                {supplementalRequests
                  .reduce((sum, r) => sum + r.supplemental, 0)
                  .toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Request Details Panel */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Request Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentRequest
                    ? `Request ${currentRequest.invoiceNumber}`
                    : "Select a Request"}
                </h3>
                {currentRequest && (
                  <div className="flex items-center mt-2 space-x-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        currentRequest.status
                      )}`}
                    >
                      {getStatusIcon(currentRequest.status)}
                      <span className="ml-1 capitalize">
                        {currentRequest.status}
                      </span>
                    </span>
                    <span className="text-sm text-gray-500">
                      Requested by {currentRequest.requestedBy} on{" "}
                      {currentRequest.requestDate}
                    </span>
                  </div>
                )}
              </div>

              {currentRequest && (
                <div className="flex items-center space-x-2">
                  {currentRequest.status === "pending" && (
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

          {/* Request Form */}
          {currentRequest && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Name
                  </label>
                  <input
                    type="text"
                    value={currentRequest.budgetName}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supplemental Amount
                  </label>
                  <input
                    type="number"
                    value={currentRequest.supplemental}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={currentRequest.department}
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
                    value={currentRequest.fund}
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
                    value={currentRequest.chartOfAccounts}
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
                    value={currentRequest.project}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={currentRequest.remarks}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Financial Summary */}
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Financial Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Current Appropriation
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${currentRequest.appropriation.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Balance</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${currentRequest.balance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Supplemental Request
                    </p>
                    <p className="text-lg font-semibold text-blue-600">
                      ${currentRequest.supplemental.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">New Balance</p>
                    <p className="text-lg font-semibold text-green-600">
                      ${currentRequest.finalBalance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Requests List Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Search and Filters */}
          <div className="border-b border-gray-200 p-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
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

          {/* Requests List */}
          <div className="max-h-96 overflow-y-auto">
            <div className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedRequest?.id === request.id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {request.invoiceNumber}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {request.budgetName}
                  </p>
                  <p className="text-sm text-gray-500">{request.department}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium text-green-600">
                      ${request.supplemental.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {request.invoiceDate}
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

export default BudgetSupplemental;
