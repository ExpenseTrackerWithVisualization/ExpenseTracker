import React, { useState, useEffect, useRef } from 'react';
import { useExpenseContext } from '../contexts/ExpenseContext';
import { formatCurrency, formatDate } from '../utils/formatUtils';
import TransactionForm from './TransactionForm';

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const { categories } = useExpenseContext();
  const category = categories.find((cat) => cat.id === transaction.category);
  
  const confirmDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${transaction.description}"?`)) {
      console.log("Transaction item - Deleting transaction with ID:", transaction.id);
      onDelete(transaction.id);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 mb-3 overflow-hidden border-l-4 ${transaction.type === 'income' ? 'border-green-500' : 'border-red-500'}`}>
      <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className={`hidden sm:flex w-10 h-10 rounded-full flex-shrink-0 items-center justify-center ${
            transaction.type === 'income' 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          }`}>
            {transaction.type === 'income' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-gray-800 dark:text-white truncate">{transaction.description}</h3>
            <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 mt-1 gap-x-2 gap-y-1">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(transaction.date)}
              </span>
              {transaction.type === 'expense' && category && (
                <span 
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" 
                  style={{ 
                    backgroundColor: `${category.color}20`, 
                    color: category.color 
                  }}
                >
                  {category.name}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end space-x-4">
          <span className={`text-base sm:text-lg font-bold whitespace-nowrap ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => {
                console.log("Transaction item - Editing transaction:", transaction);
                onEdit(transaction);
              }}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Edit transaction"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={confirmDelete}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              aria-label="Delete transaction"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No transactions found</p>
    <p className="text-gray-500 dark:text-gray-400 mb-6">Try changing your filters or add a new transaction</p>
  </div>
);

const TransactionList = () => {
  const { transactions, deleteTransaction } = useExpenseContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { categories } = useExpenseContext();
  const transactionListRef = useRef(null);
  const [listHeight, setListHeight] = useState('calc(100vh - 30rem)');

  // Calculate the optimal height for transaction list
  useEffect(() => {
    const calculateHeight = () => {
      const exportImportContainer = document.getElementById('export-import-container');
      if (exportImportContainer) {
        const viewportHeight = window.innerHeight;
        const containerRect = exportImportContainer.getBoundingClientRect();
        const containerTop = containerRect.top;
        
        // Set a minimum height of 400px, whichever is larger
        const optimalHeight = Math.max(400, containerTop - 160);
        
        setListHeight(`${optimalHeight}px`);
      } else {
        // If container isn't found, use a default fixed height
        setListHeight('500px');
      }
    };

    // Initial calculation
    calculateHeight();
    
    // Set up a resize observer to recalculate on any layout changes
    const resizeObserver = new ResizeObserver(() => {
      calculateHeight();
    });
    
    // Observe both the transaction list and document body
    if (transactionListRef.current) {
      resizeObserver.observe(transactionListRef.current);
    }
    resizeObserver.observe(document.body);
    
    // Clean up
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Apply filters
  const filteredTransactions = transactions
    .filter((transaction) => {
      // Search by description
      if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by type
      if (filterType !== 'all' && transaction.type !== filterType) {
        return false;
      }
      
      // Filter by category
      if (filterCategory !== 'all' && transaction.category !== filterCategory) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

  const handleEdit = (transaction) => {
    console.log("TransactionList - Setting transaction for edit:", transaction);
    setEditingTransaction({...transaction}); // Create a copy to prevent unintended reference updates
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingTransaction(null);
    }, 300); // Clear after closing animation
  };

  const handleDeleteTransaction = (id) => {
    console.log("TransactionList - Deleting transaction with ID:", id);
    deleteTransaction(id);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterCategory('all');
  };

  return (
    <div className="p-0 md:p-6 h-full flex flex-col">
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-2">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          
          <div className="flex flex-row items-center justify-between sm:justify-end gap-2 sm:gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {(searchTerm || filterType !== 'all' || filterCategory !== 'all') && (
          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 p-2 sm:p-3 rounded-lg">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Filters:
              </span>
              
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                  "{searchTerm}"
                </span>
              )}
              
              {filterType !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-xs">
                  {filterType === 'income' ? 'Income' : 'Expense'}
                </span>
              )}
              
              {filterCategory !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs">
                  {categories.find(c => c.id === filterCategory)?.name || 'Category'}
                </span>
              )}
            </div>
            
            <button
              onClick={handleClearFilters}
              className="text-xs sm:text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <div 
        ref={transactionListRef}
        className="overflow-y-auto flex-1"
        style={{ maxHeight: listHeight }}
      >
        {filteredTransactions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2 px-2 sm:px-0">
            {filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onEdit={handleEdit}
                onDelete={handleDeleteTransaction}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-auto animate-fade-in">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Edit Transaction</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <TransactionForm
                editTransaction={editingTransaction}
                onClose={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList; 