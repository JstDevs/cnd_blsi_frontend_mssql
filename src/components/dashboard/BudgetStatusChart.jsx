import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function BudgetStatusChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Mock data for departments and their budget utilization
    const data = {
      labels: [
        'Office of the Mayor',
        'Accounting Department',
        'Treasury Department',
        'IT Department',
        'Engineering Department',
        'Health Department'
      ],
      datasets: [
        {
          label: 'Budget Utilization',
          data: [75, 65, 80, 60, 85, 70],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',   // primary-500
            'rgba(16, 185, 129, 0.8)',   // success-500
            'rgba(245, 158, 11, 0.8)',   // warning-500
            'rgba(239, 68, 68, 0.8)',    // error-500
            'rgba(99, 102, 241, 0.8)',   // indigo-500
            'rgba(236, 72, 153, 0.8)',   // pink-500
          ],
          borderWidth: 0,
        }
      ]
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Utilization: ${context.raw}%`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Utilization (%)'
            },
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
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

export default BudgetStatusChart;