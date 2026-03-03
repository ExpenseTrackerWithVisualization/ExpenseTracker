import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ExpenseProvider, useExpenseContext } from './contexts/ExpenseContext';
import MainLayout from './components/MainLayout';

// Function to ensure all transactions in localStorage have valid IDs
const fixLocalStorageData = () => {
  try {
    const savedData = localStorage.getItem('expenseTrackerData');
    if (savedData) {
      const data = JSON.parse(savedData);
      
      let needsUpdate = false;
      
      // Ensure all transactions have IDs
      if (data.transactions && Array.isArray(data.transactions)) {
        data.transactions = data.transactions.map(transaction => {
          if (!transaction.id) {
            transaction.id = uuidv4();
            needsUpdate = true;
            console.log("Fixed transaction without ID:", transaction);
          }
          return transaction;
        });
      }
      
      // Save back to localStorage if changes were made
      if (needsUpdate) {
        console.log("Updating localStorage with fixed data");
        localStorage.setItem('expenseTrackerData', JSON.stringify(data));
      }
    }
  } catch (error) {
    console.error("Error fixing localStorage data:", error);
  }
};

const AppContent = () => {
  const { darkMode } = useExpenseContext();
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  return <MainLayout />;
};

function App() {
  // Fix localStorage data before rendering the app
  useEffect(() => {
    fixLocalStorageData();
  }, []);
  
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}

export default App;
