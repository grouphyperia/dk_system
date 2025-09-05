import React from 'react';
import LoginForm from '../components/Auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
