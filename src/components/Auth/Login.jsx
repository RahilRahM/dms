import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailed, validateCredentials } from '../../features/auth/authSlice';
import '../../styles/Auth.css';

const Login = ({ onSwitchToSignup }) => {
  const dispatch = useDispatch();
  const { error: reduxError } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    setError('');
    
    if (validateCredentials(formData)) {
      dispatch(loginSuccess({ 
        username: formData.username,
        role: 'admin'
      }));
    } else {
      dispatch(loginFailed('Invalid credentials'));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="auth-form">
      {error && <div className="error-message">{error}</div>}
      {reduxError && <div className="error-message">{reduxError}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Log In
        </button>
      </form>

      <p className="auth-switch">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignup} className="switch-btn">
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;