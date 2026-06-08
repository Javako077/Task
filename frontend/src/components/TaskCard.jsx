import React from 'react';

const TaskCard = ({ task, onDelete, onToggleStatus, onEdit, processing }) => {
  const isCompleted = task.status === 'completed';
  const hasDueDate = !!task.dueDate;
  
  // Calculate if overdue
  const isOverdue = React.useMemo(() => {
    if (!hasDueDate || isCompleted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    return due < today;
  }, [task.dueDate, isCompleted, hasDueDate]);

  // Color config for priority tags
  const priorityStyles = {
    high: 'bg-red-500/10 text-red-600 dark:bg-red-500/5 dark:text-red-400 border-red-500/20',
    medium: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/5 dark:text-amber-500 border-amber-500/20',
    low: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/5 dark:text-blue-400 border-blue-500/20',
  };

  // Color config for category tags
  const categoryStyles = {
    Personal: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/5 dark:text-teal-400 border-teal-500/20',
    Work: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/5 dark:text-indigo-400 border-indigo-500/20',
    Urgent: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/5 dark:text-rose-500 border-rose-500/20',
    Others: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/5 dark:text-purple-400 border-purple-500/20',
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 relative group flex flex-col justify-between ${
      isCompleted 
        ? 'bg-luxury-light-card-hover/40 border-luxury-light-border dark:bg-luxury-dark-card-hover/20 dark:border-luxury-dark-border/40 opacity-75' 
        : `bg-luxury-light-card border-luxury-light-border dark:bg-luxury-dark-card dark:border-luxury-dark-border shadow-sm hover:-translate-y-1 ${
            isOverdue 
              ? 'border-red-500/30 dark:border-red-500/30 shadow-red-500/5 shadow-md' 
              : 'hover:border-luxury-accent/30 dark:hover:border-luxury-accent/30 hover:shadow-md'
          }`
    } luxury-jade-glow-hover`}>
      {/* Absolute Loading Overlay */}
      {processing && (
        <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 rounded-2xl flex items-center justify-center backdrop-blur-[1px] z-10 transition-all">
          <svg className="animate-spin h-7 w-7 text-luxury-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      <div>
        {/* Header Tags (Category & Priority) */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
            categoryStyles[task.category] || categoryStyles.Personal
          }`}>
            {task.category || 'Personal'}
          </span>
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border flex items-center gap-1 ${
            priorityStyles[task.priority] || priorityStyles.medium
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              task.priority === 'high' ? 'bg-red-500 animate-pulse' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
            }`} />
            {task.priority || 'medium'}
          </span>
        </div>

        {/* Task Title & Status Toggle */}
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleStatus(task._id, isCompleted ? 'pending' : 'completed')}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
              isCompleted 
                ? 'bg-luxury-accent border-luxury-accent text-white scale-100 shadow-md shadow-luxury-accent/20' 
                : 'border-luxury-light-text-secondary/35 dark:border-luxury-dark-text-secondary/35 hover:border-luxury-accent dark:hover:border-luxury-accent hover:scale-105'
            }`}
            title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
          >
            {isCompleted && (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          
          <h4 className={`text-base font-bold leading-tight flex-1 ${
            isCompleted 
              ? 'text-luxury-light-text-secondary/50 dark:text-luxury-dark-text-secondary/50 line-through' 
              : 'text-luxury-light-text-primary dark:text-luxury-dark-text-primary'
          }`}>
            {task.title}
          </h4>
        </div>

        {/* Task Description */}
        <p className={`text-sm mt-2.5 break-words line-clamp-3 ${
          isCompleted 
            ? 'text-luxury-light-text-secondary/40 dark:text-luxury-dark-text-secondary/40' 
            : 'text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary'
        }`}>
          {task.description}
        </p>
      </div>

      {/* Footer Details (Due Date, Created Date, Actions) */}
      <div className="mt-5 pt-3.5 border-t border-luxury-light-border/60 dark:border-luxury-dark-border/40 flex items-center justify-between gap-4">
        {/* Due Date Indicator */}
        <div className="flex flex-col gap-0.5">
          {hasDueDate ? (
            <span className={`text-[10px] font-semibold flex items-center gap-1.5 ${
              isCompleted 
                ? 'text-luxury-light-text-secondary/45 dark:text-luxury-dark-text-secondary/40' 
                : isOverdue 
                  ? 'text-red-500 font-bold' 
                  : 'text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary'
            }`}>
              <svg className={`w-3.5 h-3.5 ${isOverdue ? 'animate-bounce' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {isOverdue ? 'Overdue: ' : 'Due: '}{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          ) : (
            <span className="text-[10px] text-luxury-light-text-secondary/40 dark:text-luxury-dark-text-secondary/30 italic">
              No due date
            </span>
          )}
          <span className="text-[9px] text-luxury-light-text-secondary/50 dark:text-luxury-dark-text-secondary/50 font-mono">
            Created {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Action Buttons: Colorful and Sleek */}
        <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-emerald-600 hover:text-white dark:text-emerald-400 dark:hover:text-white bg-emerald-500/10 hover:bg-emerald-500 dark:bg-emerald-500/5 dark:hover:bg-emerald-500 border border-emerald-500/20 rounded-xl transition-all cursor-pointer shadow-sm"
            title="Edit Task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-rose-600 hover:text-white dark:text-rose-400 dark:hover:text-white bg-rose-500/10 hover:bg-rose-500 dark:bg-rose-500/5 dark:hover:bg-rose-500 border border-rose-500/20 rounded-xl transition-all cursor-pointer shadow-sm"
            title="Delete Task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
