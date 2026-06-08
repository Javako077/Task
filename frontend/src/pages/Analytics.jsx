import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/tasks/analytics');
      setStats(response.data);
    } catch (err) {
      toast.error('Failed to load analytics data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <svg className="animate-spin h-10 w-10 text-luxury-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm font-semibold text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary">Analyzing your productivity...</span>
      </div>
    );
  }

  if (!stats) return null;

  // Pie chart computations
  const categoryTotals = Object.values(stats.categoryBreakdown);
  const totalCategories = categoryTotals.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8 animate-fade-in-up w-full pb-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-luxury-light-text-primary dark:text-luxury-dark-text-primary">
          Productivity Insights 📊
        </h1>
        <p className="text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary mt-1.5 text-base">
          Detailed metrics and breakdown of your task management efficiency.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Tasks */}
        <div className="bg-luxury-light-card dark:bg-luxury-dark-card border border-luxury-light-border dark:border-luxury-dark-border p-5 rounded-2xl shadow-sm luxury-jade-glow transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary uppercase tracking-wider">Total Tasks</span>
            <div className="p-2 bg-luxury-accent/10 dark:bg-luxury-accent/5 text-luxury-accent rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-luxury-light-text-primary dark:text-luxury-dark-text-primary">{stats.total}</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-luxury-light-card dark:bg-luxury-dark-card border border-luxury-light-border dark:border-luxury-dark-border p-5 rounded-2xl shadow-sm luxury-jade-glow transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary uppercase tracking-wider">Completed</span>
            <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-500 rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{stats.completed}</span>
            <span className="text-xs text-luxury-light-text-secondary/70 dark:text-luxury-dark-text-secondary/70">done</span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-luxury-light-card dark:bg-luxury-dark-card border border-luxury-light-border dark:border-luxury-dark-border p-5 rounded-2xl shadow-sm luxury-jade-glow transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary uppercase tracking-wider">Pending</span>
            <div className="p-2 bg-amber-500/10 dark:bg-amber-500/5 text-amber-500 rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-500">{stats.pending}</span>
            <span className="text-xs text-luxury-light-text-secondary/70 dark:text-luxury-dark-text-secondary/70">active</span>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="bg-luxury-light-card dark:bg-luxury-dark-card border border-luxury-light-border dark:border-luxury-dark-border p-5 rounded-2xl shadow-sm luxury-jade-glow transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary uppercase tracking-wider">Overdue</span>
            <div className="p-2 bg-rose-500/10 dark:bg-rose-500/5 text-rose-500 rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${stats.overdue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-luxury-light-text-primary dark:text-luxury-dark-text-primary'}`}>{stats.overdue}</span>
            <span className="text-xs text-luxury-light-text-secondary/70 dark:text-luxury-dark-text-secondary/70">over due date</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion Progress Gauge */}
        <div className="lg:col-span-1 bg-luxury-light-card dark:bg-luxury-dark-card border border-luxury-light-border dark:border-luxury-dark-border p-6 rounded-2xl shadow-sm luxury-jade-glow flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold text-luxury-light-text-primary dark:text-luxury-dark-text-primary w-full text-left mb-6">
            Efficiency Score
          </h3>
          
          <div className="relative flex items-center justify-center w-40 h-40">
            {/* SVG Circle Gauge */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="65"
                className="stroke-luxury-light-border dark:stroke-luxury-dark-border/40"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="65"
                className="stroke-luxury-accent transition-all duration-1000 ease-out"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 65}
                strokeDashoffset={2 * Math.PI * 65 * (1 - stats.efficiencyScore / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-luxury-light-text-primary dark:text-luxury-dark-text-primary">{stats.efficiencyScore}%</span>
              <span className="text-[10px] font-bold text-luxury-light-text-secondary/70 dark:text-luxury-dark-text-secondary/70 uppercase tracking-widest mt-1">Completed</span>
            </div>
          </div>
          
          <p className="text-sm text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary mt-6 max-w-xs">
            {stats.efficiencyScore >= 80 
              ? 'Excellent job! You are highly productive and keeping up with your goals.'
              : stats.efficiencyScore >= 50
                ? 'Good progress! Keep completing tasks to reach the top efficiency bracket.'
                : stats.total > 0
                  ? 'Keep going! Organizing and ticking off tasks daily will boost your efficiency.'
                  : 'Add and complete tasks to start calculating your score!'}
          </p>
        </div>

        {/* Priorities & Categories Breakdowns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priorities Bar Chart */}
          <div className="bg-luxury-light-card dark:bg-luxury-dark-card border border-luxury-light-border dark:border-luxury-dark-border p-6 rounded-2xl shadow-sm luxury-jade-glow">
            <h3 className="text-lg font-bold text-luxury-light-text-primary dark:text-luxury-dark-text-primary mb-6">
              Tasks by Priority
            </h3>
            
            <div className="space-y-4">
              {['high', 'medium', 'low'].map((p) => {
                const count = stats.priorityBreakdown[p] || 0;
                const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                
                const barColors = {
                  high: 'bg-red-500',
                  medium: 'bg-amber-500',
                  low: 'bg-blue-500',
                };
                
                return (
                  <div key={p} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold capitalize text-luxury-light-text-primary dark:text-luxury-dark-text-primary flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${barColors[p]}`} />
                        {p}
                      </span>
                      <span className="font-mono text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary">
                        {count} tasks ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-luxury-light-border/40 dark:bg-luxury-dark-border/20 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${barColors[p]} rounded-full transition-all duration-1000`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Categories Chart */}
          <div className="bg-luxury-light-card dark:bg-luxury-dark-card border border-luxury-light-border dark:border-luxury-dark-border p-6 rounded-2xl shadow-sm luxury-jade-glow">
            <h3 className="text-lg font-bold text-luxury-light-text-primary dark:text-luxury-dark-text-primary mb-6">
              Tasks by Category
            </h3>

            {totalCategories === 0 ? (
              <div className="text-center py-6 text-sm text-luxury-light-text-secondary/60 dark:text-luxury-dark-text-secondary/50">
                No categorized tasks to show.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Horizontal Category Bars */}
                <div className="space-y-3.5">
                  {Object.entries(stats.categoryBreakdown).map(([cat, val]) => {
                    const pct = totalCategories > 0 ? Math.round((val / totalCategories) * 100) : 0;
                    const catColors = {
                      Personal: 'bg-teal-500',
                      Work: 'bg-indigo-500',
                      Urgent: 'bg-rose-500',
                      Others: 'bg-purple-500',
                    };
                    
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-luxury-light-text-primary dark:text-luxury-dark-text-primary">{cat}</span>
                          <span className="text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary">{val} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-luxury-light-border/40 dark:bg-luxury-dark-border/20 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${catColors[cat] || 'bg-slate-400'} rounded-full`} 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pie/Donut Chart Mock utilizing CSS Gradients */}
                <div className="flex justify-center">
                  <div className="relative w-36 h-36 rounded-full border-4 border-luxury-light-border dark:border-luxury-dark-border/40 bg-gradient-to-tr from-luxury-accent/20 to-luxury-mint/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-luxury-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="absolute bottom-2.5 text-[10px] font-bold text-luxury-light-text-secondary/70 dark:text-luxury-dark-text-secondary/60 uppercase tracking-widest">
                      Distributions
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
