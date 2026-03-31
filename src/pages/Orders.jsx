import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Loader2, ChevronLeft, ChevronRight, FileDown } from 'lucide-react';

const Orders = () => {
  const { filteredData, loading, error } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const currentData = useMemo(() => {
    const begin = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(begin, begin + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const exportCSV = () => {
    // Generate CSV string from filteredData
    if (!filteredData.length) return;
    const header = Object.keys(filteredData[0]).join(',');
    const rows = filteredData.map(obj => 
      Object.keys(obj).map(key => {
        let val = obj[key] === null || obj[key] === undefined ? '' : String(obj[key]);
        if(val.includes(',')) val = `"${val}"`;
        return val;
      }).join(',')
    ).join('\n');
    
    const csvContent = header + '\\n' + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'filtered_sales_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Loader2 size={48} color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <h3 style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading Orders...</h3>
      </div>
    );
  }

  if (error) {
    return <div style={{ color: 'var(--accent-danger)' }}>Error loading data: {error}</div>;
  }

  return (
    <div className="orders-page" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1>Orders Database</h1>
          <p className="text-muted">Browse and export detailed transaction data.</p>
        </div>
        
        <button 
          onClick={exportCSV}
          className="glass-panel card-hover"
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            padding: '0.75rem 1.25rem', color: '#fff', background: 'var(--accent-primary)',
            border: 'none', cursor: 'pointer', fontWeight: 500
          }}
        >
          <FileDown size={18} />
          Export CSV
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Region</th>
                <th>Category</th>
                <th>Product</th>
                <th>Sales</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 500, color: 'var(--accent-primary)' }}>{row['Order ID']}</td>
                    <td>{row['Order Date']}</td>
                    <td>{row['Customer Name']}</td>
                    <td>
                      <span style={{ 
                        background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', 
                        borderRadius: '1rem', fontSize: '0.875rem' 
                      }}>
                        {row['Region']}
                      </span>
                    </td>
                    <td>{row['Category']}</td>
                    <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row['Product Name']}>
                      {row['Product Name']}
                    </td>
                    <td style={{ fontWeight: 500 }}>${Number(row['Sales']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td style={{ color: Number(row['Profit']) >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)', fontWeight: 500 }}>
                      ${Number(row['Profit']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No matching orders found based on current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-sidebar)'
        }}>
          <div className="text-secondary text-sm">
            Showing <strong style={{ color: '#fff' }}>{(currentPage - 1) * rowsPerPage + 1}</strong> to <strong style={{ color: '#fff' }}>{Math.min(currentPage * rowsPerPage, filteredData.length)}</strong> of <strong style={{ color: '#fff' }}>{filteredData.length}</strong> entries
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ 
                background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
                color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                padding: '0.5rem', borderRadius: 'var(--radius-md)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', margin: '0 0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
              Page {currentPage} of {totalPages || 1}
            </div>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{ 
                background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
                color: (currentPage === totalPages || totalPages === 0) ? 'var(--text-muted)' : 'var(--text-primary)',
                padding: '0.5rem', borderRadius: 'var(--radius-md)', cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
