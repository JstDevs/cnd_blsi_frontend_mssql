import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  FileText,
  Save,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

const Watermarks = () => {
  const dispatch = useDispatch();
  const { Edit } = useModulePermissions(58);
  const [watermarksList, setWatermarksList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchWatermarks = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/watermarks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Watermarks info');
      }
      const data = await response.json();
      setWatermarksList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading Watermarks info:', error);
      toast.error('Failed to load Watermarks info');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWatermarks();
  }, [dispatch]);

  const toggleWatermark = async (item) => {
    if (!Edit) return;

    const newStatus = item.Confidential === 1 ? 0 : 1;
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/watermarks/${item.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...item,
          Confidential: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update watermark status');
      }

      // Update local state
      setWatermarksList(prev => prev.map(w =>
        w.ID === item.ID ? { ...w, Confidential: newStatus } : w
      ));

      toast.success(`${item.DocumentType?.Name || 'Document'} watermark ${newStatus === 1 ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update watermark status');
    }
  };

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Report Watermarks
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Enable or disable watermarks for specific document types.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={fetchWatermarks}
            className="btn btn-outline flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  Document Type
                </th>
                {/* 
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  Document ID
                </th> 
                */}
                <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  Watermark Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {watermarksList.length > 0 ? (
                watermarksList.map((item) => (
                  <tr key={item.ID} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-neutral-400 mr-3" />
                        <span className="text-sm font-semibold text-neutral-900">
                          {item.DocumentType?.Name || 'Unknown Document'}
                        </span>
                      </div>
                    </td>
                    {/* 
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {item.DocumentID}
                    </td> 
                    */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.Confidential === 1 ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-success-600 via-success-900 to-success-999 text-success-100">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-400 text-neutral-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {Edit && (
                        <button
                          onClick={() => toggleWatermark(item)}
                          className={`btn btn-sm ${item.Confidential === 1
                              ? 'btn-outline text-red-600 hover:bg-red-50 hover:text-red-700'
                              : 'btn-primary'
                            }`}
                        >
                          {item.Confidential === 1 ? 'Disable' : 'Enable'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-neutral-500 italic">
                    {isLoading ? 'Loading watermarks...' : 'No watermark settings found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Watermarks;
