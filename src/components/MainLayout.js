import React, { useState } from 'react';
import Header from './Header';
import Dashboard from './Dashboard';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import ExpenseChart from './ExpenseChart';
import ExportImport from './ExportImport';
import CategoryForm from './CategoryForm';
import CategoriesList from './CategoriesList';

const FloatingActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-xl flex items-center justify-center z-20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      aria-label="Add new transaction"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  );
};

const SectionTitle = ({ title, actionButton }) => (
  <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
    <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white flex items-center">
      <span className="w-2 h-8 bg-blue-600 rounded-md mr-3 hidden md:block"></span>
      {title}
    </h2>
    {actionButton && (
      <div>{actionButton}</div>
    )}
  </div>
);

const MainLayout = () => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions', 'categories', 'charts'

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Dashboard />

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8 w-full px-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1.5 flex flex-col sm:flex-row w-full sm:w-auto space-y-1 sm:space-y-0 sm:space-x-1">
            <button 
              onClick={() => handleTabChange('transactions')}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'transactions' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Transactions
            </button>
            <button 
              onClick={() => handleTabChange('categories')}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'categories' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Categories
            </button>
            <button 
              onClick={() => handleTabChange('charts')}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'charts' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Charts
            </button>
          </div>
        </div>
        
        {/* Transaction Management Section */}
        {activeTab === 'transactions' && (
          <>
            <SectionTitle 
              title="Transaction Manager" 
              actionButton={
                <button
                  onClick={() => setIsTransactionModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Transaction
                </button>
              }
            />
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
              <div className="xl:col-span-2 flex flex-col">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex-1 flex flex-col">
                  <TransactionList />
                </div>
              </div>
              
              <div className="xl:sticky xl:top-4 space-y-6 flex flex-col">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex-shrink-0">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Quick Add
                  </h3>
                  <TransactionForm compact={true} />
                </div>
                
                <div id="export-import-container" className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex-shrink-0">
                  <ExportImport />
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Categories Section */}
        {activeTab === 'categories' && (
          <>
            <SectionTitle 
              title="Categories Management" 
              actionButton={
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Category
                </button>
              }
            />
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-12">
              <CategoriesList />
            </div>
          </>
        )}
        
        {/* Charts Section */}
        {activeTab === 'charts' && (
          <>
            <SectionTitle title="Financial Analytics" />
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-12">
              <ExpenseChart />
            </div>
          </>
        )}
      </main>
      
      <FloatingActionButton onClick={() => setIsTransactionModalOpen(true)} />
      
      {/* Transaction Modal */}
      {isTransactionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100 opacity-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Add Transaction</h3>
              <button 
                onClick={() => setIsTransactionModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <TransactionForm onClose={() => setIsTransactionModalOpen(false)} />
          </div>
        </div>
      )}
      
      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100 opacity-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Add Category</h3>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <CategoryForm onClose={() => setIsCategoryModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout; 