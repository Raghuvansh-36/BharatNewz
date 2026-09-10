import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      await signIn({ email, password });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-heading">
        <p className="eyebrow">Account access</p>
        <h1 id="auth-heading">Sign in to BharatNewz</h1>
        <p className="auth-intro">This form is ready for your authentication service.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button className="auth-submit" type="submit">Sign in</button>
        </form>

        {message && <p className="auth-message" role="status">{message}</p>}
      </section>
    </main>
  );
};

export default AuthPage;
