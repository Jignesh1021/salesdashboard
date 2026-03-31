import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Bell, User, Filter } from 'lucide-react';

const Header = () => {
  const { filters, setFilters } = useData();

  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <header className="glass-panel" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-main)', borderRadius: 'var(--radius-lg)', padding: '0.5rem 1rem', border: '1px solid var(--border-color)', width: '300px' }}>
        <Search size={18} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search customers or products..." 
          value={filters.searchQuery}
          onChange={(e) => setFilters.setSearchQuery(e.target.value)}
          style={{ background: 'transparent', border: 'none', color: '#fff', marginLeft: '0.75rem', width: '100%', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select 
            value={filters.regionFilter}
            onChange={(e) => setFilters.setRegionFilter(e.target.value)}
            style={{ 
              background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem', outline: 'none', appearance: 'none'
            }}
          >
            <option value="All">All Regions</option>
            <option value="South">South</option>
            <option value="West">West</option>
            <option value="Central">Central</option>
            <option value="East">East</option>
          </select>
          <Filter size={18} color="var(--text-muted)" />
        </div>
        
        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
        
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button onClick={() => setShowNotifs(!showNotifs)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative' }}>
            <Bell size={20} color="var(--text-secondary)" />
            <span style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-danger)', width: 8, height: 8, borderRadius: '50%' }}></span>
          </button>
          {showNotifs && (
            <div className="glass-panel" style={{ position: 'absolute', top: '150%', right: -10, width: '250px', padding: '1rem', zIndex: 100 }}>
              <h4 style={{ marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Notifications</h4>
              <p className="text-primary text-sm" style={{ marginBottom: '0.5rem' }}>✅ Connected to Data source.</p>
              <p className="text-secondary text-sm">No new alerts at this time.</p>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <div style={{ background: 'var(--accent-primary)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} color="#fff" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
