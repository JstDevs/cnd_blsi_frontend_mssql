import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useModulePermissions(moduleId) {
  const { selectedRole } = useSelector((state) => state.auth);
  //   console.log('selectedRole', selectedRole);
  const perms = useMemo(() => {
    if (!selectedRole || selectedRole.Description === 'Administration') {
      return {
        View: true,
        Add: true,
        Edit: true,
        Delete: true,
        Print: true,
        Mayor: true,
      };
    }
    if (!selectedRole.ModuleAccesses) return {};
    const found = selectedRole.ModuleAccesses.find(
      (m) => m.ModuleID === moduleId
    );
    return found || {};
  }, [selectedRole, moduleId]);

  return perms;
}
