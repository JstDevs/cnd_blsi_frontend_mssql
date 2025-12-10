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
import { fetchUserDocumentsList, fetchUserProfile } from './profileUtil';

export const statusLabel = (statusString) => {
  const statusColors = {
    'Disbursement Posted': 'bg-green-100 text-green-700',
    Requested: 'bg-blue-100 text-blue-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    'Cheque Requested': 'bg-red-100 text-red-700',
  };
  return (
    <div className="flex gap-2 flex-wrap">
      {statusString.split(',').map((status, idx) => {
        const trimmed = status.trim();
        return (
          <span
            key={idx}
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              statusColors[trimmed] || 'bg-gray-100 text-gray-600'
            }`}
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
                Position: {user.Position.Name}
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
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
              Budget
            </button>
          </Link>
          <Link to="/disbursement-dashboard">
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
              Disbursement
            </button>
          </Link>
          <Link to="/collection-dashboard">
            <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm">
              Collection
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
          title="Approved"
          value={summary.approved}
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
