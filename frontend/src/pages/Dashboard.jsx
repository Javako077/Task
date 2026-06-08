import React, { useState, useEffect, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import ConfirmModal from '../components/ConfirmModal';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  
  // State for tasks and pagination
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalTasks: 0 });
  const [limit] = useState(6); // Tasks per page
  
  // State for filtering and search
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState(''); // For immediate input feedback
  
  // State for UI handling
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Delete Confirm State
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [processingTasks, setProcessingTasks] = useState({}); // { [id]: 'toggling' | 'deleting' }

  // Fetch tasks with query params
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit,
      });
      
      if (searchQuery) params.append('search', searchQuery);
      if (filter !== 'all') params.append('status', filter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      
      const response = await api.get(`/tasks?${params.toString()}`);
      
      if (response.data.pagination) {
        setTasks(response.data.tasks);
        setPagination(response.data.pagination);
      } else {
        // Fallback if backend wasn't updated correctly
        setTasks(response.data);
      }
    } catch (err) {
      toast.error('Failed to load tasks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, limit, searchQuery, filter, priorityFilter, categoryFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Open modal for editing when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setIsModalOpen(true);
    }
  }, [editingTask]);

  // Handle Search Submission
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Open modal for new task
  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Close task modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Create or Update task
  const handleTaskSubmit = async (taskData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        const response = await api.put(`/tasks/${editingTask._id}`, taskData);
        setTasks(tasks.map(t => t._id === editingTask._id ? response.data : t));
        handleCloseModal();
        toast.success('Task updated successfully!');
      } else {
        await api.post('/tasks', taskData);
        setPagination(prev => ({ ...prev, page: 1 })); // Go to first page to see new task
        handleCloseModal();
        fetchTasks(); // Refetch to get updated pagination stats
        toast.success('Task created successfully!');
      }
    } catch (err) {
      toast.error(editingTask ? 'Failed to update task.' : 'Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger Custom Delete Confirmation Dialog
  const triggerDeleteConfirm = (id) => {
    setTaskToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  // Execute actual task delete
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    const deletingId = taskToDelete;
    setProcessingTasks(prev => ({ ...prev, [deletingId]: 'deleting' }));
    try {
      await api.delete(`/tasks/${deletingId}`);
      fetchTasks(); // Refetch to maintain proper pagination
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task.');
    } finally {
      setProcessingTasks(prev => {
        const copy = { ...prev };
        delete copy[deletingId];
        return copy;
      });
      setTaskToDelete(null);
    }
  };

  // Toggle task status
  const handleToggleStatus = async (id, newStatus) => {
    setProcessingTasks(prev => ({ ...prev, [id]: 'toggling' }));
    try {
      const response = await api.put(`/tasks/${id}`, { status: newStatus });
      // If we are filtering by status, refetch to remove it from current view
      if (filter !== 'all') {
        fetchTasks();
      } else {
        setTasks(tasks.map(t => t._id === id ? response.data : t));
      }
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status.');
    } finally {
      setProcessingTasks(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  // Pagination Handlers
  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up w-full pb-12">
      {/* Header Section with Welcome & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-luxury-light-text-primary dark:text-luxury-dark-text-primary">
            Hello, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary mt-1.5 text-base">
            You have <span className="font-bold text-luxury-accent">{pagination.totalTasks || tasks.length}</span> total tasks. Let's make today productive.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.8 bg-gradient-to-r from-luxury-accent-hover via-luxury-accent to-luxury-mint hover:from-luxury-accent hover:to-luxury-accent-hover text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-luxury-accent/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <svg className="w-5 h-5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add New Task
        </button>
      </div>
      
      {/* Search and Filters panel */}
      <div className="bg-luxury-light-card dark:bg-luxury-dark-card p-5 rounded-2xl border border-luxury-light-border dark:border-luxury-dark-border luxury-jade-glow transition-all duration-300 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search tasks by title or description..."
              className="w-full pl-10 pr-4 py-2.5 border border-luxury-light-border dark:border-luxury-dark-border rounded-xl bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover text-luxury-light-text-primary dark:text-luxury-dark-text-primary placeholder-luxury-light-text-secondary/40 dark:placeholder-luxury-dark-text-secondary/40 focus:outline-none focus:ring-1 focus:ring-luxury-accent focus:border-luxury-accent transition-all duration-200"
            />
            <svg className="absolute left-3.5 top-3 h-5 w-5 text-luxury-light-text-secondary/50 dark:text-luxury-dark-text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>

          {/* Status Tab buttons */}
          <div className="flex bg-luxury-light-card-hover dark:bg-luxury-dark-bg/60 border border-luxury-light-border dark:border-luxury-dark-border/40 rounded-xl p-1 overflow-x-auto shrink-0">
            {['all', 'pending', 'completed'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFilter(f);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  filter === f
                    ? 'bg-luxury-light-card text-luxury-accent border border-luxury-light-border dark:bg-luxury-dark-card dark:text-luxury-dark-text-primary dark:border-luxury-dark-border/60 shadow-sm'
                    : 'text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:text-luxury-light-text-primary dark:hover:text-luxury-dark-text-primary border border-transparent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdowns for Priority & Category Filters */}
        <div className="flex flex-wrap gap-4 pt-3 border-t border-luxury-light-border/40 dark:border-luxury-dark-border/20">
          {/* Priority filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary">
              Priority:
            </span>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="px-3 py-1.5 border border-luxury-light-border dark:border-luxury-dark-border rounded-xl bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover text-xs font-semibold text-luxury-light-text-primary dark:text-luxury-dark-text-primary focus:outline-none focus:ring-1 focus:ring-luxury-accent"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary">
              Category:
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="px-3 py-1.5 border border-luxury-light-border dark:border-luxury-dark-border rounded-xl bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover text-xs font-semibold text-luxury-light-text-primary dark:text-luxury-dark-text-primary focus:outline-none focus:ring-1 focus:ring-luxury-accent"
            >
              <option value="all">All Categories</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Urgent">Urgent</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List Grid */}
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-luxury-light-text-primary dark:text-luxury-dark-text-primary flex items-center gap-3">
          Your Tasks
          {isLoading && (
            <svg className="animate-spin h-5 w-5 text-luxury-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </h2>

        {tasks.length === 0 && !isLoading ? (
          <div className="text-center py-20 bg-luxury-light-card dark:bg-luxury-dark-card rounded-2xl border border-dashed border-luxury-light-border dark:border-luxury-dark-border shadow-sm">
            <svg className="mx-auto h-14 w-14 text-luxury-light-text-secondary/40 dark:text-luxury-dark-text-secondary/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="text-lg font-bold text-luxury-light-text-primary dark:text-luxury-dark-text-primary">No tasks found</h3>
            <p className="mt-2 text-sm text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary max-w-md mx-auto">
              {searchQuery || filter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your filters or search query.' 
                : 'Get started by creating a new task and organizing your routine.'}
            </p>
            {(searchQuery || filter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all') ? (
              <button
                onClick={() => {
                  setSearchInput('');
                  setSearchQuery('');
                  setFilter('all');
                  setPriorityFilter('all');
                  setCategoryFilter('all');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="mt-4 px-4 py-2 bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover border border-luxury-light-border dark:border-luxury-dark-border text-xs font-semibold rounded-xl text-luxury-light-text-primary dark:text-luxury-dark-text-primary hover:bg-luxury-light-card transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            ) : (
              <button
                onClick={handleOpenAddModal}
                className="mt-4 px-4 py-2 bg-luxury-accent/10 hover:bg-luxury-accent/20 border border-luxury-accent/25 text-xs font-bold rounded-xl text-luxury-accent transition-colors cursor-pointer"
              >
                Create First Task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onDelete={triggerDeleteConfirm}
                  onToggleStatus={handleToggleStatus}
                  onEdit={setEditingTask}
                  processing={processingTasks[task._id]}
                />
              ))}
            </div>
            
            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border border-luxury-light-border dark:border-luxury-dark-border bg-luxury-light-card dark:bg-luxury-dark-card px-4 py-3 sm:px-6 rounded-2xl shadow-sm mt-8 transition-colors">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary">
                      Showing page <span className="font-semibold text-luxury-light-text-primary dark:text-luxury-dark-text-primary">{pagination.page}</span> of <span className="font-semibold text-luxury-light-text-primary dark:text-luxury-dark-text-primary">{pagination.totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={handlePrevPage}
                        disabled={pagination.page === 1}
                        className="relative inline-flex items-center px-3 py-2 rounded-l-xl border border-luxury-light-border dark:border-luxury-dark-border/60 bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover text-sm font-semibold text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:text-luxury-light-text-primary dark:hover:text-luxury-dark-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Page Numbers */}
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
                        <button
                          key={pageNum}
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-bold transition-all cursor-pointer ${
                            pageNum === pagination.page
                              ? 'z-10 bg-luxury-accent/15 border-luxury-accent text-luxury-accent dark:bg-luxury-accent/10 dark:border-luxury-accent'
                              : 'bg-luxury-light-card border-luxury-light-border/60 text-luxury-light-text-secondary hover:bg-luxury-light-card-hover dark:bg-luxury-dark-card dark:border-luxury-dark-border/60 dark:text-luxury-dark-text-secondary dark:hover:bg-luxury-dark-card-hover'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        onClick={handleNextPage}
                        disabled={pagination.page === pagination.totalPages}
                        className="relative inline-flex items-center px-3 py-2 rounded-r-xl border border-luxury-light-border dark:border-luxury-dark-border/60 bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover text-sm font-semibold text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:text-luxury-light-text-primary dark:hover:text-luxury-dark-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
                
                {/* Mobile Pagination */}
                <div className="flex items-center justify-between w-full sm:hidden">
                  <button
                    onClick={handlePrevPage}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-luxury-light-border dark:border-luxury-dark-border text-sm font-semibold rounded-xl text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover hover:bg-luxury-light-card dark:hover:bg-luxury-dark-card disabled:opacity-40 cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary font-semibold">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={pagination.page === pagination.totalPages}
                    className="relative inline-flex items-center px-4 py-2 border border-luxury-light-border dark:border-luxury-dark-border text-sm font-semibold rounded-xl text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover hover:bg-luxury-light-card dark:hover:bg-luxury-dark-card disabled:opacity-40 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Creation/Editing Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseModal}
          />
          {/* Form Modal Box */}
          <div className="relative bg-luxury-light-card dark:bg-luxury-dark-card border border-luxury-light-border dark:border-luxury-dark-border w-full max-w-xl rounded-2xl p-6 shadow-2xl luxury-jade-glow transform scale-100 transition-all duration-300 animate-fade-in-up">
            <h3 className="text-xl font-bold text-luxury-light-text-primary dark:text-luxury-dark-text-primary mb-4">
              {editingTask ? 'Edit Selected Task' : 'Create New Task'}
            </h3>
            <TaskForm 
              onSubmit={handleTaskSubmit} 
              initialData={editingTask} 
              isSubmitting={isSubmitting} 
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleDeleteTask}
        title="Delete Task?"
        message="Are you sure you want to delete this task? This action is permanent and cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Dashboard;
