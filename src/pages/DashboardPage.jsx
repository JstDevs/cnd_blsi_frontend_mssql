import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckBadgeIcon,
  XCircleIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import {
  fetchCollectionTotals,
  fetchBudgetList,
  fetchDisbursementChart,
} from './userProfile/profileUtil';

// const sections = [
//   {
//     name: 'Settings',
//     icon: <Cog6ToothIcon className="h-6 w-6" />,
//     path: '/settings/departments',
//   },
//   {
//     name: 'Disbursement',
//     icon: <BanknotesIcon className="h-6 w-6" />,
//     path: '/disbursement/obligation-requests',
//   },
//   {
//     name: 'Collections',
//     icon: <FolderOpenIcon className="h-6 w-6" />,
//     path: '/collections/community-tax',
//   },
//   {
//     name: 'Budget',
//     icon: <ClipboardDocumentIcon className="h-6 w-6" />,
//     path: '/budget/details',
//   },
//   {
//     name: 'Applications',
//     icon: <ClipboardDocumentIcon className="h-6 w-6" />,
//     path: '/applications/business-permits',
//   },
//   {
//     name: 'Reports',
//     icon: <ChartBarIcon className="h-6 w-6" />,
//     path: '/reports/general-ledger',
//   },
//   {
//     name: 'BIR Reports',
//     icon: <DocumentTextIcon className="h-6 w-6" />,
//     path: '/reports/bir',
//   },
// ];
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

function DashboardPage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [revenueRange, setRevenueRange] = useState('month');
  const [revenueTotals, setRevenueTotals] = useState({
    general: 0,
    marriage: 0,
    burial: 0,
    cedula: 0,
  });
  const [budgetRemaining, setBudgetRemaining] = useState([]);
  const [disbursementStatus, setDisbursementStatus] = useState({
    approved: 0,
    rejected: 0,
    pending: 0,
  });
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthError('Please sign in to load dashboard data.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch in parallel to reduce load time
        const [revenueRes, budgetRes, disbursementRes] = await Promise.all([
          fetchCollectionTotals(revenueRange),
          fetchBudgetList(''),
          fetchDisbursementChart('month'),
        ]);

        // Revenue totals (per range)
        const totals = revenueRes?.data || {};
        setRevenueTotals({
          general: parseFloat(totals.General || 0),
          marriage: parseFloat(totals.Marriage || 0),
          burial: parseFloat(totals.Burial || 0),
          cedula: parseFloat(totals.Cedula || 0),
        });

        // Budget remaining per department
        const budgetList = budgetRes?.data || [];
        const remainingByDept = budgetList.map((item) => {
          const appropriation = parseFloat(item.Appropriation || 0);
          const supplemental = parseFloat(item.Supplemental || 0);
          const transfer = parseFloat(item.Transfer || 0);
          const charges = parseFloat(item.Charges || 0);
          const encumbrance = parseFloat(item.Encumbrance || 0);
          const preEncumbrance = parseFloat(item.PreEncumbrance || 0);
          const remaining =
            appropriation +
            supplemental +
            transfer -
            charges -
            encumbrance -
            preEncumbrance;
          return { id: item.ID, name: item.Name, remaining };
        });
        setBudgetRemaining(remainingByDept);

        // Disbursement approved vs rejected (uses existing chart endpoint)
        const disbursementData = Array.isArray(disbursementRes?.data)
          ? disbursementRes.data
          : [];
        const statusTotals = disbursementData.reduce(
          (acc, item) => {
            const name = (item.name || '').toLowerCase();
            const value = Number(item.value || 0);
            if (name.includes('approve')) acc.approved += value;
            else if (name.includes('reject')) acc.rejected += value;
            else acc.pending += value;
            return acc;
          },
          { approved: 0, rejected: 0, pending: 0 }
        );
        setDisbursementStatus(statusTotals);
        setAuthError('');
      } catch (error) {
        console.error(error);
        if (error?.response?.status === 401) {
          setAuthError('Session expired or unauthorized. Please sign in again.');
        } else {
          toast.error('Failed to load dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };

    // Only try fetching when authenticated; otherwise show message
    if (isAuthenticated) {
      fetchAll();
    } else {
      setLoading(false);
      setAuthError('Please sign in to load dashboard data.');
    }
  }, [revenueRange, isAuthenticated]);

  useEffect(() => {
    // Show welcome message only right after login (per session)
    const welcomeKey = user?.id || user?.ID || user?.UserID || 'default_user';
    const hasShown = sessionStorage.getItem(`welcome_seen_${welcomeKey}`);
    if (!hasShown && user && isAuthenticated) {
      setWelcomeVisible(true);
      sessionStorage.setItem(`welcome_seen_${welcomeKey}`, 'true');
      const timer = setTimeout(() => setWelcomeVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [user, isAuthenticated]);

  const totalRevenue =
    revenueTotals.general +
    revenueTotals.marriage +
    revenueTotals.burial +
    revenueTotals.cedula;

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(value || 0);
  const approvalTotal =
    disbursementStatus.approved + disbursementStatus.rejected;
  const approvalRate =
    approvalTotal > 0
      ? `${((disbursementStatus.approved / approvalTotal) * 100).toFixed(1)}% approved`
      : null;
  const rejectionRate =
    approvalTotal > 0
      ? `${((disbursementStatus.rejected / approvalTotal) * 100).toFixed(1)}% rejected`
      : null;

  return (
    <div>
      <div className="page-header">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Overview of revenue, budget utilization, and disbursement status for
          quick decision-making.
        </p>
      </div>
      {welcomeVisible && (
        <div className="mb-4 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-primary-800">
          Welcome back,{' '}
          {user?.first_name || user?.UserName || user?.username || 'User'}!
        </div>
      )}

      {authError && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          {authError}
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-neutral-500">Select revenue range</p>
            <select
              value={revenueRange}
              onChange={(e) => setRevenueRange(e.target.value)}
              className="mt-1 px-3 py-2 border border-neutral-200 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="day">Day</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
          <p className="text-xs text-neutral-400">
            Data sourced from collection totals and budget/disbursement
            dashboards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title={`Total Revenue (${revenueRange})`}
          value={loading ? '...' : formatCurrency(totalRevenue)}
          icon={CurrencyDollarIcon}
          loading={loading}
        />
        <StatCard
          title="Disbursements Approved"
          value={loading ? '...' : formatCurrency(disbursementStatus.approved)}
          icon={CheckBadgeIcon}
          trend="up"
          trendValue={approvalRate}
          loading={loading}
        />
        <StatCard
          title="Disbursements Rejected"
          value={loading ? '...' : formatCurrency(disbursementStatus.rejected)}
          icon={XCircleIcon}
          trend="down"
          trendValue={rejectionRate}
          loading={loading}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-neutral-900 mb-3">
            Revenue by Category
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'General Services', value: revenueTotals.general },
              { label: 'Marriage Services', value: revenueTotals.marriage },
              { label: 'Burial Services', value: revenueTotals.burial },
              { label: 'Cedula', value: revenueTotals.cedula },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-md border border-neutral-200 p-3 bg-neutral-50"
              >
                <p className="text-sm text-neutral-500">{item.label}</p>
                <p className="text-lg font-semibold text-neutral-900">
                  {loading ? '...' : formatCurrency(item.value)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-neutral-900 mb-3">
            Disbursement Status (Approved / Rejected)
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckBadgeIcon className="h-5 w-5 text-success-600" />
                <span className="text-sm text-neutral-700">Approved</span>
              </div>
              <span className="font-semibold text-neutral-900">
                {loading ? '...' : formatCurrency(disbursementStatus.approved)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircleIcon className="h-5 w-5 text-error-600" />
                <span className="text-sm text-neutral-700">Rejected</span>
              </div>
              <span className="font-semibold text-neutral-900">
                {loading ? '...' : formatCurrency(disbursementStatus.rejected)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white border border-neutral-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <BuildingOfficeIcon className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-neutral-900">
            Remaining Budget by Department
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-neutral-600">
                  Department
                </th>
                <th className="px-3 py-2 text-right font-medium text-neutral-600">
                  Remaining Budget
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td className="px-3 py-3 text-neutral-500" colSpan={2}>
                    Loading...
                  </td>
                </tr>
              ) : budgetRemaining.length === 0 ? (
                <tr>
                  <td className="px-3 py-3 text-neutral-500" colSpan={2}>
                    No budget data available.
                  </td>
                </tr>
              ) : (
                budgetRemaining.map((row) => (
                  <tr key={row.id}>
                    <td className="px-3 py-2 text-neutral-800">{row.name}</td>
                    <td className="px-3 py-2 text-right font-semibold text-neutral-900">
                      {formatCurrency(row.remaining)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Old navigation shortcuts hidden per request */}
      {/*
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
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
      */}
    </div>
  );
}

export default DashboardPage;
