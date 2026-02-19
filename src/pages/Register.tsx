import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api'; // Integrated with your api.ts

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false); // New: Loading state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

   if (!formData.email) {
  newErrors.email = 'Email is required';
   } else if (!emailRegex.test(formData.email)) {
  newErrors.email = 'Please enter a valid email address (e.g., name@domain.com)';
}
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({}); // Clear old errors

  const newErrors = validateForm();
  
  if (Object.keys(newErrors).length === 0) {
    setIsLoading(true);
    try {
      await registerUser(formData);
      alert("Registration successful!");
      navigate('/login');
    } catch (err: any) {
      console.error("Registration Error:", err);

      // Extract the message from Spring Boot's response
      const errorMessage = 
        err.response?.data?.message || // If backend returns an object
        err.response?.data ||          // If backend returns a plain string
        "Server connection failed. Please try again.";

      setErrors({ server: errorMessage });
    } finally {
      setIsLoading(false);
    }
  } else {
    setErrors(newErrors);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-2xl font-bold text-white">PortfolioAI</span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Create Your Account</h2>
          <p className="text-slate-400">Start your investment journey today</p>
        </div>

        {/* Registration Form */}
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl">
          {/* Server Side Error Message */}
          {errors.server && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center font-medium">
              {errors.server}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-900 border ${errors.fullName ? 'border-red-500' : 'border-slate-700'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                placeholder="John Doe"
              />
              {errors.fullName && <p className="mt-2 text-sm text-red-500">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-900 border ${errors.email ? 'border-red-500' : 'border-slate-700'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-900 border ${errors.password ? 'border-red-500' : 'border-slate-700'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                placeholder="At least 8 characters"
              />
              {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-900 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-700'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            {/* Terms & Conditions */}
            <div>
              <div className="flex items-start">
                <input
                  id="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 mt-1 bg-slate-900 border-slate-700 rounded text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="accept-terms" className="ml-2 block text-sm text-slate-300">
                  I agree to the <a href="#" className="text-blue-400 hover:text-blue-300">Terms and Conditions</a>
                </label>
              </div>
              {errors.terms && <p className="mt-2 text-sm text-red-500">{errors.terms}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold transition ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-blue-500/50'}`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <p className="mt-6 text-center text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;