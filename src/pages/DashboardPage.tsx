import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FinanceDashboard } from '../components/dashboard';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.pathname === '/') {
      navigate('/overview', { replace: true });
    }
  }, [navigate, window.location.pathname]);
  return <FinanceDashboard />;
};

export default MainPage;
