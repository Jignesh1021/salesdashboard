import { useState } from 'react';
import { Save, Bell, Shield, Palette } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="settings-page" style={{ paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Settings</h1>
        <p className="text-muted">Manage your dashboard preferences and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel" style={{ padding: '1rem', height: 'fit-content' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { id: 'general', name: 'General', icon: <Palette size={18} /> },
              { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
              { id: 'security', name: 'Security', icon: <Shield size={18} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: 'none',
                  background: activeTab === tab.id ? 'var(--bg-surface-hover)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === tab.id ? 500 : 400,
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="md:grid-cols-3 glass-panel" style={{ gridColumn: 'span 3', padding: '2rem' }}>
          {activeTab === 'general' && (
            <div>
              <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>General Settings</h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Dashboard Theme</label>
                <select style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: '#fff', outline: 'none' }}>
                  <option>Premium Dark Mode (Current)</option>
                  <option disabled>Light Mode (Coming Soon)</option>
                  <option disabled>System Default</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Default Data Range</label>
                <select style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: '#fff', outline: 'none' }}>
                  <option>All Time</option>
                  <option>Last 30 Days</option>
                  <option>Last 12 Months</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '2rem' }}>
                <button style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                  <Save size={18} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Notification Preferences</h2>
              <p className="text-secondary">Toggle the alerts you wish to receive.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                {['Daily Summary Emails', 'Large Order Alerts', 'System Updates'].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <span>{item}</span>
                    <input type="checkbox" defaultChecked={idx !== 1} style={{ width: 18, height: 18, accentColor: 'var(--accent-primary)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Security Settings</h2>
              <p className="text-secondary">These settings are simulated for data demonstration purposes.</p>
              <button style={{ background: 'transparent', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginTop: '1.5rem', fontWeight: 500 }}>
                Log out of all devices
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
