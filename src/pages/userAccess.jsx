import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserroles } from "../features/settings/userrolesSlice";

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
  const { userroles, isLoading, error } = useSelector((state) => state.userroles);

  const [selectedRole, setSelectedRole] = useState("");
  const [modules, setModules] = useState([]);
  const [permissions, setPermissions] = useState({});

  // Fetch user roles from Redux
  useEffect(() => {
    dispatch(fetchUserroles());
  }, [dispatch]);

  // Set default selected role
  useEffect(() => {
    if (userroles.length > 0 && !selectedRole) {
      setSelectedRole(userroles[0]?.Description || userroles[0]);
    }
  }, [userroles]);

  // Fetch modules from API (no Redux)
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`${API_URL}/modules`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const res = await response.json();

        if (!response.ok) throw new Error(res.message || "Failed to fetch modules");

        setModules(res);

        // Initialize permissions state for each module
        const initialPermissions = res.reduce((acc, mod) => {
          const moduleName = mod.Description || mod.Name || mod.Module || mod; // fallback if string
          acc[moduleName] = { ...defaultPermissions };
          return acc;
        }, {});

        setPermissions(initialPermissions);
      } catch (err) {
        console.error("Failed to fetch modules:", err.message);
      }
    };

    fetchModules();
  }, []);

  const togglePermission = (module, key) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: { ...prev[module], [key]: !prev[module][key] },
    }));
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header: search + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          type="text"
          placeholder="Search role..."
          className="border px-3 py-2 rounded-md w-full sm:w-60"
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded text-white bg-green-600">Save</button>
        </div>
      </div>

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
                  onClick={() => setSelectedRole(role.Description)}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                    role.Description === selectedRole ? "bg-blue-200 font-semibold" : ""
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
            Permissions for: {selectedRole}
          </div>
          <table className="min-w-[700px] w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Module</th>
                {["view", "add", "edit", "delete", "print", "mayor"].map((perm) => (
                  <th key={perm} className="px-2 capitalize">{perm}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((mod) => {
                const moduleName = mod.Description || mod.Name || mod.Module || mod; // fallback
                return (
                  <tr key={moduleName} className="border-t">
                    <td className="px-4 py-1">{moduleName}</td>
                    {["view", "add", "edit", "delete", "print", "mayor"].map((perm) => (
                      <td key={perm} className="text-center">
                        <input
                          type="checkbox"
                          checked={permissions[moduleName]?.[perm] || false}
                          onChange={() => togglePermission(moduleName, perm)}
                          className="accent-blue-600"
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
