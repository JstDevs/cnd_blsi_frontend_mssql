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

export const fetchDisbursementCounts = (options = {}) => {
  const {
    dateRange = 'Day',
    aparType = 'Disbursement Voucher',
    startDate,
    endDate,
    selectedDepartmentID,
  } = options;

  const params = {
    dateRange,
    aparType,
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(selectedDepartmentID && { selectedDepartmentID }),
  };

  return axiosInstance('/profileDashboard/disbursementCounts', { params });
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
export const fetchDisbursementChart = (options = {}) => {
  const {
    dateRange = 'Year',
    selectedDepartmentID = null,
    startDate,
    endDate,
  } = options;

  const params = {
    dateRange,
    ...(selectedDepartmentID && { selectedDepartmentID }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  return axiosInstance('/profileDashboard/disbursementChart', { params });
};

// Fetch raw disbursement vouchers list (used as a fallback to compute counts)
export const fetchDisbursementList = (options = {}) => {
  const { startDate, endDate, selectedDepartmentID } = options;
  const params = {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(selectedDepartmentID && { selectedDepartmentID }),
  };
  return axiosInstance('/disbursementVoucher', { params });
};

// --------------------------COLLECTIONS----------------------------
// Collection Totals
// Accepts either a simple dateRange string OR an options object:
// - string: 'Day' | 'Month' | 'Year'
// - object: { dateRange?, startDate?, endDate?, categories?[] }
export const fetchCollectionTotals = (options = 'Day') => {
  let params = {};

  if (typeof options === 'string') {
    params.dateRange = options;
  } else if (options && typeof options === 'object') {
    const {
      dateRange = 'Day',
      startDate,
      endDate,
      categories,
      ...rest
    } = options;

    params.dateRange = dateRange;

    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (Array.isArray(categories) && categories.length > 0) {
      params.categories = categories.join(',');
    }

    // Allow passing any additional filter fields if the API supports them
    Object.assign(params, rest);
  } else {
    params.dateRange = 'Day';
  }

  return axiosInstance('/profileDashboard/collectionTotals', {
    params,
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
