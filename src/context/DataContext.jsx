import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { parseISO, isWithinInterval } from 'date-fns';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Global Filters
  const [regionFilter, setRegionFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Papa.parse('/superstore_sales.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        setData(results.data);
        setLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setLoading(false);
      }
    });
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      let keep = true;

      // Region filter
      if (regionFilter !== 'All' && item.Region !== regionFilter) keep = false;

      // Category filter
      if (categoryFilter !== 'All' && item.Category !== categoryFilter) keep = false;

      // Search filter (Customer Name or Order ID)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const customerMatch = item['Customer Name']?.toLowerCase().includes(query);
        const orderMatch = item['Order ID']?.toLowerCase().includes(query);
        const productMatch = item['Product Name']?.toLowerCase().includes(query);
        if (!customerMatch && !orderMatch && !productMatch) keep = false;
      }

      // Date Range Filter
      if (dateRange.start && dateRange.end && item['Order Date']) {
        try {
          // Some dates might be DD/MM/YYYY or YYYY-MM-DD, papaparse dynamic typing might miss dates if they vary
          // We will assume string if not parsed properly
          const rowDate = typeof item['Order Date'] === 'string' ? new Date(item['Order Date']) : item['Order Date'];
          if (rowDate) {
            keep = keep && rowDate >= new Date(dateRange.start) && rowDate <= new Date(dateRange.end);
          }
        } catch(e) { /* ignore parse errors */ }
      }

      return keep;
    });
  }, [data, regionFilter, categoryFilter, dateRange, searchQuery]);

  return (
    <DataContext.Provider value={{
      data, 
      filteredData, 
      loading, 
      error,
      filters: { regionFilter, categoryFilter, dateRange, searchQuery },
      setFilters: { setRegionFilter, setCategoryFilter, setDateRange, setSearchQuery }
    }}>
      {children}
    </DataContext.Provider>
  );
};
