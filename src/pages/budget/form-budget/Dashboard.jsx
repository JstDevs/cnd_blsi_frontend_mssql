import React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PieChart,
  BarChart3,
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Budget Allocation",
      value: "$12,450,000",
      change: "+5.2%",
      trend: "up",
      icon: DollarSign,
      color: "blue",
    },
    {
      title: "Total Utilization",
      value: "$8,750,000",
      change: "+12.3%",
      trend: "up",
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Available Balance",
      value: "$3,700,000",
      change: "-2.1%",
      trend: "down",
      icon: TrendingDown,
      color: "yellow",
    },
    {
      title: "Pending Approvals",
      value: "15",
      change: "+3",
      trend: "up",
      icon: AlertTriangle,
      color: "red",
    },
  ];

  const recentTransactions = [
    {
      id: "1",
      date: "2024-01-15",
      type: "Allotment",
      amount: 150000,
      description: "Q1 Operations Budget",
      status: "Approved",
    },
    {
      id: "2",
      date: "2024-01-14",
      type: "Transfer",
      amount: -25000,
      description: "IT Equipment Fund Transfer",
      status: "Pending",
    },
    {
      id: "3",
      date: "2024-01-13",
      type: "Supplemental",
      amount: 75000,
      description: "Emergency Repairs Budget",
      status: "Approved",
    },
    {
      id: "4",
      date: "2024-01-12",
      type: "Obligation",
      amount: -180000,
      description: "Office Lease Payment",
      status: "Approved",
    },
  ];

  const budgetCategories = [
    {
      name: "Personnel",
      allocated: 4500000,
      utilized: 3200000,
      percentage: 71,
    },
    {
      name: "Operations",
      allocated: 2800000,
      utilized: 1950000,
      percentage: 70,
    },
    {
      name: "Capital Outlay",
      allocated: 3200000,
      utilized: 2100000,
      percentage: 66,
    },
    {
      name: "Maintenance",
      allocated: 1950000,
      utilized: 1500000,
      percentage: 77,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    {stat.title}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <div
                    className={`flex items-center mt-2 text-xs sm:text-sm ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div
                  className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${
                    stat.color === "blue"
                      ? "bg-blue-100"
                      : stat.color === "green"
                      ? "bg-green-100"
                      : stat.color === "yellow"
                      ? "bg-yellow-100"
                      : "bg-red-100"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-6 sm:h-6 ${
                      stat.color === "blue"
                        ? "text-blue-600"
                        : stat.color === "green"
                        ? "text-green-600"
                        : stat.color === "yellow"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Budget Categories */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Budget Categories
            </h3>
            <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            {budgetCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {category.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Utilized: ${category.utilized.toLocaleString()}</span>
                  <span className="hidden sm:inline">
                    Allocated: ${category.allocated.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Recent Transactions
            </h3>
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {transaction.description}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {transaction.date} • {transaction.type}
                  </p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p
                    className={`font-semibold text-sm ${
                      transaction.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : ""}$
                    {Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      transaction.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
            <div className="text-center">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                Create Budget Allotment
              </p>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group">
            <div className="text-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                Fund Transfer
              </p>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group sm:col-span-2 lg:col-span-1">
            <div className="text-center">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                Generate Report
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
