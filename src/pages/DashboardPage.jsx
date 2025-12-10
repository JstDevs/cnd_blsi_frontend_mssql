import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  DocumentCheckIcon,
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import RevenueChart from '../components/dashboard/RevenueChart';
import BudgetStatusChart from '../components/dashboard/BudgetStatusChart';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  Cog6ToothIcon,
  BanknotesIcon,
  FolderOpenIcon,
  ClipboardDocumentIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const sections = [
  {
    name: 'Settings',
    icon: <Cog6ToothIcon className="h-6 w-6" />,
    path: '/settings/departments',
  },
  {
    name: 'Disbursement',
    icon: <BanknotesIcon className="h-6 w-6" />,
    path: '/disbursement/obligation-requests',
  },
  {
    name: 'Collections',
    icon: <FolderOpenIcon className="h-6 w-6" />,
    path: '/collections/community-tax',
  },
  {
    name: 'Budget',
    icon: <ClipboardDocumentIcon className="h-6 w-6" />,
    path: '/budget/details',
  },
  {
    name: 'Applications',
    icon: <ClipboardDocumentIcon className="h-6 w-6" />,
    path: '/applications/business-permits',
  },
  {
    name: 'Reports',
    icon: <ChartBarIcon className="h-6 w-6" />,
    path: '/reports/general-ledger',
  },
  {
    name: 'BIR Reports',
    icon: <DocumentTextIcon className="h-6 w-6" />,
    path: '/reports/bir',
  },
];
// Dashboard card component
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  trendLabel,
  loading,
}) => (
  <div className="bg-white overflow-hidden shadow-sm rounded-lg transition duration-200 hover:shadow-md">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0 rounded-md bg-primary-100 p-3">
          <Icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-neutral-500 truncate">
              {title}
            </dt>
            <dd>
              {loading ? (
                <div className="h-7 bg-neutral-200 animate-pulse rounded mt-1 w-24"></div>
              ) : (
                <div className="flex items-baseline">
                  <div className="text-2xl font-semibold text-neutral-900">
                    {value}
                  </div>
                  {trendValue && (
                    <div
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        trend === 'up' ? 'text-success-600' : 'text-error-600'
                      }`}
                    >
                      {trend === 'up' ? (
                        <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-success-500" />
                      ) : (
                        <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-error-500" />
                      )}
                      <span className="sr-only">
                        {trend === 'up' ? 'Increased' : 'Decreased'} by
                      </span>
                      {trendValue}
                    </div>
                  )}
                </div>
              )}
            </dd>
            {trendLabel && (
              <dd className="mt-1 text-xs text-neutral-500">{trendLabel}</dd>
            )}
          </dl>
        </div>
      </div>
    </div>
  </div>
);

// Recent activity item component
const ActivityItem = ({ title, description, date, status, icon: Icon }) => (
  <div className="flex py-3 px-4 hover:bg-neutral-50 transition-colors rounded-md">
    <div
      className={`
      flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-3
      ${
        status === 'pending'
          ? 'bg-warning-100 text-warning-600'
          : status === 'approved'
          ? 'bg-success-100 text-success-600'
          : status === 'rejected'
          ? 'bg-error-100 text-error-600'
          : 'bg-neutral-100 text-neutral-600'
      }
    `}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-sm font-medium text-neutral-900">{title}</div>
      <p className="text-sm text-neutral-500">{description}</p>
      <div className="mt-1 text-xs text-neutral-400 flex items-center">
        <ClockIcon className="h-3.5 w-3.5 mr-1" />
        {date}
      </div>
    </div>
  </div>
);

function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      title: 'New Obligation Request',
      description: 'ORS-2024-01-0023 needs your approval',
      date: 'Just now',
      status: 'pending',
      icon: DocumentCheckIcon,
    },
    {
      id: 2,
      title: 'Disbursement Voucher Approved',
      description: 'DV-2024-01-0015 was approved by Mayor Santos',
      date: '2 hours ago',
      status: 'approved',
      icon: CurrencyDollarIcon,
    },
    {
      id: 3,
      title: 'Business Permit Application',
      description: 'New application from ABC Company',
      date: 'Yesterday',
      status: 'pending',
      icon: DocumentCheckIcon,
    },
    {
      id: 4,
      title: 'Collection Report Generated',
      description: 'January 2024 collection report is ready for review',
      date: '2 days ago',
      status: 'completed',
      icon: ReceiptPercentIcon,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Welcome back
          {/* , {user?.first_name} {user?.middle_name} {user?.last_name}! */}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sections.map((section) => (
          <Link
            to={section.path}
            key={section.name}
            className="bg-white hover:bg-blue-50 border border-gray-200 rounded-xl shadow-md p-5 flex items-center gap-4 transition-transform transform hover:scale-105"
          >
            <div className="text-blue-600 bg-blue-100 p-2 rounded-full">
              {section.icon}
            </div>
            <span className="text-lg font-medium text-gray-800">
              {section.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
