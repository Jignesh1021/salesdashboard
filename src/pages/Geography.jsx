import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  Treemap
} from 'recharts';
import { Loader2, MapPin } from 'lucide-react';

const Geography = () => {
  const { filteredData, loading, error } = useData();

  const stateData = useMemo(() => {
    const map = {};
    filteredData.forEach(item => {
      const state = item.State;
      if (!state) return;
      if (!map[state]) map[state] = { name: state, sales: 0, profit: 0, orders: 0 };
      map[state].sales += (Number(item.Sales) || 0);
      map[state].profit += (Number(item.Profit) || 0);
      map[state].orders += 1;
    });
    
    return Object.values(map)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 15); // Top 15 states
  }, [filteredData]);



  const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Loader2 size={48} color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <h3 style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Mapping Geography...</h3>
      </div>
    );
  }

  if (error) {
    return <div style={{ color: 'var(--accent-danger)' }}>Error loading data: {error}</div>;
  }

  return (
    <div className="geography-page" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1>Geographic Details</h1>
          <p className="text-muted">Analyze performance by Region and State.</p>
        </div>
        <div style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: '50%' }}>
          <MapPin size={24} color="var(--accent-primary)" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginBottom: '2rem' }}>
        
        {/* Top States by Revenue */}
        <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
          <h3>Top 15 States by Revenue</h3>
          <p className="text-muted text-sm" style={{ marginBottom: '1.5rem' }}>Comparing Sales and Profit across highest performing states.</p>
          
          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--text-muted)" 
                  tickLine={false} 
                  axisLine={false} 
                  angle={-45} 
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                  formatter={(value, name) => [`$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, name === 'sales' ? 'Sales' : 'Profit']}
                />
                <Legend verticalAlign="top" height={36}/>
                <Bar dataKey="sales" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Total Sales" />
                <Bar dataKey="profit" fill="var(--chart-3)" radius={[4, 4, 0, 0]} name="Total Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
      
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3>State Performance Matrix</h3>
        <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
          <table>
            <thead>
              <tr>
                <th>State</th>
                <th>Total Orders</th>
                <th>Revenue</th>
                <th>Profit</th>
                <th>Profit Margin</th>
              </tr>
            </thead>
            <tbody>
              {stateData.slice(0, 10).map((state, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500 }}>{state.name}</td>
                  <td>{state.orders.toLocaleString()}</td>
                  <td style={{ fontWeight: 500 }}>${state.sales.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  <td style={{ color: state.profit >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                    ${state.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '60px', background: 'var(--bg-main)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${Math.max(0, Math.min(100, (state.profit/state.sales)*100))}%`, 
                          background: state.profit >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)', 
                          height: '100%' 
                        }}></div>
                      </div>
                      <span style={{ fontSize: '0.875rem' }}>{((state.profit/state.sales)*100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Geography;
