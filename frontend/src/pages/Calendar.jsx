import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import TaskForm from '../components/TaskForm';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Task creation modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tasks (high limit to see everything on calendar)
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/tasks?limit=100');
      // If backend was updated with pagination metadata
      if (response.data && response.data.tasks) {
        setTasks(response.data.tasks);
      } else {
        setTasks(response.data || []);
      }
    } catch (err) {
      toast.error('Failed to load tasks for calendar.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // First day of the month (0 = Sunday, 6 = Saturday)
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Number of days in the current month
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Number of days in the previous month
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  // Generate calendar days
  const daysArray = React.useMemo(() => {
    const days = [];
    
    // Fill in previous month's trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthTotalDays - i,
        month: month === 0 ? 11 : month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false,
      });
    }

    // Fill in current month's days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true,
      });
    }

    // Fill in next month's starting days to complete the 6-week grid (42 days)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: month === 11 ? 0 : month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month, firstDayIndex, totalDays, prevMonthTotalDays]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Open modal to add task on specific day
  const handleDayClick = (dayObj) => {
    const date = new Date(dayObj.year, dayObj.month, dayObj.day + 1); // offset for UTC input parsing
    setSelectedDateStr(date.toISOString().substring(0, 10));
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Open modal to edit specific task
  const handleTaskClick = (e, task) => {
    e.stopPropagation(); // Prevent trigger day click
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Handle task modal submit
  const handleTaskSubmit = async (taskData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, taskData);
        toast.success('Task updated successfully!');
      } else {
        // Preset selected due date if not customized
        const payload = {
          ...taskData,
          dueDate: taskData.dueDate || selectedDateStr,
        };
        await api.post('/tasks', payload);
        toast.success('Task created successfully!');
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      toast.error('Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tasks matching a specific date
  const getTasksForDate = (day, m, y) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dDate = new Date(task.dueDate);
      return (
        dDate.getDate() === day &&
        dDate.getMonth() === m &&
        dDate.getFullYear() === y
      );
    });
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-8 animate-fade-in-up w-full pb-12">
      {/* Header with Title and Month navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-luxury-light-text-primary dark:text-luxury-dark-text-primary">
            Schedule Calendar 📅
          </h1>
          <p className="text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary mt-1.5 text-base">
            Visualize, organize, and assign your tasks across dates.
          </p>
        </div>
        
        {/* Calendar Navs */}
        <div className="flex items-center gap-2.5 bg-luxury-light-card dark:bg-luxury-dark-card border border-luxury-light-border dark:border-luxury-dark-border p-1.5 rounded-xl shadow-sm shrink-0">
          <button
            onClick={handlePrevMonth}
            className="p-2 text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:bg-luxury-light-card-hover dark:hover:bg-luxury-dark-card-hover rounded-lg transition-colors cursor-pointer"
            title="Previous Month"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-bold bg-luxury-accent/10 text-luxury-accent border border-luxury-accent/20 rounded-lg hover:bg-luxury-accent/20 transition-all cursor-pointer"
          >
            Today
          </button>

          <span className="text-sm font-bold text-luxury-light-text-primary dark:text-luxury-dark-text-primary min-w-[100px] text-center px-1">
            {monthNames[month]} {year}
          </span>

          <button
            onClick={handleNextMonth}
            className="p-2 text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:bg-luxury-light-card-hover dark:hover:bg-luxury-dark-card-hover rounded-lg transition-colors cursor-pointer"
            title="Next Month"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid Pane */}
      <div className="bg-luxury-light-card dark:bg-luxury-dark-card border border-luxury-light-border dark:border-luxury-dark-border rounded-2xl shadow-xl overflow-hidden luxury-jade-glow transition-all duration-300">
        {/* Week Days Headers */}
        <div className="grid grid-cols-7 border-b border-luxury-light-border dark:border-luxury-dark-border/40 bg-luxury-light-card-hover/40 dark:bg-luxury-dark-card-hover/20 py-3 text-center">
          {weekdays.map(day => (
            <span key={day} className="text-xs font-bold text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary uppercase tracking-widest">
              {day}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-3">
            <svg className="animate-spin h-8 w-8 text-luxury-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xs font-semibold text-luxury-light-text-secondary/70">Assembling Calendar...</span>
          </div>
        ) : (
          <div className="grid grid-cols-7 grid-rows-6 h-[650px] divide-x divide-y divide-luxury-light-border dark:divide-luxury-dark-border/40">
            {daysArray.map((dayObj, index) => {
              const dayTasks = getTasksForDate(dayObj.day, dayObj.month, dayObj.year);
              const isToday = 
                dayObj.day === new Date().getDate() && 
                dayObj.month === new Date().getMonth() && 
                dayObj.year === new Date().getFullYear();

              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(dayObj)}
                  className={`p-2 flex flex-col justify-between hover:bg-luxury-accent/5 dark:hover:bg-luxury-accent/5 transition-colors cursor-pointer relative min-h-0 ${
                    dayObj.isCurrentMonth 
                      ? 'bg-luxury-light-card dark:bg-luxury-dark-card' 
                      : 'bg-luxury-light-card-hover/20 dark:bg-luxury-dark-card-hover/10 text-luxury-light-text-secondary/40 dark:text-luxury-dark-text-secondary/30'
                  }`}
                >
                  {/* Day Label Number */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold flex items-center justify-center rounded-lg w-6 h-6 ${
                      isToday 
                        ? 'bg-luxury-accent text-white shadow-md' 
                        : dayObj.isCurrentMonth
                          ? 'text-luxury-light-text-primary dark:text-luxury-dark-text-primary'
                          : 'text-luxury-light-text-secondary/40 dark:text-luxury-dark-text-secondary/30'
                    }`}>
                      {dayObj.day}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-[9px] bg-luxury-accent/10 dark:bg-luxury-accent/5 text-luxury-accent border border-luxury-accent/15 px-1.5 py-0.5 rounded-md font-bold uppercase">
                        {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                      </span>
                    )}
                  </div>

                  {/* Tasks List for Day */}
                  <div className="flex-1 overflow-y-auto space-y-1.5 mt-2 max-h-[80px] scrollbar-thin">
                    {dayTasks.slice(0, 3).map(task => {
                      const priorityDotColors = {
                        high: 'bg-red-500',
                        medium: 'bg-amber-500',
                        low: 'bg-blue-500',
                      };
                      return (
                        <div
                          key={task._id}
                          onClick={(e) => handleTaskClick(e, task)}
                          className={`px-2 py-1 rounded-lg border text-[10px] font-semibold flex items-center gap-1.5 hover:shadow-sm transition-all truncate ${
                            task.status === 'completed'
                              ? 'bg-luxury-light-card-hover/40 dark:bg-luxury-dark-card-hover/20 text-luxury-light-text-secondary/50 line-through border-luxury-light-border dark:border-luxury-dark-border/40'
                              : 'bg-luxury-light-card dark:bg-luxury-dark-card-hover border-luxury-light-border dark:border-luxury-dark-border text-luxury-light-text-primary dark:text-luxury-dark-text-primary hover:border-luxury-accent/30'
                          }`}
                          title={`${task.title} (${task.priority} priority)`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDotColors[task.priority] || 'bg-slate-400'}`} />
                          <span className="truncate">{task.title}</span>
                        </div>
                      );
                    })}
                    {dayTasks.length > 3 && (
                      <div className="text-[9px] font-bold text-luxury-light-text-secondary/60 dark:text-luxury-dark-text-secondary/50 pl-2">
                        + {dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => { setIsModalOpen(false); setEditingTask(null); }}
          />
          <div className="relative bg-luxury-light-card dark:bg-luxury-dark-card border border-luxury-light-border dark:border-luxury-dark-border w-full max-w-xl rounded-2xl p-6 shadow-2xl luxury-jade-glow transform scale-100 transition-all duration-300 animate-fade-in-up">
            <h3 className="text-xl font-bold text-luxury-light-text-primary dark:text-luxury-dark-text-primary mb-4">
              {editingTask ? 'Edit Task' : `Create Task for ${new Date(selectedDateStr).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}`}
            </h3>
            <TaskForm 
              onSubmit={handleTaskSubmit} 
              initialData={editingTask} 
              isSubmitting={isSubmitting} 
              onCancel={() => { setIsModalOpen(false); setEditingTask(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
