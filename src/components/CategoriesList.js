import React from 'react';
import { useExpenseContext } from '../contexts/ExpenseContext';

const CategoriesList = () => {
  const { categories, deleteCategory, transactions } = useExpenseContext();

  const handleDeleteCategory = (categoryId) => {
    // Check if category is in use
    const isCategoryInUse = transactions.some(
      transaction => transaction.category === categoryId
    );

    if (isCategoryInUse) {
      alert('Cannot delete this category as it is used by existing transactions.');
      return;
    }

    // Confirm deletion
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(categoryId);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Categories</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {categories.length} {categories.length === 1 ? 'category' : 'categories'}
        </span>
      </div>
      
      {categories.length === 0 ? (
        <div className="bg-white dark:bg-gray-700 rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No categories found</p>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first category to organize your expenses</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="h-2" style={{ backgroundColor: category.color }}></div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <span 
                    className="w-8 h-8 rounded-full mr-3 flex items-center justify-center border-2 border-white dark:border-gray-600 shadow-sm" 
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="text-white text-xs font-bold">
                      {category.name.substring(0, 1).toUpperCase()}
                    </span>
                  </span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">{category.name}</span>
                </div>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  aria-label={`Delete ${category.name} category`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="px-4 pb-4 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <span 
                  className="inline-block w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: category.color }}
                ></span>
                <span>Color: {category.color}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesList; 