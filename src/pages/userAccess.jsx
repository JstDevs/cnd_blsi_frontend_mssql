import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserroles } from '../features/settings/userrolesSlice';
import { fetchModules } from '../features/settings/modulesSlice';
import { PlusIcon, UserCheck, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const defaultPermissions = {
  view: false,
  add: false,
  edit: false,
  delete: false,
  print: false,
  mayor: false,
};

export default function UserAccessPage() {
  const dispatch = useDispatch();

  const { userroles, isLoading, error } = useSelector(
    (state) => state.userroles
  );
  // ---------------------USE MODULE PERMISSIONS------------------START ( User Access Page  - MODULE ID = 83 )
  const { Add } = useModulePermissions(83);
  const modules = useSelector((state) => state.modules.modules);

  const [selectedRole, setSelectedRole] = useState(null); // role object
  const [permissions, setPermissions] = useState({});

  // Fetch roles and modules
  useEffect(() => {
    dispatch(fetchUserroles());
    dispatch(fetchModules());
  }, [dispatch]);

  // Auto-select first role
  useEffect(() => {
    if (userroles.length > 0 && !selectedRole) {
      setSelectedRole(userroles[0]);
    }
  }, [userroles]);
  const fetchModuleAccess = async () => {
    try {
      const response = await fetch(
        `${API_URL}/moduleAccess/${selectedRole.ID}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );

      const res = await response.json();
      if (!response.ok)
        throw new Error(res.message || 'Failed to fetch access');

      const accessMap = {};
      res.forEach((entry) => {
        accessMap[entry.ModuleID] = {
          id: entry.ID,
          view: !!entry.View,
          add: !!entry.Add,
          edit: !!entry.Edit,
          delete: !!entry.Delete,
          print: !!entry.Print,
          mayor: !!entry.Mayor,
        };
      });

      const permissionsByModule = {};
      modules.forEach((mod) => {
        permissionsByModule[mod.ID] = accessMap[mod.ID] || {
          ...defaultPermissions,
        };
      });

      setPermissions(permissionsByModule);
    } catch (err) {
      console.error('Error loading module access:', err.message);
    }
  };
  // Fetch module access for selected role
  useEffect(() => {
    if (!selectedRole?.ID || modules.length === 0) return;

    fetchModuleAccess();
  }, [selectedRole, modules]);

  const togglePermission = (moduleId, key) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [key]: !prev[moduleId][key],
      },
    }));
  };

  const toggleAllPermissions = (value) => {
    const newPermissions = {};
    modules.forEach((mod) => {
      newPermissions[mod.ID] = {
        ...(permissions[mod.ID] || defaultPermissions),
        view: value,
        add: value,
        edit: value,
        delete: value,
        print: value,
        mayor: value,
      };
    });
    setPermissions(newPermissions);
  };

  const toggleAllForPermissionType = (permissionType, value) => {
    const newPermissions = { ...permissions };
    modules.forEach((mod) => {
      newPermissions[mod.ID] = {
        ...(newPermissions[mod.ID] || defaultPermissions),
        [permissionType]: value,
      };
    });
    setPermissions(newPermissions);
  };

  const handleSave = async () => {
    if (!selectedRole?.ID) return;

    const modulesPayload = Object.entries(permissions).map(
      ([moduleId, perms]) => ({
        id: perms.id || null, // may be undefined for new entries (optional handling)
        ModuleID: parseInt(moduleId),
        View: perms.view ? 1 : 0,
        Add: perms.add ? 1 : 0,
        Edit: perms.edit ? 1 : 0,
        Delete: perms.delete ? 1 : 0,
        Print: perms.print ? 1 : 0,
        Mayor: perms.mayor ? 1 : 0,
      })
    );

    try {
      const response = await fetch(`${API_URL}/moduleAccess`, {
        method: 'PUT', // or PUT, depending on your route setup
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          UserAccessID: selectedRole.ID,
          modules: modulesPayload,
        }),
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message || 'Failed to save permissions');
      }

      toast.success('Permissions saved successfully!');
      // fetchModuleAccess();
    } catch (err) {
      console.error('Save failed:', err.message);
      toast.error('Error saving permissions.');
    }
  };

  return (
    <div className="sm:p-4 space-y-4">
      {/* Header */}
      <header className="page-header space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Access</h1>
            <p className="text-gray-600">Manage user roles and module access.</p>
          </div>
          <Link
            to="/settings/user-roles"
            className="group relative overflow-hidden px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300" />
            <Users size={20} className="relative z-10" />
            <span className="relative z-10">Manage User Roles</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4 px-5 bg-gray-50/50 rounded-xl border border-gray-100 shadow-sm">
          <div className="relative flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Search roles..."
              className="w-full border-gray-200 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all pl-10 bg-white"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {Add && (
            <button
              className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm hover:shadow transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap text-sm"
              onClick={handleSave}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Save Changes
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Role List */}
        <div className="lg:col-span-3 bg-white border rounded shadow">
          <div className="border-b p-2 bg-blue-100 font-medium text-center">
            Roles
          </div>
          {isLoading ? (
            <div className="p-4 text-center">Loading roles...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : userroles.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No roles found.</div>
          ) : (
            <ul>
              {userroles.map((role) => (
                <li
                  key={role.ID}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${selectedRole?.ID === role.ID
                    ? 'bg-blue-200 font-semibold'
                    : ''
                    }`}
                >
                  {role.Description}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Permissions Table */}
        <div className="lg:col-span-9 bg-white border rounded shadow overflow-x-auto">
          <div className="border-b p-2 bg-blue-100 font-medium text-center">
            Permissions for: {selectedRole?.Description || '—'}
          </div>
          <table className="min-w-[700px] w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Module</th>
                {['view', 'add', 'edit', 'delete', 'print', 'mayor'].map(
                  (perm) => (
                    <th key={perm} className="px-2 capitalize text-center">
                      <div className="flex flex-col items-center">
                        <span>{perm}</span>
                      </div>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50">
                <td className="px-4 py-1 font-medium">Select All</td>
                {['view', 'add', 'edit', 'delete', 'print', 'mayor'].map(
                  (perm) => (
                    <td key={`select-all-${perm}`} className="text-center">
                      <input
                        type="checkbox"
                        checked={modules.every(
                          (mod) => permissions[mod.ID]?.[perm]
                        )}
                        onChange={(e) =>
                          toggleAllForPermissionType(perm, e.target.checked)
                        }
                        className="accent-blue-600"
                      />
                    </td>
                  )
                )}
              </tr>
              {modules.map((mod) => (
                <tr key={mod.ID} className="border-t">
                  <td className="px-4 py-1">{mod.Description}</td>
                  {['view', 'add', 'edit', 'delete', 'print', 'mayor'].map(
                    (perm) => (
                      <td key={perm} className="text-center">
                        <input
                          type="checkbox"
                          checked={permissions[mod.ID]?.[perm] || false}
                          onChange={() => togglePermission(mod.ID, perm)}
                          className="accent-blue-600"
                        />
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-2 border-t space-x-2">
            <button
              onClick={() => toggleAllPermissions(true)}
              className="btn btn-outline"
            >
              Select All
            </button>
            <button
              onClick={() => toggleAllPermissions(false)}
              className="btn btn-outline"
            >
              Deselect All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

