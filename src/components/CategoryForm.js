import React, { useState } from 'react';
import { useExpenseContext } from '../contexts/ExpenseContext';

const CategoryForm = ({ onClose }) => {
  const { addCategory, categories } = useExpenseContext();
  const [formData, setFormData] = useState({
    name: '',
    color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'), // Random color
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (categories.some(cat => cat.name.toLowerCase() === formData.name.toLowerCase())) {
      newErrors.name = 'Category with this name already exists';
    }
    
    if (!formData.color.match(/^#[0-9A-F]{6}$/i)) {
      newErrors.color = 'Please enter a valid hex color code';
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
    
    setTimeout(() => {
      addCategory(formData);
      setIsSubmitting(false);
      
      if (onClose) {
        onClose();
      }
    }, 500); // Simulating API call delay
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
      </div>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className={`input-field w-full ${errors.name ? 'border-red-500' : ''}`}
          placeholder="Food, Transportation, etc."
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Color
        </label>
        <div className="flex space-x-2">
          <input
            type="color"
            id="color"
            name="color"
            className="h-10 w-10 cursor-pointer border border-gray-300 rounded"
            value={formData.color}
            onChange={handleChange}
          />
          <input
            type="text"
            aria-label="Color hex code"
            className={`input-field flex-1 ${errors.color ? 'border-red-500' : ''}`}
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>
        {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color}</p>}
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Add Category'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm; 