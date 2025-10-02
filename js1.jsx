import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserDashboard.css';

// User profile component
const UserProfile = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/users/${user.id}`, formData);
      onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isEditing) {
    return (
      <div className="user-profile">
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="user-profile-edit">
      <h2>Edit Profile</h2>
      <input
        type="text"
        value={formData.name || ''}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={formData.email || ''}
        onChange={(e) => handleInputChange('email', e.target.value)}
        placeholder="Email"
      />
      <select
        value={formData.role || ''}
        onChange={(e) => handleInputChange('role', e.target.value)}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderator</option>
      </select>
      <button type="submit">Save Changes</button>
      <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
    </form>
  );
};

// Dashboard statistics component
const DashboardStats = ({ stats }) => {
  const calculateProgress = (current, total) => {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="dashboard-stats">
      <h3>Dashboard Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Users</h4>
          <p className="stat-number">{formatNumber(stats.totalUsers)}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{width: `${calculateProgress(stats.activeUsers, stats.totalUsers)}%`}}
            ></div>
          </div>
          <span>{stats.activeUsers} active</span>
        </div>
        
        <div className="stat-card">
          <h4>Revenue</h4>
          <p className="stat-number">${formatNumber(stats.revenue)}</p>
          <span>This month</span>
        </div>
        
        <div className="stat-card">
          <h4>Orders</h4>
          <p className="stat-number">{formatNumber(stats.orders)}</p>
          <span>{stats.pendingOrders} pending</span>
        </div>
      </div>
    </div>
  );
};

// Notification component
const NotificationList = ({ notifications, onDismiss }) => {
  const groupByType = (notifs) => {
    return notifs.reduce((groups, notif) => {
      const type = notif.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(notif);
      return groups;
    }, {});
  };

  const getNotificationIcon = (type) => {
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅'
    };
    return icons[type] || '📢';
  };

  const groupedNotifications = groupByType(notifications);

  return (
    <div className="notification-list">
      <h3>Notifications</h3>
      {Object.entries(groupedNotifications).map(([type, notifs]) => (
        <div key={type} className={`notification-group ${type}`}>
          <h4>
            {getNotificationIcon(type)} {type.toUpperCase()}
          </h4>
          {notifs.map(notification => (
            <div key={notification.id} className="notification-item">
              <p>{notification.message}</p>
              <span className="notification-time">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </span>
              <button 
                onClick={() => onDismiss(notification.id)}
                className="dismiss-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Main dashboard component
const UserDashboard = () => {
  const [user, setUser] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  });
  
  const [stats, setStats] = useState({
    totalUsers: 1250,
    activeUsers: 890,
    revenue: 45200,
    orders: 324,
    pendingOrders: 12
  });
  
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'System maintenance scheduled', timestamp: new Date() },
    { id: 2, type: 'warning', message: 'Low disk space on server', timestamp: new Date() },
    { id: 3, type: 'success', message: 'Profile updated successfully', timestamp: new Date() },
    { id: 4, type: 'error', message: 'Failed to sync data', timestamp: new Date() }
  ]);

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    // Add a success notification
    setNotifications(prev => [
      ...prev,
      {
        id: Date.now(),
        type: 'success',
        message: 'Profile updated successfully!',
        timestamp: new Date()
      }
    ]);
  };

  const handleNotificationDismiss = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const refreshStats = async () => {
    // Simulate API call
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        revenue: prev.revenue + 1000,
        orders: prev.orders + 5
      }));
    }, 1000);
  };

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <h1>User Dashboard</h1>
        <button onClick={refreshStats} className="refresh-btn">
          Refresh Stats
        </button>
      </header>
      
      <div className="dashboard-content">
        <div className="left-panel">
          <UserProfile user={user} onUpdate={handleUserUpdate} />
          <NotificationList 
            notifications={notifications} 
            onDismiss={handleNotificationDismiss} 
          />
        </div>
        
        <div className="right-panel">
          <DashboardStats stats={stats} />
        </div>
      </div>
    </div>
  );
};

// Higher-order component for authentication
const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem('authToken');
          if (token) {
            // Verify token with backend
            const response = await axios.get('/api/auth/verify', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setIsAuthenticated(response.data.valid);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, []);

    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (!isAuthenticated) {
      return <div>Please log in to access the dashboard.</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

// Export the enhanced component
export default withAuth(UserDashboard);