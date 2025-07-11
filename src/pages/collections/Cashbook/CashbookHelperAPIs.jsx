const API_URL = import.meta.env.VITE_API_URL;

export const fetchCashbook = async (params) => {
  try {
    const token = localStorage.getItem('token');
    const url = `${API_URL}/cashbook/view`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        StartDate: params.StartDate,
        EndDate: params.EndDate,
        FundID: params.FundID,
      }),
    });

    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message || 'Failed to fetch cashbook data');
    }
    return res;
  } catch (error) {
    console.error('Error fetching cashbook:', error);
    throw error;
  }
};

export const exportCashbookToExcel = async (params) => {
  try {
    const token = localStorage.getItem('token');
    const url = `${API_URL}/cashbook/exportExcel`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        StartDate: params.StartDate,
        EndDate: params.EndDate,
        FundID: params.FundID,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to export cashbook');
    }

    // Handle Excel file download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;

    // Generate filename with date range
    const formattedStart = params.StartDate.replace(/-/g, '');
    const formattedEnd = params.EndDate.replace(/-/g, '');
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now
      .getDate()
      .toString()
      .padStart(2, '0')}_${now.getHours()}${now.getMinutes()}`;

    const fileName = `Cashbook_${formattedStart}_to_${formattedEnd}_${timestamp}.xlsx`;

    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error exporting cashbook:', error);
    throw error;
  }
};
