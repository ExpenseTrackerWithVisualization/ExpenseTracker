import React, { useState } from 'react';
import { useExpenseContext } from '../contexts/ExpenseContext';

const ExportImport = () => {
  const { transactions, categories, importData } = useExpenseContext();
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const exportData = async (format) => {
    setIsExporting(true);
    
    try {
      const dataToExport = {
        transactions,
        categories,
        exportDate: new Date().toISOString(),
      };

      let content;
      let filename;
      let contentType;

      if (format === 'json') {
        content = JSON.stringify(dataToExport, null, 2);
        filename = `expense-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        contentType = 'application/json';
      } else if (format === 'csv') {
        // Create CSV header
        const csvHeader = 'Date,Description,Category,Amount,Type\n';
        
        // Convert transactions to CSV rows
        const csvRows = transactions.map(transaction => {
          return `${transaction.date},"${transaction.description}",${transaction.category},${transaction.amount},${transaction.type}`;
        }).join('\n');
        
        content = csvHeader + csvRows;
        filename = `expense-tracker-export-${new Date().toISOString().split('T')[0]}.csv`;
        contentType = 'text/csv';
      }

      // Create download link
      const blob = new Blob([content], { type: contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Show success message
      setImportSuccess(`Data exported successfully as ${format.toUpperCase()}`);
      setTimeout(() => setImportSuccess(''), 3000);
    } catch (error) {
      setImportError(`Export failed: ${error.message}`);
      setTimeout(() => setImportError(''), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    setImportError('');
    setImportSuccess('');
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        // Check if it's a JSON file
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(e.target.result);
          
          // Validate data structure
          if (!data.transactions || !Array.isArray(data.transactions)) {
            throw new Error('Invalid data format: transactions array is missing');
          }
          
          // Import the data using the context function
          importData({
            transactions: data.transactions,
            categories: data.categories || [],
          });
          
          setImportSuccess(`Data imported successfully! Added ${data.transactions.length} transactions and ${data.categories?.length || 0} categories.`);
          setImportError('');
        } else {
          throw new Error('Unsupported file format. Please use JSON files only.');
        }
      } catch (error) {
        setImportError(`Import failed: ${error.message}`);
        setImportSuccess('');
      } finally {
        setIsImporting(false);
      }
      
      // Reset file input
      event.target.value = null;
    };
    
    reader.onerror = () => {
      setImportError('Error reading file');
      setImportSuccess('');
      setIsImporting(false);
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-6">Export & Import Data</h2>
      
      <div className="flex flex-col gap-4">
        {/* Export Section */}
        <div className="bg-slate-700 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-700 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Export Your Data</h3>
          </div>
          
          <p className="text-gray-300 mb-4">
            Download your transaction history and categories in JSON or CSV format.
          </p>
          
          <div className="flex space-x-3 mb-4">
            <button 
              onClick={() => exportData('json')} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center justify-center transition-colors focus:outline-none"
              disabled={transactions.length === 0 || isExporting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              JSON
            </button>
            <button 
              onClick={() => exportData('csv')} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center justify-center transition-colors focus:outline-none"
              disabled={transactions.length === 0 || isExporting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              CSV
            </button>
          </div>
          
          {transactions.length === 0 && (
            <div className="flex items-center mb-3 p-3 bg-amber-900/40 rounded-lg text-amber-400 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>You need to add transactions before exporting data</span>
            </div>
          )}
          
          <div className="text-xs text-gray-400">
            <span className="font-medium">Tip:</span> Export regularly to backup your financial data
          </div>
        </div>
        
        {/* Import Section */}
        <div className="bg-slate-700 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-700 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Import Data</h3>
          </div>
          
          <p className="text-gray-300 mb-4">
            Restore your transaction history and categories from a previously exported JSON file.
          </p>
          
          <div className="mb-4">
            <button
              onClick={() => document.getElementById('file-upload').click()}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center justify-center transition-colors focus:outline-none w-full"
              disabled={isImporting}
            >
              <span className="mr-2">•</span>
              Select File to Import
            </button>
            <input 
              id="file-upload"
              type="file" 
              accept=".json" 
              className="hidden"
              onChange={handleImportData}
              disabled={isImporting}
            />
          </div>
          
          {importError && (
            <div className="flex items-center mb-4 p-3 bg-red-900/20 rounded-lg text-red-400 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{importError}</span>
            </div>
          )}
          
          {importSuccess && (
            <div className="flex items-center mb-4 p-3 bg-green-900/20 rounded-lg text-green-400 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{importSuccess}</span>
            </div>
          )}
          
          <div className="px-3 py-2 border border-slate-600 rounded-lg bg-slate-800/50">
            <div className="text-xs text-gray-300 font-medium mb-1">Supported Format</div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900/50 text-blue-400">
                JSON
              </span>
              <span className="mx-1 text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-400">Previously exported data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportImport; 