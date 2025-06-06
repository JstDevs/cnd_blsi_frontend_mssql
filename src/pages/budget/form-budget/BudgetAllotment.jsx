import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Printer,
  Check,
  XCircle,
  Search,
  Filter,
  Calendar,
  DollarSign,
  FileText,
  Eye,
  Building2,
  TrendingUp,
} from "lucide-react";

const BudgetAllotment = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterSubDepartment, setFilterSubDepartment] = useState("all");
  const [filterAccount, setFilterAccount] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const allotmentOrders = [
    {
      id: "1",
      invoiceNumber: "ARO-75-2025",
      budgetName: "Affiliation Fees",
      fiscalYear: "January to December",
      department: "Administration",
      subDepartment: "General Services",
      chartOfAccounts: "Affiliation Fees",
      fund: "General Fund",
      project: "No Project",
      allotment: 100000,
      remarks: "Initial budget allocation for professional memberships",
      appropriation: 10011000000,
      releasedAllotments: 100000,
      balance: 10000900000,
      status: "rejected",
      invoiceDate: "2024-01-15",
      requestedBy: "John Smith",
      priority: "medium",
    },
    {
      id: "2",
      invoiceNumber: "ARO-76-2025",
      budgetName: "Petty Cash",
      fiscalYear: "January to December",
      department: "Finance",
      subDepartment: "Accounting",
      chartOfAccounts: "Petty Cash Fund",
      fund: "General Fund",
      project: "No Project",
      allotment: 50000,
      remarks: "Monthly petty cash replenishment",
      appropriation: 500000,
      releasedAllotments: 150000,
      balance: 350000,
      status: "posted",
      invoiceDate: "2024-01-14",
      requestedBy: "Maria Garcia",
      priority: "high",
    },
    {
      id: "3",
      invoiceNumber: "ARO-77-2025",
      budgetName: "Office Equipment",
      fiscalYear: "January to December",
      department: "IT Department",
      subDepartment: "Infrastructure",
      chartOfAccounts: "Office Equipment",
      fund: "Capital Fund",
      project: "Office Modernization",
      allotment: 250000,
      remarks: "New computers and peripherals for staff",
      appropriation: 2000000,
      releasedAllotments: 750000,
      balance: 1250000,
      status: "approved",
      invoiceDate: "2024-01-13",
      requestedBy: "David Wilson",
      priority: "urgent",
    },
    {
      id: "4",
      invoiceNumber: "ARO-78-2025",
      budgetName: "Training Programs",
      fiscalYear: "January to December",
      department: "Human Resources",
      subDepartment: "Development",
      chartOfAccounts: "Training and Development",
      fund: "Special Fund",
      project: "Skills Enhancement",
      allotment: 120000,
      remarks: "Professional development workshops",
      appropriation: 800000,
      releasedAllotments: 200000,
      balance: 600000,
      status: "pending",
      invoiceDate: "2024-01-12",
      requestedBy: "Sarah Johnson",
      priority: "low",
    },
  ];

  const departments = [
    "all",
    "Administration",
    "Finance",
    "IT Department",
    "Human Resources",
  ];
  const subDepartments = [
    "all",
    "General Services",
    "Accounting",
    "Infrastructure",
    "Development",
  ];
  const accounts = [
    "all",
    "Affiliation Fees",
    "Petty Cash Fund",
    "Office Equipment",
    "Training and Development",
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
      case "posted":
        return <FileText className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const filteredOrders = allotmentOrders.filter((order) => {
    const matchesSearch =
      order.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.budgetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" || order.department === filterDepartment;
    const matchesSubDepartment =
      filterSubDepartment === "all" ||
      order.subDepartment === filterSubDepartment;
    const matchesAccount =
      filterAccount === "all" || order.chartOfAccounts === filterAccount;
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesSubDepartment &&
      matchesAccount &&
      matchesStatus
    );
  });

  const currentOrder = selectedOrder || allotmentOrders[0];

  const totalSummary = {
    totalOrders: allotmentOrders.length,
    totalAllotment: allotmentOrders.reduce(
      (sum, order) => sum + order.allotment,
      0
    ),
    totalAppropriation: allotmentOrders.reduce(
      (sum, order) => sum + order.appropriation,
      0
    ),
    totalBalance: allotmentOrders.reduce(
      (sum, order) => sum + order.balance,
      0
    ),
    pendingCount: allotmentOrders.filter((o) => o.status === "pending").length,
  };

  const handleApprove = () => {
    if (selectedOrder) {
      console.log("Approving order:", selectedOrder.invoiceNumber);
    }
  };

  const handleReject = () => {
    if (selectedOrder) {
      console.log("Rejecting order:", selectedOrder.invoiceNumber);
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
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Allotment Release Orders
          </h2>
          <p className="text-gray-600">
            Manage and approve budget allotment release orders
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
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </button>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalSummary.totalOrders}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {
                  filteredOrders.filter(
                    (o) => o.status === "approved" || o.status === "posted"
                  ).length
                }{" "}
                approved
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
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
              <p className="text-sm text-gray-500 mt-1">Requested amount</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Appropriation
              </p>
              <p className="text-2xl font-bold text-green-600">
                ${totalSummary.totalAppropriation.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">Available budget</p>
            </div>
            <Building2 className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Remaining Balance
              </p>
              <p className="text-2xl font-bold text-purple-600">
                ${totalSummary.totalBalance.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">After allocation</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Approval
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {totalSummary.pendingCount}
              </p>
              <p className="text-sm text-gray-500 mt-1">Awaiting review</p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Featured Order Overview */}
      {currentOrder && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Featured Order: {currentOrder.invoiceNumber}
              </h3>
              <p className="text-gray-600">
                {currentOrder.budgetName} • {currentOrder.department}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  currentOrder.status
                )}`}
              >
                {getStatusIcon(currentOrder.status)}
                <span className="ml-1 capitalize">{currentOrder.status}</span>
              </span>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                  currentOrder.priority
                )}`}
              >
                {currentOrder.priority.toUpperCase()}
              </span>

              {currentOrder.status === "pending" && (
                <div className="flex items-center space-x-2">
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
                </div>
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
            {/* Order Information */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                Order Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Name
                  </label>
                  <input
                    type="text"
                    value={currentOrder.budgetName}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allotment Amount
                  </label>
                  <input
                    type="number"
                    value={currentOrder.allotment}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={currentOrder.department}
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
                    value={currentOrder.subDepartment}
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
                    value={currentOrder.chartOfAccounts}
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
                    value={currentOrder.fund}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    <option value="General Fund">General Fund</option>
                    <option value="Capital Fund">Capital Fund</option>
                    <option value="Special Fund">Special Fund</option>
                    <option value="Trust Fund">Trust Fund</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project
                  </label>
                  <input
                    type="text"
                    value={currentOrder.project}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={currentOrder.remarks}
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
                        Appropriation:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ${currentOrder.appropriation.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Released Allotments:
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        ${currentOrder.releasedAllotments.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Current Request:
                      </span>
                      <span className="text-sm font-medium text-purple-600">
                        ${currentOrder.allotment.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-sm font-medium text-gray-700">
                        Remaining Balance:
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        ${currentOrder.balance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Request Details
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Requested by:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {currentOrder.requestedBy}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {currentOrder.invoiceDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Priority:</span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                          currentOrder.priority
                        )}`}
                      >
                        {currentOrder.priority}
                      </span>
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
                placeholder="Search by invoice number, budget name, or requester..."
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
                {filteredOrders.length} results
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all ${
                selectedOrder?.id === order.id
                  ? "ring-2 ring-blue-500 border-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {order.invoiceNumber}
                  </h3>
                  <p className="text-sm text-gray-600">{order.budgetName}</p>
                  <p className="text-sm text-gray-500">{order.department}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                      order.priority
                    )}`}
                  >
                    {order.priority}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Allotment</span>
                  <span className="text-sm font-medium text-blue-600">
                    ${order.allotment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Appropriation</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${order.appropriation.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Balance</span>
                  <span className="text-sm font-medium text-green-600">
                    ${order.balance.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  By {order.requestedBy}
                </span>
                <span className="text-xs text-gray-500">
                  {order.invoiceDate}
                </span>
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
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allotment
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
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
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedOrder?.id === order.id
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.invoiceNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.budgetName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.department}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.subDepartment}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-blue-600">
                      ${order.allotment.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                      ${order.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                          order.priority
                        )}`}
                      >
                        {order.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
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
                        <button className="text-gray-600 hover:text-gray-800 transition-colors">
                          <Printer className="w-4 h-4" />
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

export default BudgetAllotment;
