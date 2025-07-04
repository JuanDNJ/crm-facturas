import React from 'react';
import { useLoginLogic } from '../hooks/useLoginLogic';
import { LoginForm } from '../components/LoginForm';

const Login: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleLogin,
  } = useLoginLogic();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
        handleLogin={handleLogin}
      />
    </div>
  );
};

export default Login;