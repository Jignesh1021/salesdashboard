import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { DollarSign, TrendingUp, Package, Loader2 } from 'lucide-react';

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

const Overview = () => {
  const { filteredData, loading, error } = useData();

  const kpis = useMemo(() => {
    if (!filteredData.length) return { revenue: 0, profit: 0, orders: 0, margin: 0 };
    
    const revenue = filteredData.reduce((acc, curr) => acc + (Number(curr.Sales) || 0), 0);
    const profit = filteredData.reduce((acc, curr) => acc + (Number(curr.Profit) || 0), 0);
    const orders = new Set(filteredData.map(item => item['Order ID'])).size;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return { revenue, profit, orders, margin };
  }, [filteredData]);

  const salesByCategory = useMemo(() => {
    const map = {};
    filteredData.forEach(item => {
      const cat = item.Category || 'Unknown';
      map[cat] = (map[cat] || 0) + (Number(item.Sales) || 0);
    });
    return Object.keys(map).map(k => ({ name: k, value: map[k] })).sort((a,b) => b.value - a.value);
  }, [filteredData]);

  const profitByRegion = useMemo(() => {
    const map = {};
    filteredData.forEach(item => {
      const reg = item.Region || 'Unknown';
      map[reg] = (map[reg] || 0) + (Number(item.Profit) || 0);
    });
    return Object.keys(map).map(k => ({ name: k, value: map[k] })).sort((a,b) => b.value - a.value);
  }, [filteredData]);

  // Aggregate by month for trend
  const salesTrend = useMemo(() => {
    const map = {};
    filteredData.forEach(item => {
      let dateStr = item['Order Date'];
      if(!dateStr) return;
      
      let dateObj;
      if (typeof dateStr === 'string') {
        dateObj = new Date(dateStr);
      } else {
        dateObj = dateStr;
      }
      
      if (!isNaN(dateObj)) {
        const monthYear = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
        map[monthYear] = (map[monthYear] || 0) + (Number(item.Sales) || 0);
      }
    });
    return Object.keys(map).sort().map(k => ({ date: k, sales: map[k] }));
  }, [filteredData]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Loader2 size={48} color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <h3 style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Analyzing Superstore Data...</h3>
      </div>
    );
  }

  if (error) {
    return <div style={{ color: 'var(--accent-danger)' }}>Error loading data: {error}</div>;
  }

  return (
    <div className="overview-page" style={{ paddingBottom: '2rem' }}>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1>Dashboard Overview</h1>
          <p className="text-muted">Welcome back. Here's what's happening with your store today.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" style={{ marginBottom: '2rem' }}>
        {[
          { title: 'Total Revenue', value: `$${kpis.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: <DollarSign size={24} color="var(--chart-1)" /> },
          { title: 'Total Profit', value: `$${kpis.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: <TrendingUp size={24} color="var(--chart-3)" /> },
          { title: 'Profit Margin', value: `${kpis.margin.toFixed(1)}%`, icon: <PieChart size={24} color="var(--chart-2)" /> },
          { title: 'Total Orders', value: kpis.orders.toLocaleString(), icon: <Package size={24} color="var(--chart-5)" /> }
        ].map((kpi, idx) => (
          <div key={idx} className="glass-panel card-hover" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="text-secondary text-sm" style={{ marginBottom: '0.25rem' }}>{kpi.title}</p>
              <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{kpi.value}</h2>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Trend */}
        <div className="glass-panel lg:grid-cols-2" style={{ gridColumn: 'span 2', padding: '1.5rem' }}>
          <h3>Revenue Trend</h3>
          <p className="text-muted text-sm" style={{ marginBottom: '1.5rem' }}>Monthly sales performance</p>
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Line type="monotone" dataKey="sales" stroke="var(--chart-1)" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: 'var(--chart-1)', stroke: 'var(--bg-main)', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales By Category */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3>Revenue by Category</h3>
          <p className="text-muted text-sm" style={{ marginBottom: '1.5rem' }}>Distribution across primary categories</p>
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                  formatter={(value) => `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit by Region */}
        <div className="glass-panel" style={{ gridColumn: 'span 3', padding: '1.5rem' }}>
          <h3>Profitability by Region</h3>
          <div style={{ height: 300, marginTop: '1.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitByRegion} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                />
                <Bar dataKey="value" fill="var(--chart-3)" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Overview;
