import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  DollarSign,
  PieChart,
  FileText,
  Calculator,
  ArrowRightLeft,
  BarChart3,
  Building2,
  Layers,
} from "lucide-react";

const Layout = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "budget-details", label: "Budget Details", icon: DollarSign },
    { id: "budget-allotment", label: "Budget Allotment", icon: PieChart },
    { id: "budget-summary", label: "Budget Summary", icon: Layers },
    { id: "budget-supplemental", label: "Budget Supplemental", icon: FileText },
    { id: "budget-transfer", label: "Budget Transfer", icon: ArrowRightLeft },
    { id: "funds", label: "Funds & Sub-Funds", icon: Building2 },
    { id: "fund-transfer", label: "Fund Transfer", icon: ArrowRightLeft },
    { id: "reports", label: "Budget Reports", icon: BarChart3 },
    { id: "trial-balance", label: "Trial Balance", icon: Calculator },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-800">
          <h1 className="text-lg lg:text-xl font-bold truncate">
            Budget System
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-4 pb-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-blue-800 transition-colors text-sm lg:text-base ${
                  currentPage === item.id
                    ? "bg-blue-800 border-r-4 border-blue-400"
                    : ""
                }`}
              >
                <Icon className="w-4 h-4 lg:w-5 lg:h-5 mr-3 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900 mr-3 p-1"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                {menuItems.find((item) => item.id === currentPage)?.label ||
                  "Dashboard"}
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-3 sm:p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
