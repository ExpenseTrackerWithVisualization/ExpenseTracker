import React from 'react';
import { useExpenseContext } from '../contexts/ExpenseContext';
import { formatCurrency } from '../utils/formatUtils';

const SummaryCard = ({ title, amount, icon, className, trend, percentage }) => {
  return (
    <div className={`${className} transition-all duration-300 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg overflow-hidden transform hover:-translate-y-1`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="rounded-full bg-opacity-20 p-3">{icon}</div>
          {trend && (
            <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              <span className="mr-1">{trend > 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold mt-1 text-gray-800 dark:text-white">{formatCurrency(amount)}</p>
        {percentage !== undefined && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{percentage.toFixed(0)}% of total</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DemoDataBanner = ({ onClear }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-l-4 border-blue-500 dark:border-blue-400 p-5 mb-8 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-blue-700 dark:text-blue-300 font-semibold text-lg">Demo Mode Active</p>
            <p className="text-blue-600 dark:text-blue-400 mt-1">You're currently viewing sample data. Clear this data to begin tracking your own expenses.</p>
          </div>
        </div>
        <button 
          onClick={onClear}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 flex-shrink-0 shadow-sm hover:shadow flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear Demo Data
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { 
    totalIncome, 
    totalExpenses, 
    netBalance, 
    isDemoData, 
    clearDemoData, 
    loadDemoData, 
    transactions,
    categoryData
  } = useExpenseContext();
  
  // Calculate percentages for the cards
  const incomePercentage = totalIncome + totalExpenses === 0 ? 0 : (totalIncome / (totalIncome + totalExpenses)) * 100;
  const expensePercentage = totalIncome + totalExpenses === 0 ? 0 : (totalExpenses / (totalIncome + totalExpenses)) * 100;
  
  // Fake trend percentages - in a real app these would be calculated based on previous periods
  const incomeTrend = 5.2;
  const expenseTrend = -2.8;
  
  // Find latest transactions
  const latestTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <div className="mb-12">
      {isDemoData && <DemoDataBanner onClear={clearDemoData} />}
      
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Financial Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <SummaryCard
          title="Total Income"
          amount={totalIncome}
          className="border-l-4 border-green-500"
          trend={incomeTrend}
          percentage={incomePercentage}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <SummaryCard
          title="Total Expenses"
          amount={totalExpenses}
          className="border-l-4 border-red-500"
          trend={expenseTrend}
          percentage={expensePercentage}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <SummaryCard
          title="Net Balance"
          amount={netBalance}
          className={`border-l-4 ${netBalance >= 0 ? 'border-blue-500' : 'border-yellow-500'}`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" 
              className={`h-8 w-8 ${netBalance >= 0 ? 'text-blue-500' : 'text-yellow-500'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>
      
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top Categories</h3>
            <div className="space-y-4">
              {categoryData.slice(0, 3).map((category) => (
                <div key={category.id} className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                  <span className="text-gray-700 dark:text-gray-300 mr-2">{category.name}</span>
                  <div className="flex-1 mx-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="rounded-full h-2" 
                        style={{ 
                          width: `${Math.min(category.percentage, 100)}%`,
                          backgroundColor: category.color 
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{formatCurrency(category.amount)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Transactions</h3>
            {latestTransactions.length > 0 ? (
              <div className="space-y-3">
                {latestTransactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{transaction.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <div className={`text-sm font-medium ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">No recent transactions</p>
            )}
          </div>
        </div>
      )}
      
      {!isDemoData && transactions.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No transactions yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Start by adding your first transaction or load sample data</p>
          <button 
            onClick={loadDemoData}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors duration-200 inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Load Demo Data
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 