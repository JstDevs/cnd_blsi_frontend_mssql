import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function RevenueChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Mock data for the chart
    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue',
          data: [1200000, 1500000, 1300000, 1800000, 1600000, 2000000],
          borderColor: 'rgb(59, 130, 246)', // primary-500
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
        },
        {
          label: 'Expenditure',
          data: [1000000, 1300000, 1100000, 1500000, 1400000, 1700000],
          borderColor: 'rgb(239, 68, 68)', // error-500
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
        },
      ],
    };

    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return new Intl.NumberFormat('en-PH', {
                  style: 'currency',
                  currency: 'PHP',
                  maximumSignificantDigits: 3,
                  notation: 'compact',
                }).format(value);
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        elements: {
          line: {
            tension: 0.4,
          },
        },
      },
    };

    // Create chart
    if (chartRef.current) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      chartInstance.current = new Chart(chartRef.current, config);
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default RevenueChart;