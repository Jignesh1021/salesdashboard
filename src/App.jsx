import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Overview from './pages/Overview';
import Geography from './pages/Geography';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Overview />} />
        <Route path="geography" element={<Geography />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
