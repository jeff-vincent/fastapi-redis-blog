import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Main Dashboard Component
const MetricsDashboard = () => {
  // State variables
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/metrics');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper functions
  const totalEntries = data.length;

  const uniqueAuthors = [...new Set(data.map((entry) => entry.author))].length;

  const entriesByCountry = data.reduce((acc, entry) => {
    acc[entry.country] = (acc[entry.country] || 0) + 1;
    return acc;
  }, {});

  const recentEntries = data.slice(-5).reverse(); // Last 5 entries, reversed for recent first

  // Prepare data for the line chart
  const viewsOverTimeData = data.map(entry => ({
    time: moment.unix(entry.timestamp).format('YYYY-MM-DD HH:mm'),
    count: 1,
  }));

  // Aggregate data to get counts per time unit
  const aggregatedViews = viewsOverTimeData.reduce((acc, { time }) => {
    acc[time] = (acc[time] || 0) + 1;
    return acc;
  }, {});

  const lineChartData = {
    labels: Object.keys(aggregatedViews), // X-axis: Time points
    datasets: [
      {
        label: 'Views Over Time',
        data: Object.values(aggregatedViews), // Y-axis: Count of views
        fill: false,
        backgroundColor: '#3b82f6', // Tailwind 'blue-500'
        borderColor: '#3b82f6',
        tension: 0.2,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Views: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Views',
        },
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <div className="p-6 text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Metrics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Entries */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Views</h2>
          <p className="text-3xl text-blue-500">{totalEntries}</p>
        </div>

        {/* Unique Authors */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Unique Authors</h2>
          <p className="text-3xl text-green-500">{uniqueAuthors}</p>
        </div>

        {/* Entries by Country */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Views by Country</h2>
          <ul>
            {Object.keys(entriesByCountry).map((country) => (
              <li key={country} className="text-lg">
                {country}: <span className="text-blue-500">{entriesByCountry[country]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Line Graph for Views Over Time */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Views Over Time</h2>
        <Line data={lineChartData} options={lineChartOptions} />
      </div>

      {/* Recent Entries */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Posts Recently Viewed</h2>
        <ul>
          {recentEntries.map((entry, index) => (
            <li key={index} className="mb-3">
              <div className="text-lg font-medium">{entry.title}</div>
              <div className="text-gray-500">
                {moment.unix(entry.timestamp).format('MMMM Do YYYY, h:mm:ss a')}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MetricsDashboard;
