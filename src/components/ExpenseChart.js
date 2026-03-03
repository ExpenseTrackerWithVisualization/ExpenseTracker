import React, { useState } from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Pie, Bar, Line, Doughnut, PolarArea } from 'react-chartjs-2';
import { useExpenseContext } from '../contexts/ExpenseContext';
import { formatCurrency } from '../utils/formatUtils';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  PointElement, 
  LineElement,
  RadialLinearScale,
  Filler
);

export const ExpensePieChart = () => {
  const { categoryData } = useExpenseContext();
  
  if (categoryData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-1">No expense data to display</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">Add some expense transactions to see a breakdown</p>
      </div>
    );
  }

  const chartData = {
    labels: categoryData.map(category => category.name),
    datasets: [
      {
        data: categoryData.map(category => category.amount),
        backgroundColor: categoryData.map(category => category.color + 'CC'),
        borderColor: categoryData.map(category => category.color),
        borderWidth: 1,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          boxWidth: 12,
          font: {
            size: 11
          }
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = categoryData[context.dataIndex]?.percentage.toFixed(1) || 0;
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
        Expense Breakdown
      </h3>
      <div className="h-64 mb-6">
        <Pie data={chartData} options={options} />
      </div>
      <div className="mt-4 space-y-2">
        {categoryData
          .sort((a, b) => b.amount - a.amount)
          .map((category) => (
            <div key={category.id} className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-650">
              <div className="flex items-center flex-1">
                <span 
                  className="w-4 h-4 rounded-full mr-2 border border-white dark:border-gray-600" 
                  style={{ backgroundColor: category.color }}
                ></span>
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{category.name}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {formatCurrency(category.amount)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {category.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export const IncomeExpenseBarChart = () => {
  const { getMonthlyData } = useExpenseContext();
  const monthlyData = getMonthlyData();
  
  if (monthlyData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-1">No monthly data to display</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">Add transactions across different months to see trends</p>
      </div>
    );
  }

  const chartData = {
    labels: monthlyData.map(data => data.label),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(data => data.income),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: monthlyData.map(data => data.expense),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          boxWidth: 12,
          font: {
            size: 11
          }
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value, 'en-US', 'USD').replace('.00', '');
          }
        }
      },
    },
  };

  // Calculate net savings for each month
  const monthlySavings = monthlyData.map(month => ({
    month: month.label,
    net: month.income - month.expense,
    percentage: month.income > 0 ? ((month.income - month.expense) / month.income) * 100 : 0
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        Monthly Trends
      </h3>
      <div className="h-64 mb-6">
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Monthly Savings</h4>
        <div className="space-y-2">
          {monthlySavings.slice(-3).reverse().map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.month}</span>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.net >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(Math.abs(item.percentage), 100)}%` }}
                  ></div>
                </div>
              </div>
              <span className={`text-sm font-medium ${item.net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(item.net)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SpendingTrendsLineChart = () => {
  const { getMonthlyData } = useExpenseContext();
  const monthlyData = getMonthlyData();
  
  if (monthlyData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3m0 0l3 3m-3-3v7m6-6v6m-6 0h6" />
        </svg>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-1">No trend data to display</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">Add transactions across different months to see spending trends</p>
      </div>
    );
  }

  const chartData = {
    labels: monthlyData.map(data => data.label),
    datasets: [
      {
        label: 'Total Spending',
        data: monthlyData.map(data => data.expense),
        fill: true,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgba(239, 68, 68, 1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Total Income',
        data: monthlyData.map(data => data.income),
        fill: true,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Net Balance',
        data: monthlyData.map(data => data.income - data.expense),
        fill: false,
        borderColor: 'rgba(59, 130, 246, 1)',
        borderDash: [5, 5],
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Month',
          color: '#6B7280',
          font: {
            size: 12,
            weight: 'normal'
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value, 'en-US', 'USD').replace('.00', '');
          }
        },
        title: {
          display: true,
          text: 'Amount',
          color: '#6B7280',
          font: {
            size: 12,
            weight: 'normal'
          }
        }
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
        Spending & Income Trends
      </h3>
      <div className="h-64 mb-4">
        <Line data={chartData} options={options} />
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-blue-800 dark:text-blue-200">
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Tip: Hover over data points to see exact values for each month
        </p>
      </div>
    </div>
  );
};

export const CategoryDoughnutChart = () => {
  const { categoryData } = useExpenseContext();
  
  if (categoryData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-1">No category data to display</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">Add expense transactions to see a category breakdown</p>
      </div>
    );
  }

  const chartData = {
    labels: categoryData.map(category => category.name),
    datasets: [
      {
        data: categoryData.map(category => category.amount),
        backgroundColor: categoryData.map(category => category.color + 'CC'),
        borderColor: categoryData.map(category => category.color),
        borderWidth: 1,
        hoverOffset: 8,
        cutout: '70%'
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = categoryData[context.dataIndex]?.percentage.toFixed(1) || 0;
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
  };

  // Calculate total expenses
  const totalExpenses = categoryData.reduce((acc, category) => acc + category.amount, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
        Category Distribution
      </h3>
      <div className="relative h-64 mb-6">
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalExpenses)}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {categoryData
          .sort((a, b) => b.amount - a.amount)
          .map((category) => (
            <div 
              key={category.id} 
              className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              <span 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: category.color }}
              ></span>
              <span className="text-xs text-gray-600 dark:text-gray-300 truncate mr-1">{category.name}</span>
              <span className="text-xs font-medium text-gray-900 dark:text-gray-100 ml-auto">{category.percentage.toFixed(0)}%</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export const MonthlyComparisonChart = () => {
  const { getMonthlyData } = useExpenseContext();
  const monthlyData = getMonthlyData();
  
  if (monthlyData.length < 2) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-1">Insufficient data for comparison</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">Add transactions across at least 2 different months</p>
      </div>
    );
  }

  // Get only the last 4 months of data
  const recentMonths = monthlyData.slice(-4);
  
  // Calculate month-over-month changes
  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const momChanges = recentMonths.map((month, index, months) => {
    if (index === 0) return { income: 0, expense: 0, savings: 0 };
    
    const prevMonth = months[index - 1];
    
    return {
      income: calculateChange(month.income, prevMonth.income),
      expense: calculateChange(month.expense, prevMonth.expense),
      savings: calculateChange(
        month.income - month.expense, 
        prevMonth.income - prevMonth.expense
      )
    };
  });

  const chartData = {
    labels: recentMonths.map(data => data.label),
    datasets: [
      {
        label: 'Income',
        data: recentMonths.map(data => data.income),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: recentMonths.map(data => data.expense),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Savings',
        data: recentMonths.map(data => data.income - data.expense),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value)}`;
          },
          afterBody: function(context) {
            if (context.length === 0 || context[0].dataIndex === 0) return null;
            
            const datasetIndex = context[0].datasetIndex;
            const dataIndex = context[0].dataIndex;
            
            let change = 0;
            if (datasetIndex === 0) change = momChanges[dataIndex].income;
            else if (datasetIndex === 1) change = momChanges[dataIndex].expense;
            else if (datasetIndex === 2) change = momChanges[dataIndex].savings;
            
            const sign = change >= 0 ? '+' : '';
            return [`Month-over-month: ${sign}${change.toFixed(1)}%`];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value, 'en-US', 'USD').replace('.00', '');
          }
        }
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        Monthly Comparison
      </h3>
      <div className="h-64 mb-4">
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-4">
        {recentMonths.slice(-3).map((month, index) => {
          const currentIndex = recentMonths.length - 3 + index;
          if (currentIndex === 0) return null;
          
          const change = momChanges[currentIndex];
          
          return (
            <div key={month.label} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{month.label}</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-300">Income</span>
                  <span className={`text-xs font-medium ${change.income >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {change.income >= 0 ? '+' : ''}{change.income.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-300">Expenses</span>
                  <span className={`text-xs font-medium ${change.expense <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {change.expense >= 0 ? '+' : ''}{change.expense.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-300">Savings</span>
                  <span className={`text-xs font-medium ${change.savings >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {change.savings >= 0 ? '+' : ''}{change.savings.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ExpenseChart = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Tab options
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'trends', label: 'Trends' },
    { id: 'categories', label: 'Categories' },
    { id: 'comparison', label: 'Comparison' }
  ];
  
  return (
    <div className="p-0 md:p-6">
      {/* Tabs */}
      <div className="mb-6 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 w-full overflow-x-auto whitespace-nowrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded-md transition-all flex-shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpensePieChart />
            <IncomeExpenseBarChart />
          </div>
        )}
        
        {activeTab === 'trends' && (
          <div className="grid grid-cols-1 gap-6">
            <SpendingTrendsLineChart />
          </div>
        )}
        
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpensePieChart />
            <CategoryDoughnutChart />
          </div>
        )}
        
        {activeTab === 'comparison' && (
          <div className="grid grid-cols-1 gap-6">
            <MonthlyComparisonChart />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart; 