import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  ComposedChart, Line
} from 'recharts';
import { Loader2, PackageSearch } from 'lucide-react';

const Products = () => {
  const { filteredData, loading, error } = useData();

  const subCategoryData = useMemo(() => {
    const map = {};
    filteredData.forEach(item => {
      const subCat = item['Sub-Category'];
      if (!subCat) return;
      if (!map[subCat]) map[subCat] = { name: subCat, sales: 0, profit: 0, quantity: 0 };
      map[subCat].sales += (Number(item.Sales) || 0);
      map[subCat].profit += (Number(item.Profit) || 0);
      map[subCat].quantity += (Number(String(item.Quantity).split(' ')[0]) || 0);
    });
    
    return Object.values(map).sort((a, b) => b.sales - a.sales);
  }, [filteredData]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Loader2 size={48} color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <h3 style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Analyzing Products...</h3>
      </div>
    );
  }

  if (error) {
    return <div style={{ color: 'var(--accent-danger)' }}>Error loading data: {error}</div>;
  }

  return (
    <div className="products-page" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1>Product Intelligence</h1>
          <p className="text-muted">Analyze sales performance by Sub-Category and Individual Products.</p>
        </div>
        <div style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: '50%' }}>
          <PackageSearch size={24} color="var(--chart-4)" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6" style={{ marginBottom: '2rem' }}>
        
        {/* Sub-Category Performance (Composed Chart) */}
        <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: 'span 1' }}>
          <h3>Sub-Category Performance</h3>
          <p className="text-muted text-sm" style={{ marginBottom: '1.5rem' }}>Comparing Revenue (Bars) versus Sent Quantity (Line)</p>
          
          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={subCategoryData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                <YAxis yAxisId="left" stroke="var(--text-muted)" tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Bar yAxisId="left" dataKey="sales" fill="var(--chart-2)" radius={[4, 4, 0, 0]} name="Total Sales" />
                <Line yAxisId="right" type="monotone" dataKey="quantity" stroke="var(--chart-5)" strokeWidth={3} name="Items Sold" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Most Profitable Sub-Categories</h3>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Sub-Category</th>
                <th>Items Sold</th>
                <th>Revenue</th>
                <th>Profit</th>
                <th>Avg. Profit / Item</th>
              </tr>
            </thead>
            <tbody>
              {[...subCategoryData]
                .sort((a,b) => b.profit - a.profit)
                .slice(0, 10).map((sub, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500 }}>{sub.name}</td>
                  <td>{sub.quantity.toLocaleString()}</td>
                  <td style={{ fontWeight: 500 }}>${sub.sales.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  <td style={{ color: sub.profit >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                    ${sub.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    ${(sub.quantity ? (sub.profit / sub.quantity) : 0).toFixed(2)}
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

export default Products;
