import { useState } from "react";
import {
  UserCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  DocumentIcon,
} from "@heroicons/react/24/solid";
import DocumentsTable from "./DocumentsTable";
import { Link } from 'react-router-dom';

const mockDocuments = [
  {
    id: 1,
    status: ["approved"],
    apar: "Disbursement Voucher",
    invoiceDate: "2024-06-01",
    invoiceNumber: "INV-001",
    total: "$15,000.00",
    funds: "General Fund",
    owner: "Me",
  },
  {
    id: 2,
    status: ["requested", "pending"],
    apar: "Obligation Request",
    invoiceDate: "2024-06-03",
    invoiceNumber: "INV-002",
    total: "$25,000.00",
    funds: "Special Fund",
    owner: "Department",
  },
  {
    id: 3,
    status: ["rejected"],
    apar: "Disbursement Voucher",
    invoiceDate: "2024-06-05",
    invoiceNumber: "INV-003",
    total: "$5,000.00",
    funds: "General Fund",
    owner: "All",
  },
];

const statusColors = {
  approved: "bg-green-100 text-green-700",
  requested: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

const UserProfilePage = () => {
  const [ownerFilter, setOwnerFilter] = useState("Me");

  const filteredDocs = mockDocuments.filter((doc) =>
    ownerFilter === "All" ? true : doc.owner === ownerFilter
  );

  const summary = {
    total: mockDocuments.length,
    approved: mockDocuments.filter((d) => d.status.includes("approved")).length,
    requested: mockDocuments.filter((d) => d.status.includes("requested")).length,
    rejected: mockDocuments.filter((d) => d.status.includes("rejected")).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Profile Section */}
      {/* Profile Section */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
  <div className="flex items-center gap-4">
    <UserCircleIcon className="w-20 h-20 text-gray-400" />
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Welcome, John Doe</h2>
      <p className="text-sm text-gray-500">Position: Accountant</p>
      <p className="text-sm text-gray-500">Department: Finance</p>
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


      {/* Document Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard title="Total Documents" value={summary.total} icon={DocumentIcon} />
        <SummaryCard title="Approved" value={summary.approved} icon={CheckCircleIcon} />
        <SummaryCard title="Requested" value={summary.requested} icon={ClockIcon} />
        <SummaryCard title="Rejected" value={summary.rejected} icon={XCircleIcon} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-6">
        <span className="text-sm font-medium text-gray-700">Owner:</span>
        {["Me", "Department", "All"].map((opt) => (
          <label key={opt} className="flex items-center gap-2">
            <input
              type="radio"
              name="owner"
              value={opt}
              checked={ownerFilter === opt}
              onChange={() => setOwnerFilter(opt)}
              className="text-blue-600"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>

      {/* Document Table */}
      <DocumentsTable documents={filteredDocs} />
    </div>
  );
};

// Summary card component
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