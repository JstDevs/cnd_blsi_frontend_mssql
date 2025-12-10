import axiosInstance from '@/utils/axiosInstance';
// 1. Fetch user documents list
export const fetchUserDocumentsList = (owner = 'self') => {
  return axiosInstance(`/profileDashboard/userDocumentsList`, {
    params: { owner },
  });
};

// 2. Fetch user profile
export const fetchUserProfile = () => {
  return axiosInstance(`/profileDashboard/user`);
};
// ----------------------------BUDGET------------------------------
// 3. Fetch budget list (optionally filter by department)
export const fetchBudgetList = (selectedDepartmentID) => {
  return axiosInstance(`/profileDashboard/budgetList`, {
    params: selectedDepartmentID ? { selectedDepartmentID } : {},
  });
};

// 4. Fetch APAR list by budget ID
export const fetchBudgetAPARList = (budgetId) => {
  return axiosInstance(`/profileDashboard/budgetAPARList/${budgetId}`);
};

// ------------------DISBURSMENT-----------------------
// 1. Disbursement Amounts
export const fetchDisbursementAmounts = (
  dateRange = 'Day',
  aparType = 'Disbursement Voucher',
  selectedDepartmentID = ''
) => {
  const params = {
    dateRange,
    aparType,
    ...(selectedDepartmentID && { selectedDepartmentID }),
  };
  return axiosInstance('/profileDashboard/disbursementAmounts', { params });
};

// 2. Obligation Chart
export const fetchObligationChart = (
  dateRange = 'Day',
  selectedDepartmentID = null
) => {
  const params = {
    dateRange,
    ...(selectedDepartmentID && { selectedDepartmentID }),
  };
  return axiosInstance('/profileDashboard/obligationChart', { params });
};

// 3. Travel Order Chart
export const fetchTravelOrderChart = (
  dateRange = 'Day',
  selectedDepartmentID = null
) => {
  const params = {
    dateRange,
    ...(selectedDepartmentID && { selectedDepartmentID }),
  };
  return axiosInstance('/profileDashboard/travelOrderChart', { params });
};

// 4. Disbursement Chart
export const fetchDisbursementChart = (
  dateRange = 'Year',
  selectedDepartmentID = null
) => {
  const params = {
    dateRange,
    ...(selectedDepartmentID && { selectedDepartmentID }),
  };
  return axiosInstance('/profileDashboard/disbursementChart', { params });
};

// --------------------------COLLECTIONS----------------------------
// Collection Totals
export const fetchCollectionTotals = (dateRange = 'Day') => {
  return axiosInstance('/profileDashboard/collectionTotals', {
    params: { dateRange },
  });
};

// Chart - General
export const fetchChartGeneral = () => {
  return axiosInstance('/profileDashboard/chartGeneral');
};

// Chart - Marriage
export const fetchChartMarriage = () => {
  return axiosInstance('/profileDashboard/chartMarriage');
};

// Chart - Burial
export const fetchChartBurial = () => {
  return axiosInstance('/profileDashboard/chartBurial');
};

// Chart - Cedula
export const fetchChartCedula = () => {
  return axiosInstance('/profileDashboard/chartCedula');
};
