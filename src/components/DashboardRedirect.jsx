// DashboardRedirect.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // You'll need to create this

export default function DashboardRedirect() {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(userRole === 'host' ? '/host' : '/explore');
  }, [userRole, navigate]);

  return null;
}