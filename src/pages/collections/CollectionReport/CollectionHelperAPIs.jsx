const API_URL = import.meta.env.VITE_API_URL;

export const fetchCollectionReport = async (type, params) => {
  try {
    const token = localStorage.getItem('token');
    let url = `${API_URL}/collectionreport/${type}?`;
    const queryParams = new URLSearchParams();

    // Common document type parameters
    if (params.ctc !== undefined) queryParams.append('ctc', params.ctc ? 1 : 0);
    if (params.btc !== undefined) queryParams.append('btc', params.btc ? 1 : 0);
    if (params.mrc !== undefined) queryParams.append('mrc', params.mrc ? 1 : 0);
    if (params.gsi !== undefined) queryParams.append('gsi', params.gsi ? 1 : 0);
    if (params.rpt !== undefined) queryParams.append('rpt', params.rpt ? 1 : 0);
    if (params.pmt !== undefined) queryParams.append('pmt', params.pmt ? 1 : 0);

    // Type-specific parameters
    switch (type) {
      case 'daily':
        queryParams.append('date', params.date);
        break;
      case 'monthly':
        queryParams.append('month', params.month);
        queryParams.append('year', params.year);
        break;
      case 'quarterly':
        queryParams.append('quarter', params.quarter);
        queryParams.append('year', params.year);
        break;
      case 'flexible':
        queryParams.append('startdate', params.startDate);
        queryParams.append('enddate', params.endDate);
        if (params.note) queryParams.append('note', params.note);
        break;
      default:
        throw new Error('Invalid report type');
    }

    url += queryParams.toString();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message || 'Failed to fetch report');
    }
    return res;
  } catch (error) {
    console.error(`Error fetching ${type} report:`, error);
    throw error;
  }
};

// --------------------------EXCEL--------------------
export const exportCollectionReportToExcel = async (type, params) => {
  try {
    const token = localStorage.getItem('token');
    let endpoint = '';
    const queryParams = new URLSearchParams();

    // Common document type parameters
    if (params.ctc !== undefined) queryParams.append('ctc', params.ctc ? 1 : 0);
    if (params.btc !== undefined) queryParams.append('btc', params.btc ? 1 : 0);
    if (params.mrc !== undefined) queryParams.append('mrc', params.mrc ? 1 : 0);
    if (params.gsi !== undefined) queryParams.append('gsi', params.gsi ? 1 : 0);
    if (params.rpt !== undefined) queryParams.append('rpt', params.rpt ? 1 : 0);
    if (params.pmt !== undefined) queryParams.append('pmt', params.pmt ? 1 : 0);

    // Type-specific parameters and endpoints
    switch (type) {
      case 'daily':
        endpoint = '/collectionreport/dailyExcel';
        queryParams.append('date', params.date);
        break;
      case 'monthly':
        endpoint = '/collectionreport/monthlyExcel';
        queryParams.append('month', params.month);
        queryParams.append('year', params.year);
        break;
      case 'quarterly':
        endpoint = '/collectionreport/quarterlyExcel';
        queryParams.append('quarter', params.quarter);
        queryParams.append('year', params.year);
        break;
      case 'flexible':
        endpoint = '/collectionreport/flexibleExcel';
        queryParams.append('startdate', params.startdate);
        queryParams.append('enddate', params.enddate);
        if (params.note) queryParams.append('note', params.note);
        break;
      default:
        throw new Error('Invalid report type');
    }

    const url = `${API_URL}${endpoint}?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to export report');
    }

    // Handle Excel file download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;

    // Generate a more readable filename
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now
      .getDate()
      .toString()
      .padStart(2, '0')}_${now.getHours()}${now.getMinutes()}`;
    let fileName = '';

    switch (type) {
      case 'daily':
        fileName = `Daily_Report_${params.date.replace(
          /-/g,
          ''
        )}_${timestamp}.xlsx`;
        break;
      case 'monthly':
        fileName = `Monthly_Report_${params.year}${params.month
          .toString()
          .padStart(2, '0')}_${timestamp}.xlsx`;
        break;
      case 'quarterly':
        fileName = `Quarterly_Report_Q${params.quarter}_${params.year}_${timestamp}.xlsx`;
        break;
      case 'flexible':
        fileName = `Custom_Report_${params.startdate.replace(
          /-/g,
          ''
        )}_to_${params.enddate.replace(/-/g, '')}_${timestamp}.xlsx`;
        break;
    }

    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error(`Error exporting ${type} report:`, error);
    throw error;
  }
};
