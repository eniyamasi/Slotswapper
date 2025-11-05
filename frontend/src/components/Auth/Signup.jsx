import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '32px',
          fontWeight: 'bold'
        }}>
          ✨ Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label>👤 Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label>📧 Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label>🔒 Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Enter your password (min 6 characters)"
            />
          </div>
          {error && (
            <div style={{ 
              color: '#f44336', 
              marginBottom: '20px', 
              padding: '12px',
              background: '#ffebee',
              borderRadius: '8px',
              border: '1px solid #f44336'
            }}>
              ⚠️ {error}
            </div>
          )}
          <button type="submit" style={{ width: '100%', marginBottom: '20px' }}>
            Sign Up
          </button>
          <Link to="/login" style={{ 
            display: 'block', 
            textAlign: 'center',
            color: '#667eea',
            fontWeight: '500'
          }}>
            Already have an account? Log in →
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;

