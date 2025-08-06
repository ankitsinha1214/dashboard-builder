import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import AppTest from './pages/test';
import PreviewPage from './pages/Preview/PreviewPage';
import DashboardPreview from './pages/Preview/DashboardPreview';
import DashboardManager from './components/features/builder/DashboardManager';
import "./styles/App.css" // updated import

const App = () => {
  const isAuthenticated = sessionStorage.getItem('auth') === 'true';

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/builder"
          element={isAuthenticated ? <DashboardManager /> : <Navigate to="/login" />}
        />
        <Route
          path="/test"
          element={isAuthenticated ? <AppTest /> : <Navigate to="/login" />}
        />
         <Route path="/preview/dashboard/:dashboardId" element={<DashboardPreview />} />
         <Route path="/preview/:dashboardId/:pageId" element={<PreviewPage />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/builder" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
