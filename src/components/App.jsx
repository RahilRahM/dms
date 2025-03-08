import { useState } from 'react';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import Dashboard from './Dashboard/Dashboard';
import '../styles/App.css';
import '../styles/global.css';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import { store } from '../app/store';

function AppContent() {
  const { isAuthenticated } = useSelector(state => state.auth);
  const [currentView, setCurrentView] = useState('login');

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="auth-container" style={{ backgroundColor: '#535bf2' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: 'white' }}>
        Document Management System
      </h1>
      {currentView === 'login' ? (
        <Login onSwitchToSignup={() => setCurrentView('signup')} />
      ) : (
        <Signup onSwitchToLogin={() => setCurrentView('login')} />
      )}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;