import React from 'react';
import { useRegisterLogic } from '../hooks/useRegisterLogic';
import { RegisterForm } from '../components/RegisterForm';

const Register: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleRegister,
  } = useRegisterLogic();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <RegisterForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
        handleRegister={handleRegister}
      />
    </div>
  );
};

export default Register;