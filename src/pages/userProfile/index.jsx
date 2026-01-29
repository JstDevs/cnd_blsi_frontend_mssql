import { useEffect, useState } from 'react';
import {
  UserCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  DocumentIcon,
  EyeIcon,
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import DataTable from '../../components/common/DataTable';
// import { fetchUserDocumentsList } from '../../api/profileApi'; // adjust path as needed
import { toast } from 'react-hot-toast';
import { fetchUserDocumentsList, fetchUserProfile } from './profileUtil';    // }

export const statusLabel = (statusString) => {
  const statusConfig = {
    Requested: {
      bg: 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500',
      text: 'text-error-700',
      icon: '⏳',
    },
    Approved: {
      bg: 'bg-gradient-to-r from-success-300 via-success-500 to-success-600',
      text: 'text-neutral-800',
      icon: '✓',
    },
    Posted: {
      bg: 'bg-gradient-to-r from-success-800 via-success-900 to-success-999',
      text: 'text-success-100',
      icon: '✓',
    },
    Rejected: {
      bg: 'bg-gradient-to-r from-error-700 via-error-800 to-error-999',
      text: 'text-neutral-100',
      icon: '✕',
    },
    Void: {
      bg: 'bg-gradient-to-r from-primary-900 via-primary-999 to-tertiary-999',
      text: 'text-neutral-300',
      icon: '⊘',
    },
    Cancelled: {
      bg: 'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-400',
      text: 'text-neutral-800',
      icon: '✕',
    },
    'Disbursement Pending': {
      bg: 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500',
      text: 'text-error-700',
      icon: '⏳',
    },
    'Disbursement Posted': {
      bg: 'bg-gradient-to-r from-success-800 via-success-900 to-success-999',
      text: 'text-success-100',
      icon: '✓',
    },
    'Disbursement Rejected': {
      bg: 'bg-gradient-to-r from-error-700 via-error-800 to-error-999',
      text: 'text-neutral-100',
      icon: '✕',
    },
    'Cheque Pending': {
      bg: 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500',
      text: 'text-error-700',
      icon: '⏳',
    },
    'Cheque Posted': {
      bg: 'bg-gradient-to-r from-success-800 via-success-900 to-success-999',
      text: 'text-success-100',
      icon: '✓',
    },
    'Cheque Rejected': {
      bg: 'bg-gradient-to-r from-error-700 via-error-800 to-error-999',
      text: 'text-neutral-100',
      icon: '✕',
    },
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {statusString.split(',').map((status, idx) => {
        const trimmed = status.trim();
        const config = statusConfig[trimmed] || {
          bg: 'bg-gradient-to-r from-gray-100 to-slate-100',
          text: 'text-gray-700',
          border: 'border-gray-300',
          icon: '•',
        };

        return (
          <span
            // key={idx}
            // className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} ${config.shadow || ''} transition-all hover:scale-105`}
            key={idx}
            className={`inline-flex px-2 py-1 rounded ${config.bg} ${config.text} ${config.border} ${config.shadow || ''} transition-all hover:scale-105`}
          >
            {trimmed}
          </span>
        );
      })}
    </div>
  );
};

const UserProfilePage = () => {
  const [ownerFilter, setOwnerFilter] = useState('self');
  const [documents, setDocuments] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUserDocumentsList(ownerFilter)
      .then((res) => {
        console.log('res', res);
        setDocuments(res.data);
        // setDocuments(res.data || []);
      })
      .catch(() => {
        toast.error('Failed to load documents');
      });
  }, [ownerFilter]);
  useEffect(() => {
    if (user) return;
    fetchUserProfile()
      .then((userData) => {
        setUser(userData.data);
      })
      .catch((error) => {
        toast.error('Failed to load user profile');
      });
  }, []);
  const { statusCounts, documentsList } = documents || {};

  const summary = {
    total: statusCounts?.Total,
    approved: statusCounts?.Approved,
    posted: statusCounts?.Posted,
    requested: statusCounts?.Requested,
    rejected: statusCounts?.Rejected,
  };
  // console.log('summary', documentsList);
  const columns = [
    {
      key: 'Status',
      header: 'Status',
      render: (value) => statusLabel(value),
    },
    { key: 'InvoiceNumber', header: 'Invoice No', sortable: true },
    { key: 'APAR', header: 'APAR Type', sortable: true },
    { key: 'InvoiceDate', header: 'Invoice Date', sortable: true },
    {
      key: 'Funds',
      header: 'Funds',
      sortable: true,
      render: (value) => value?.Name || '—',
    },
    { key: 'Total', header: 'Amount', sortable: true },
  ];

  // const actions = [
  //   {
  //     icon: EyeIcon,
  //     title: 'View',
  //     onClick: (item) => {
  //       console.log('View:', item);
  //       // Navigate or open modal logic here
  //     },
  //   },
  // ];
  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <UserCircleIcon className="w-20 h-20 text-gray-400" />
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome,{' '}
              {[user?.FirstName, user?.MiddleName, user?.LastName]
                .filter(Boolean)
                .join(' ')}
            </h2>

            {user?.Position?.Name && (
              <p className="text-sm text-gray-500">
                {user.Position.Name}
              </p>
            )}

            {user?.Department?.Name && (
              <p className="text-sm text-gray-500">
                Department: {user.Department.Name}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/budget-dashboard">
            <button className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm">
              Budget
            </button>
          </Link>
          <Link to="/collection-dashboard">
            <button className="px-4 py-2 bg-secondary-600 text-white rounded hover:bg-secondary-700 text-sm">
              Collection
            </button>
          </Link>
          <Link to="/disbursement-dashboard">
            <button className="px-4 py-2 bg-tertiary-500 text-white rounded hover:bg-tertiary-600 text-sm">
              Disbursement
            </button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Documents"
          value={summary.total}
          icon={DocumentIcon}
        />
        <SummaryCard
          title="Posted"
          value={summary.posted}
          icon={CheckCircleIcon}
        />
        <SummaryCard
          title="Requested"
          value={summary.requested}
          icon={ClockIcon}
        />
        <SummaryCard
          title="Rejected"
          value={summary.rejected}
          icon={XCircleIcon}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-6">
        <span className="text-sm font-medium text-gray-700">Owner:</span>
        {[
          { label: 'Me', value: 'self' },
          { label: 'Department', value: 'department' },
          { label: 'All', value: 'all' },
        ].map((opt) => (
          <label key={opt.value} className="flex items-center gap-2">
            <input
              type="radio"
              name="owner"
              value={opt.value}
              checked={ownerFilter === opt.value}
              onChange={() => setOwnerFilter(opt.value)}
              className="text-blue-600"
            />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Document Table */}
      <DataTable
        columns={columns}
        data={documentsList || []}
        // actions={actions}
        pagination
      />
    </div>
  );
};

// Summary Card component
const SummaryCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white shadow-sm rounded-lg p-4 flex items-center gap-4">
    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default UserProfilePage;
