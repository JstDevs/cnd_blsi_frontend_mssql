import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  FileText,
  Save,
  Users,
  RefreshCw,
  Search,
  UserCheck,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

const SignatoriesPage = () => {
  const dispatch = useDispatch();
  const { Edit } = useModulePermissions(58);
  const [signatoriesList, setSignatoriesList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Signatories and Employees in parallel
      const [signatoriesRes, employeesRes] = await Promise.all([
        fetch(`${API_URL}/signatories`, { headers }),
        fetch(`${API_URL}/employee`, { headers })
      ]);

      if (!signatoriesRes.ok || !employeesRes.ok) {
        throw new Error('Failed to fetch required data');
      }

      const signatoriesData = await signatoriesRes.json();
      const employeesData = await employeesRes.json();

      setSignatoriesList(Array.isArray(signatoriesData) ? signatoriesData : []);
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load signatories or employees list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const handleSignatoryChange = (signatoryID, field, employeeID) => {
    setSignatoriesList(prev => prev.map(item =>
      item.ID === signatoryID ? { ...item, [field]: employeeID } : item
    ));
  };

  const handleSave = async (item) => {
    if (!Edit) return;
    setIsSaving(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/signatories/${item.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) throw new Error('Failed to update signatories');

      toast.success(`Signatories for ${item.DocumentType?.Name || 'Document'} updated`);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSignatories = signatoriesList.filter(item =>
    item.DocumentType?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.DocumentTypeID?.toString().includes(searchTerm)
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredSignatories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSignatories.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const renderSignatorySelect = (item, field) => (
    <select
      className="text-xs border-neutral-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full bg-neutral-50 p-1.5"
      value={item[field] || ''}
      onChange={(e) => handleSignatoryChange(item.ID, field, e.target.value)}
      disabled={!Edit}
    >
      <option value="">None</option>
      {employees.map(emp => (
        <option key={emp.ID} value={emp.ID}>
          {emp.FirstName} {emp.LastName}
        </option>
      ))}
    </select>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
          <p className="text-neutral-500 font-medium">Loading signatories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary-50 rounded-xl">
                <Users className="h-7 w-7 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                  Report Signatories Manager
                </h1>
                <p className="text-neutral-500 font-medium text-sm">
                  Assign presiding officers and authorized signatories for all system documents
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Search document type..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchData}
              className="p-2.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all active:scale-95"
              title="Refresh Data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider w-[250px]">
                  Document / Report
                </th>
                <th className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Signatory One   </th>
                <th className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Signatory Two   </th>
                <th className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Signatory Three </th>
                <th className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Signatory Four  </th>
                <th className="px-3 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Signatory Five  </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-neutral-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.ID} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-neutral-100 rounded-lg group-hover:bg-primary-50 transition-colors">
                          <FileText className="h-4 w-4 text-neutral-500 group-hover:text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-neutral-900 leading-tight">
                            {item.DocumentType?.Name || 'Unknown Document'}
                          </div>
                          {/* <div className="text-[10px] text-neutral-400 font-medium">ID: {item.DocumentTypeID}</div> */}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-4">{renderSignatorySelect(item, 'EmployeeOne')}</td>
                    <td className="px-2 py-4">{renderSignatorySelect(item, 'EmployeeTwo')}</td>
                    <td className="px-2 py-4">{renderSignatorySelect(item, 'EmployeeThree')}</td>
                    <td className="px-2 py-4">{renderSignatorySelect(item, 'EmployeeFour')}</td>
                    <td className="px-2 py-4">{renderSignatorySelect(item, 'EmployeeFive')}</td>
                    <td className="px-6 py-4 text-right">
                      {Edit && (
                        <button
                          onClick={() => handleSave(item)}
                          disabled={isSaving}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all active:scale-90"
                          title="Save changes for this document"
                        >
                          <Save className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-neutral-50 rounded-full mb-3">
                        <UserCheck className="h-6 w-6 text-neutral-300" />
                      </div>
                      <p className="text-neutral-500 font-medium italic">
                        {searchTerm ? `No results for "${searchTerm}"` : 'No signatory settings found.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between">
            <div className="text-sm text-neutral-500 font-medium">
              Showing <span className="text-neutral-900">{indexOfFirstItem + 1}</span> to <span className="text-neutral-900">{Math.min(indexOfLastItem, filteredSignatories.length)}</span> of <span className="text-neutral-900">{filteredSignatories.length}</span> documents
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-bold text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg transition-all ${currentPage === i + 1
                        ? 'bg-primary-600 text-white'
                        : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-bold text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-4">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Users className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900">Signatory Configuration Guide</h4>
          <p className="text-sm text-amber-800 mt-0.5">
            Select the appropriate employees from the dropdowns for each document.
            Click the <Save className="h-3 w-3 inline" /> disk icon on the right to save changes for an individual row.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignatoriesPage;
