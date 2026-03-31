import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Package, ShoppingCart, Settings, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const routes = [
    { path: '/', name: 'Overview', icon: <LayoutDashboard size={20} /> },
    { path: '/geography', name: 'Geography', icon: <Map size={20} /> },
    { path: '/products', name: 'Products', icon: <Package size={20} /> },
    { path: '/orders', name: 'Orders', icon: <ShoppingCart size={20} /> }
  ];

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside 
      className={`glass-panel`} 
      style={{
        width: isCollapsed ? '80px' : '260px',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        borderRight: '1px solid var(--border-color)',
        borderTop: 'none',
        borderBottom: 'none',
        borderLeft: 'none',
        height: '100%',
        position: 'relative',
        zIndex: 50
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', padding: '1.5rem 1rem' }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: 32, height: 32, borderRadius: 8, 
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
            }}>
              <LayoutDashboard size={18} />
            </div>
            <h2 style={{ fontSize: '1.125rem', margin: 0, fontWeight: 700, letterSpacing: '-0.025em' }}>Nexus<span style={{ color: 'var(--accent-primary)' }}>Sales</span></h2>
          </div>
        )}
        <button 
          onClick={handleToggle}
          style={{ 
            background: 'transparent', border: 'none', color: 'var(--text-secondary)', 
            cursor: 'pointer', display: 'flex', padding: 4 
          }}
        >
          {isCollapsed ? <Menu size={24} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem' }}>
        {routes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              marginBottom: '0.5rem',
              borderRadius: 'var(--radius-md)',
              color: isActive ? '#fff' : 'var(--text-secondary)',
              background: isActive ? 'var(--bg-surface-hover)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              justifyContent: isCollapsed ? 'center' : 'flex-start'
            })}
          >
            {({ isActive }) => (
              <>
                <div style={{ color: isActive ? 'var(--accent-primary)' : 'inherit', minWidth: isCollapsed ? 'auto' : '2.5rem' }}>
                  {route.icon}
                </div>
                {!isCollapsed && <span style={{ fontWeight: isActive ? 500 : 400 }}>{route.name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <NavLink 
        to="/settings"
        style={({ isActive }) => ({
          padding: '1.5rem 1rem', 
          borderTop: '1px solid var(--border-color)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isCollapsed ? 'center' : 'flex-start', 
          color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
          textDecoration: 'none',
          background: isActive ? 'var(--bg-surface-hover)' : 'transparent',
          transition: 'all 0.2s ease'
        })}
      >
        <Settings size={20} />
        {!isCollapsed && <span style={{ marginLeft: '1rem', fontWeight: 500 }}>Settings</span>}
      </NavLink>
    </aside>
  );
};

export default Sidebar;
