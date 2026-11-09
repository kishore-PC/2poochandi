import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LangProvider } from './context/LangContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Complaint } from './pages/Complaint';
import { Admin } from './pages/Admin';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/complaint" element={<Complaint />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </LangProvider>
  );
}
