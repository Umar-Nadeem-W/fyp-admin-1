import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'farm_owner',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle signup logic here
    console.log('Signup submitted with:', formData);
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Dark blue with logo */}
      <div className="hidden md:flex md:w-1/2 bg-blue-900 items-center justify-center">
        <h1 className="text-white text-6xl font-bold tracking-wider">MACHIRO</h1>
      </div>

      {/* Right side - White with signup form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Join us and get started today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="farm_owner"
                    name="role"
                    type="radio"
                    value="farm_owner"
                    checked={formData.role === 'farm_owner'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="farm_owner" className="ml-3 block text-sm text-gray-700">
                    Farm Owner
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="worker"
                    name="role"
                    type="radio"
                    value="worker"
                    checked={formData.role === 'worker'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="worker" className="ml-3 block text-sm text-gray-700">
                    Worker
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="employee"
                    name="role"
                    type="radio"
                    value="employee"
                    checked={formData.role === 'employee'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="employee" className="ml-3 block text-sm text-gray-700">
                    Employee
                  </label>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
