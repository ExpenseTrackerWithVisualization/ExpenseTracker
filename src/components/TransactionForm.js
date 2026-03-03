import React, { useState, useEffect } from 'react';
import { useExpenseContext } from '../contexts/ExpenseContext';

const TransactionForm = ({ editTransaction = null, onClose }) => {
  const { addTransaction, editTransaction: updateTransaction, categories } = useExpenseContext();
  
  const initialFormState = {
    id: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'food',
    type: 'expense',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If editing, populate form with transaction data
  useEffect(() => {
    if (editTransaction) {
      console.log("Loading transaction for edit:", editTransaction);
      setFormData({
        ...editTransaction,
        amount: String(editTransaction.amount),
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (editTransaction) {
        console.log("Submitting updated transaction with ID:", formData.id);
        updateTransaction({
          ...formData,
          id: editTransaction.id, // Ensure we keep the original ID
        });
      } else {
        console.log("Submitting new transaction");
        addTransaction(formData);
      }
      
      if (!onClose) {
        // If not in modal, reset the form
        setFormData(initialFormState);
      } else {
        // If in modal, close it
        onClose();
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      alert("There was an error processing your transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b dark:border-gray-700 pb-3 sm:pb-4 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-0">
          {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        <div className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-medium ${formData.type === 'income' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
          {formData.type === 'income' ? 'Income' : 'Expense'}
        </div>
      </div>
      
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 sm:p-1.5 mb-4">
          <label className={`flex-1 flex justify-center items-center rounded-md py-1.5 sm:py-2 cursor-pointer transition-all text-xs sm:text-sm ${formData.type === 'expense' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-650'}`}>
            <input
              type="radio"
              className="sr-only"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleChange}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="font-medium">Expense</span>
          </label>
          <label className={`flex-1 flex justify-center items-center rounded-md py-1.5 sm:py-2 cursor-pointer transition-all text-xs sm:text-sm ${formData.type === 'income' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-650'}`}>
            <input
              type="radio"
              className="sr-only"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleChange}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="font-medium">Income</span>
          </label>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </div>
          <input
            type="text"
            id="description"
            name="description"
            className={`py-2.5 pl-10 pr-3 block w-full rounded-lg border ${errors.description ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'} shadow-sm dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
            placeholder="Grocery shopping, Salary, etc."
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">$</span>
          </div>
          <input
            type="number"
            id="amount"
            name="amount"
            className={`py-2.5 pl-8 pr-3 block w-full rounded-lg border ${errors.amount ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'} shadow-sm dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
            placeholder="0.00"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            type="date"
            id="date"
            name="date"
            className={`py-2.5 pl-10 pr-3 block w-full rounded-lg border ${errors.date ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'} shadow-sm dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <select
            id="category"
            name="category"
            className={`py-2.5 pl-10 pr-3 block w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all ${formData.type === 'income' ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''}`}
            value={formData.category}
            onChange={handleChange}
            disabled={formData.type === 'income'}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {formData.type === 'income' && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Categories are only applicable for expenses</p>
        )}
      </div>
      
      {/* Show the transaction ID when editing (for debugging) */}
      {editTransaction && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 border-t dark:border-gray-700 pt-3 mt-4">
          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-400 font-mono">ID: {formData.id}</span>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : editTransaction ? 'Update Transaction' : 'Add Transaction'}
        </button>
        {!editTransaction && (
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
};

export default TransactionForm; 