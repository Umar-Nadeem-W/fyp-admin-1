import React, { useState } from 'react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    user_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contact_number: '',
    role: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isLogin && form.password !== form.confirmPassword) {
      return alert("Passwords do not match!");
    }

    const payload = isLogin
      ? { email: form.email, password: form.password }
      : {
          user_name: form.user_name,
          email: form.email,
          password: form.password,
          role: form.role, // Role is needed during signup
        };

    const endpoint = isLogin ? 'login' : 'signup';

    try {
      const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role); // Save the role ID too if needed
  
        alert(`Login successful! Role ID: ${data.user.role}`);
  
        // Redirect based on role ID
        if (data.user.role === 1) {
          // Admin
          window.location.href = '/dashboard';
        } else if (data.user.role === 2) {
          // Employee
          window.location.href = '/employeedashboard';
        } else if (data.user.role === 3) {
          // Worker
          window.location.href = '/dashboard'; // Same as admin for now
        } else if (data.user.role === 4) {
          // Farm Owner
          window.location.href = '/farmOwnerdashboard';
        } else {
          // Unknown role
          alert('Unknown role! Please contact support.');
        }
      } else {
        alert('Signup successful! You can now log in.');
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.message);
    }
  };
  

  const containerStyle = {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  };

  const leftStyle = {
    flex: 1,
    backgroundColor: '#1e3a8a',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '9rem',
    fontWeight: 'bold',
  };

  const rightStyle = {
    flex: 1,
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const formStyle = {
    width: '80%',
    maxWidth: '400px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  };

  const switchButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#1e3a8a',
    cursor: 'pointer',
    marginLeft: '8px',
  };

  const roleLabelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '1rem',
    color: '#333',
  };

  return (
    <div style={containerStyle}>
      <div style={leftStyle}>MACHIRO</div>

      <div style={rightStyle}>
        <form style={formStyle} onSubmit={handleSubmit}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>

          {!isLogin && (
            <>
              <input
                type="text"
                name="user_name"
                placeholder="Username"
                value={form.user_name}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <input
                type="text"
                name="contact_number"
                placeholder="Contact Number"
                value={form.contact_number}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          {!isLogin && (
            <>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <div style={{ marginBottom: '15px' }}>
                <label style={roleLabelStyle}>
                  <input
                    type="radio"
                    name="role"
                    value="owner" // corrected here
                    onChange={handleChange}
                    required
                  />{' '}
                  Farm Owner
                </label>
                <label style={roleLabelStyle}>
                  <input
                    type="radio"
                    name="role"
                    value="Worker"
                    onChange={handleChange}
                  />{' '}
                  Worker
                </label>
                <label style={roleLabelStyle}>
                  <input
                    type="radio"
                    name="role"
                    value="Employee"
                    onChange={handleChange}
                  />{' '}
                  Employee
                </label>
              </div>
            </>
          )}

          <button type="submit" style={buttonStyle}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

          <p style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.9rem' }}>
            {isLogin ? (
              <>
                Don't have an account?
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  style={switchButtonStyle}
                >
                  Create an Account
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  style={switchButtonStyle}
                >
                  Already have account? Login
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
