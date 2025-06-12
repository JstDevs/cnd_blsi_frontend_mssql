// components/DocumentsTable.jsx
import React from "react";

const statusColors = {
  approved: "bg-green-100 text-green-700",
  requested: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

const DocumentsTable = ({ documents }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-100 text-left text-sm font-medium text-gray-600">
          <tr>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">AP AR</th>
            <th className="px-4 py-3">Invoice Date</th>
            <th className="px-4 py-3">Invoice #</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3">Funds</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td className="px-4 py-3">
                <div className="flex gap-2 flex-wrap">
                  {doc.status.map((s) => (
                    <span
                      key={s}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[s]}`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">{doc.apar}</td>
              <td className="px-4 py-3">{doc.invoiceDate}</td>
              <td className="px-4 py-3">{doc.invoiceNumber}</td>
              <td className="px-4 py-3 text-right">{doc.total}</td>
              <td className="px-4 py-3">{doc.funds}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentsTable;
