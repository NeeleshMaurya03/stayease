// ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setUserRole(userDoc.data()?.isHost ? "host" : "guest");
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <DashboardLoader />;
  if (!user) return <Navigate to="/signin" replace />;
  
  // Redirect hosts/guests to their respective dashboards
  if (window.location.pathname === "/dashboard") {
    return <Navigate to={userRole === "host" ? "/host" : "/explore"} replace />;
  }

  return children;
};