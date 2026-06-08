import React, { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, initialData = null, isSubmitting = false, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setStatus(initialData.status);
      setPriority(initialData.priority || 'medium');
      setCategory(initialData.category || 'Personal');
      setDueDate(initialData.dueDate ? new Date(initialData.dueDate).toISOString().substring(0, 10) : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setCategory('Personal');
      setDueDate('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      status,
      priority,
      category,
      dueDate: dueDate || null,
    });
    if (!initialData) {
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setCategory('Personal');
      setDueDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-luxury-light-text-primary dark:text-luxury-dark-text-primary mb-1.5">
          Title
        </label>
        <input
          type="text"
          id="title"
          required
          maxLength="100"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 border border-luxury-light-border dark:border-luxury-dark-border rounded-xl bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover text-luxury-light-text-primary dark:text-luxury-dark-text-primary placeholder-luxury-light-text-secondary/40 dark:placeholder-luxury-dark-text-secondary/40 focus:outline-none focus:ring-1 focus:ring-luxury-accent focus:border-luxury-accent transition-all duration-200"
          placeholder="What needs to be done?"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-luxury-light-text-primary dark:text-luxury-dark-text-primary mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          required
          maxLength="500"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2.5 border border-luxury-light-border dark:border-luxury-dark-border rounded-xl bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover text-luxury-light-text-primary dark:text-luxury-dark-text-primary placeholder-luxury-light-text-secondary/40 dark:placeholder-luxury-dark-text-secondary/40 focus:outline-none focus:ring-1 focus:ring-luxury-accent focus:border-luxury-accent transition-all duration-200 resize-none"
          placeholder="Add details..."
        />
      </div>

      {/* Grid for Priority & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority Select pills */}
        <div>
          <label className="block text-sm font-semibold text-luxury-light-text-primary dark:text-luxury-dark-text-primary mb-2">
            Priority
          </label>
          <div className="flex gap-2">
            {['low', 'medium', 'high'].map((p) => {
              const colors = {
                low: 'bg-blue-500/10 text-blue-600 border-blue-500/20 active:bg-blue-500 active:text-white',
                medium: 'bg-amber-500/10 text-amber-600 border-amber-500/20 active:bg-amber-500 active:text-white',
                high: 'bg-red-500/10 text-red-600 border-red-500/20 active:bg-red-500 active:text-white',
              };
              const activeColors = {
                low: 'bg-blue-500 text-white border-blue-500 dark:bg-blue-500 dark:text-white',
                medium: 'bg-amber-500 text-white border-amber-500 dark:bg-amber-500 dark:text-white',
                high: 'bg-red-500 text-white border-red-500 dark:bg-red-500 dark:text-white',
              };
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all capitalize cursor-pointer ${
                    priority === p 
                      ? activeColors[p] 
                      : `${colors[p]} dark:text-luxury-dark-text-secondary dark:border-luxury-dark-border dark:bg-luxury-dark-card-hover`
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Select options */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-luxury-light-text-primary dark:text-luxury-dark-text-primary mb-1.5">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 border border-luxury-light-border dark:border-luxury-dark-border rounded-xl bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover text-luxury-light-text-primary dark:text-luxury-dark-text-primary focus:outline-none focus:ring-1 focus:ring-luxury-accent focus:border-luxury-accent transition-all duration-200"
          >
            {['Personal', 'Work', 'Urgent', 'Others'].map((cat) => (
              <option key={cat} value={cat} className="bg-luxury-light-card dark:bg-luxury-dark-card text-luxury-light-text-primary dark:text-luxury-dark-text-primary">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid for Due Date & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-semibold text-luxury-light-text-primary dark:text-luxury-dark-text-primary mb-1.5">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2.5 border border-luxury-light-border dark:border-luxury-dark-border rounded-xl bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover text-luxury-light-text-primary dark:text-luxury-dark-text-primary focus:outline-none focus:ring-1 focus:ring-luxury-accent focus:border-luxury-accent transition-all duration-200"
          />
        </div>

        {/* Status */}
        {initialData ? (
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-luxury-light-text-primary dark:text-luxury-dark-text-primary mb-1.5">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-luxury-light-border dark:border-luxury-dark-border rounded-xl bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover text-luxury-light-text-primary dark:text-luxury-dark-text-primary focus:outline-none focus:ring-1 focus:ring-luxury-accent focus:border-luxury-accent transition-all duration-250"
            >
              <option value="pending" className="bg-luxury-light-card dark:bg-luxury-dark-card text-luxury-light-text-primary dark:text-luxury-dark-text-primary">Pending</option>
              <option value="completed" className="bg-luxury-light-card dark:bg-luxury-dark-card text-luxury-light-text-primary dark:text-luxury-dark-text-primary">Completed</option>
            </select>
          </div>
        ) : (
          <div className="flex items-end justify-center pb-2.5">
            <span className="text-xs text-luxury-light-text-secondary/70 dark:text-luxury-dark-text-secondary/60">
              New tasks start as <strong className="text-luxury-accent">Pending</strong>.
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-luxury-light-border dark:border-luxury-dark-border flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-luxury-light-border dark:border-luxury-dark-border text-sm font-semibold text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:bg-luxury-light-card-hover dark:hover:bg-luxury-dark-card-hover transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !description.trim()}
          className="px-6 py-2.5 bg-gradient-to-r from-luxury-accent-hover via-luxury-accent to-luxury-mint hover:from-luxury-accent hover:to-luxury-accent-hover text-white font-bold rounded-xl disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-luxury-accent/15 cursor-pointer"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
