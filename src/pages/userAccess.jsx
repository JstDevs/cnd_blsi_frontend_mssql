import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserroles } from '../features/settings/userrolesSlice';
import { fetchModules } from '../features/settings/modulesSlice';
import { PlusIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

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
            Authorization: `Bearer ${localStorage.getItem('token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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
      <header className="page-header space-y-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Access</h1>
          <p className="text-gray-600">Manage user roles and module access.</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <input
            type="text"
            placeholder="Search role..."
            className="border px-3 py-2 rounded-md w-full sm:w-60"
          />
          {Add && (
            <button
              className="btn btn-primary flex items-center"
              onClick={handleSave}
            >
              Save
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
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                    selectedRole?.ID === role.ID
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
