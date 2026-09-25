import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-luxury-light-card dark:bg-luxury-dark-card p-8 rounded-2xl shadow-xl border border-luxury-light-border dark:border-luxury-dark-border transition-all luxury-jade-glow animate-fade-in-up">
      <div className="flex flex-col items-center">
        {/* Luxury Brand Emblem */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <img src="/task.png" alt="image"className="w-10 h-10"/>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight luxury-text-gradient">
          Create account
        </h2>
        <p className="mt-2 text-center text-sm text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary">
          Join Task Management and start managing your priorities
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-luxury-light-text-primary dark:text-luxury-dark-text-primary mb-1.5">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="appearance-none block w-full px-4 py-3 border border-luxury-light-border dark:border-luxury-dark-border rounded-xl placeholder-luxury-light-text-secondary/40 dark:placeholder-luxury-dark-text-secondary/40 bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover text-luxury-light-text-primary dark:text-luxury-dark-text-primary focus:outline-none focus:ring-1 focus:ring-luxury-accent focus:border-luxury-accent transition-all duration-200"
              placeholder="Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-luxury-light-text-primary dark:text-luxury-dark-text-primary mb-1.5">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="appearance-none block w-full px-4 py-3 border border-luxury-light-border dark:border-luxury-dark-border rounded-xl placeholder-luxury-light-text-secondary/40 dark:placeholder-luxury-dark-text-secondary/40 bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover text-luxury-light-text-primary dark:text-luxury-dark-text-primary focus:outline-none focus:ring-1 focus:ring-luxury-accent focus:border-luxury-accent transition-all duration-200"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-luxury-light-text-primary dark:text-luxury-dark-text-primary mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength="6"
              value={formData.password}
              onChange={handleChange}
              className="appearance-none block w-full px-4 py-3 border border-luxury-light-border dark:border-luxury-dark-border rounded-xl placeholder-luxury-light-text-secondary/40 dark:placeholder-luxury-dark-text-secondary/40 bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover text-luxury-light-text-primary dark:text-luxury-dark-text-primary focus:outline-none focus:ring-1 focus:ring-luxury-accent focus:border-luxury-accent transition-all duration-200"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-luxury-light-text-primary dark:text-luxury-dark-text-primary mb-1.5">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength="6"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="appearance-none block w-full px-4 py-3 border border-luxury-light-border dark:border-luxury-dark-border rounded-xl placeholder-luxury-light-text-secondary/40 dark:placeholder-luxury-dark-text-secondary/40 bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover text-luxury-light-text-primary dark:text-luxury-dark-text-primary focus:outline-none focus:ring-1 focus:ring-luxury-accent focus:border-luxury-accent transition-all duration-200"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-luxury-accent-hover via-luxury-accent to-luxury-mint hover:from-luxury-accent hover:to-luxury-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-luxury-accent/15 cursor-pointer"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Sign up'}
          </button>
        </div>
        
        <div className="text-center text-sm">
          <span className="text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary">Already have an account? </span>
          <Link to="/login" className="font-semibold text-luxury-accent hover:text-luxury-accent-hover transition-colors">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
