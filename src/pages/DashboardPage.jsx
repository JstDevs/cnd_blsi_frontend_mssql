import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  fetchDisbursementList,
} from './userProfile/profileUtil';
import { PhilippinePeso, Users, Briefcase } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { fetchEmployees } from '../features/settings/employeeSlice';

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
                      className={`ml-2 flex items-baseline text-sm font-semibold ${trend === 'up' ? 'text-success-600' : 'text-error-600'
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
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { employees } = useSelector((state) => state.employees || {});
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const categoryOptions = [
    { key: 'general', label: 'General Services' },
    { key: 'marriage', label: 'Marriage Services' },
    { key: 'burial', label: 'Burial Services' },
    { key: 'cedula', label: 'Cedula' },
  ];
  const [categoryFilter, setCategoryFilter] = useState('all');
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
        const activeCategories =
          categoryFilter === 'all'
            ? categoryOptions.map((c) => c.key)
            : [categoryFilter];

        // Dispatch fetchEmployees to get HR data
        dispatch(fetchEmployees());

        const [revenueRes, budgetRes, disbursementRes] = await Promise.all([
          fetchCollectionTotals({
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            categories: activeCategories,
          }),
          fetchBudgetList(''),
          fetchDisbursementChart({
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          }),
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
        const budgetList = Array.isArray(budgetRes?.data) ? budgetRes.data : [];
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
          return { id: item.ID, name: item.Department?.Name || item.Name || 'N/A', remaining };
        });
        setBudgetRemaining(remainingByDept);

        // Disbursement approved vs rejected (counts preferred)
        let statusTotals = { approved: 0, rejected: 0, pending: 0 };
        if (Array.isArray(disbursementRes?.data)) {
          statusTotals = disbursementRes.data.reduce((acc, item) => {
            const name = (item.name || '').toLowerCase();
            const value = Number(item.count ?? item.value ?? 0);
            // prioritize reject if present (some labels include both Posted and Rejected)
            if (name.includes('reject')) acc.rejected += value;
            else if (name.includes('approve') || name.includes('post')) acc.approved += value;
            else acc.pending += value;
            return acc;
          }, statusTotals);
        } else if (disbursementRes?.data && typeof disbursementRes.data === 'object') {
          const d = disbursementRes.data;
          statusTotals.approved = Number(d.Approved ?? d.approved ?? 0);
          statusTotals.rejected = Number(d.Rejected ?? d.rejected ?? 0);
          statusTotals.pending = Number(d.Pending ?? d.pending ?? 0);
        }
        setDisbursementStatus(statusTotals);
        // log raw response to help debug why totals may be zero
        console.log('disbursementRes raw:', disbursementRes?.data);

        // Fallback: if totals are zero, fetch DV list and compute counts client-side
        const totalCount = statusTotals.approved + statusTotals.rejected;
        if (totalCount === 0) {
          try {
            const listRes = await fetchDisbursementList({
              startDate: startDate || undefined,
              endDate: endDate || undefined,
            });
            const list = Array.isArray(listRes?.data)
              ? listRes.data
              : Array.isArray(listRes?.data?.disbursementVouchers)
                ? listRes.data.disbursementVouchers
                : [];

            const counts = list.reduce(
              (acc, item) => {
                const status = (item.Status || item.status || '').toString();
                // handle comma-separated statuses like "Posted, Disbursement Rejected"
                const parts = status.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
                if (parts.some((p) => p.includes('reject'))) acc.rejected += 1;
                else if (parts.some((p) => p.includes('approve') || p === 'posted' || p.includes('post'))) acc.approved += 1;
                else acc.pending += 1;
                return acc;
              },
              { approved: 0, rejected: 0, pending: 0 }
            );
            // If counts were found, update the UI
            if (counts.approved + counts.rejected > 0) {
              setDisbursementStatus(counts);
              console.log('Fallback counts from disbursement list:', counts);
            }
          } catch (err) {
            console.error('Fallback fetchDisbursementList failed:', err);
          }
        }
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
  }, [startDate, endDate, categoryFilter, isAuthenticated]);

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

  const activeCategoryKeys =
    categoryFilter === 'all'
      ? categoryOptions.map((c) => c.key)
      : [categoryFilter];

  const selectedCategoryOption =
    categoryFilter === 'all'
      ? null
      : categoryOptions.find((c) => c.key === categoryFilter);

  const getCategoryAmount = (key) => {
    if (key === 'general') return revenueTotals.general;
    if (key === 'marriage') return revenueTotals.marriage;
    if (key === 'burial') return revenueTotals.burial;
    return revenueTotals.cedula;
  };

  const totalRevenue =
    (activeCategoryKeys.includes('general') ? revenueTotals.general : 0) +
    (activeCategoryKeys.includes('marriage') ? revenueTotals.marriage : 0) +
    (activeCategoryKeys.includes('burial') ? revenueTotals.burial : 0) +
    (activeCategoryKeys.includes('cedula') ? revenueTotals.cedula : 0);

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

  // ----------------------- HR DATA PROCESSING -----------------------
  const calculateAge = (birthday) => {
    if (!birthday) return null;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getAgeBracket = (age) => {
    if (age === null || isNaN(age)) return 'Unknown';
    if (age < 18) return 'Below 18';
    if (age <= 25) return '18-25';
    if (age <= 35) return '26-35'; // Adjusted bracket for better distribution
    if (age <= 50) return '36-50';
    if (age <= 60) return '51-60';
    return '61+';
  };

  // Process Employee Data for Charts
  const { demographicsData, statusData, totalEmployees } = (() => {
    const defaultBrackets = ['Below 18', '18-25', '26-35', '36-50', '51-60', '61+', 'Unknown'];
    const bracketMap = {};
    defaultBrackets.forEach(b => bracketMap[b] = { name: b, Male: 0, Female: 0 });

    const statusMap = {};
    let total = 0;

    (employees || []).forEach(emp => {
      total++;
      // Age/Gender
      const age = calculateAge(emp.Birthday);
      const bracket = getAgeBracket(age);
      const gender = (emp.Gender || 'Unknown').trim();

      // Normalize gender string
      let genderKey = 'Unknown';
      if (/male/i.test(gender) && !/female/i.test(gender)) genderKey = 'Male';
      else if (/female/i.test(gender)) genderKey = 'Female';

      if (bracketMap[bracket]) {
        bracketMap[bracket][genderKey] = (bracketMap[bracket][genderKey] || 0) + 1;
      }

      // Employment Status
      const statusName = emp.EmploymentStatus?.Name || emp.EmploymentStatus || 'Unassigned';
      statusMap[statusName] = (statusMap[statusName] || 0) + 1;
    });

    const demoData = Object.values(bracketMap);

    const statData = Object.keys(statusMap).map(key => ({
      name: key,
      value: statusMap[key]
    })).sort((a, b) => b.value - a.value); // Sort by count desc

    return { demographicsData: demoData, statusData: statData, totalEmployees: total };
  })();

  const GENDER_COLORS = { Male: '#3b82f6', Female: '#ec4899', Unknown: '#9ca3af' };
  const CHART_COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#f97316', '#ef4444', '#8b5cf6', '#6366f1'];

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
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-neutral-500">Start date</p>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 px-3 py-2 w-full border border-neutral-200 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <p className="text-sm text-neutral-500">End date</p>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 px-3 py-2 w-full border border-neutral-200 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Revenue category</p>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="mt-1 px-3 py-2 w-full border border-neutral-200 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All categories</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-neutral-400">
            Data sourced from collection totals and budget/disbursement
            dashboards. Selected dates and category will apply to the total
            revenue and revenue-by-category summaries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Revenue (selected range)"
          value={loading ? '...' : formatCurrency(totalRevenue)}
          icon={PhilippinePeso}
          loading={loading}
        />
        <StatCard
          title="Disbursement Vouchers Approved"
          value={loading ? '...' : disbursementStatus.approved}
          icon={CheckBadgeIcon}
          trend="up"
          trendValue={approvalRate}
          loading={loading}
        />
        <StatCard
          title="Disbursement Vouchers Rejected"
          value={loading ? '...' : disbursementStatus.rejected}
          icon={XCircleIcon}
          trend="down"
          trendValue={rejectionRate}
          loading={loading}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-neutral-900">
              Revenue by Category
            </h3>
            {selectedCategoryOption && (
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  Focused category
                </p>
                <p className="text-sm font-medium text-primary-700">
                  {selectedCategoryOption.label}
                </p>
              </div>
            )}
          </div>

          {selectedCategoryOption && (
            <div className="mb-4 rounded-md bg-primary-50 border border-primary-100 px-4 py-3">
              <p className="text-xs text-primary-600 uppercase tracking-wide">
                Selected category total
              </p>
              <p className="mt-1 text-lg font-semibold text-primary-800">
                {loading
                  ? '...'
                  : formatCurrency(getCategoryAmount(selectedCategoryOption.key))}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {categoryOptions.map((item) => {
              const isActive = activeCategoryKeys.includes(item.key);
              return (
                <div
                  key={item.key}
                  className={`rounded-md border p-3 transition ${isActive
                    ? 'border-primary-200 bg-primary-50 shadow-sm'
                    : 'border-neutral-200 bg-neutral-50'
                    }`}
                >
                  <p
                    className={`text-sm ${isActive ? 'text-primary-700 font-medium' : 'text-neutral-500'
                      }`}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`text-lg font-semibold ${isActive ? 'text-primary-900' : 'text-neutral-900'
                      }`}
                  >
                    {loading ? '...' : formatCurrency(getCategoryAmount(item.key))}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* OLD HEHE */}
        {/* <div className="bg-white border border-neutral-200 rounded-lg p-4">
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
        </div> */}
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
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
      </div>

      {/* ----------------------- NEW HR DASHBOARD SECTION ----------------------- */}
      <div className="mt-6 col-span-1 lg:col-span-2 xl:col-span-3">
        <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
          <Users className="h-6 w-6 text-primary-600" />
          Workforce Overview
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Demographics Chart */}
          <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-lg p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-neutral-600 mb-4 uppercase tracking-wide">
              Employee Demographics (Age & Gender)
            </h4>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={demographicsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Male" stackId="a" fill={GENDER_COLORS.Male} radius={[0, 0, 4, 4]} barSize={40} />
                  <Bar dataKey="Female" stackId="a" fill={GENDER_COLORS.Female} radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Employment Status Chart */}
          <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm flex flex-col">
            <h4 className="text-sm font-semibold text-neutral-600 mb-4 uppercase tracking-wide">
              Employment Status
            </h4>
            <div className="h-[200px] w-full flex-grow relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text for Donut Chart */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-neutral-800">{totalEmployees}</span>
                <span className="text-xs text-neutral-500 font-medium uppercase">Employees</span>
              </div>
            </div>
            <div className="mt-4 space-y-2 overflow-y-auto max-h-[120px] custom-scrollbar pr-2">
              {statusData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    />
                    <span className="text-neutral-600 truncate max-w-[120px]" title={entry.name}>
                      {entry.name}
                    </span>
                  </div>
                  <span className="font-semibold text-neutral-900">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* Old navigation shortcuts hidden */}
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
    </div>
  );
}

export default DashboardPage;
