import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const FocusSpace = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // Timer States
  const [mode, setMode] = useState('focus'); // focus (25m), short (5m), long (15m)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  // Audio Synthesis State
  const [ambientSound, setAmbientSound] = useState('none'); // none, rain, pulse
  const audioContextRef = useRef(null);
  const noiseSourceRef = useRef(null);
  const oscRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Mode durations in seconds
  const durations = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
  };

  // Fetch pending tasks to select from
  const fetchPendingTasks = useCallback(async () => {
    try {
      const response = await api.get('/tasks?status=pending&limit=20');
      if (response.data && response.data.tasks) {
        setTasks(response.data.tasks);
      } else {
        setTasks(response.data || []);
      }
    } catch (err) {
      toast.error('Failed to load tasks for focus session.');
    }
  }, []);

  useEffect(() => {
    fetchPendingTasks();
  }, [fetchPendingTasks]);

  // Audio Setup and Teardown
  const startSound = useCallback(() => {
    if (ambientSound === 'none') return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Stop any existing sound sources
      stopSound();

      // Create main volume gain node
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime); // Soft volume
      gainNode.connect(ctx.destination);
      gainNodeRef.current = gainNode;

      if (ambientSound === 'rain') {
        // Synthesize White Noise (Rain effect)
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Biquad filter for soft rain sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        whiteNoise.start();
        noiseSourceRef.current = whiteNoise;
      } else if (ambientSound === 'pulse') {
        // Synthesize Low Pulse wave (Binaural focus)
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, ctx.currentTime); // A2 low tone

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.5, ctx.currentTime); // 0.5Hz modulation (very slow pulse)

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.03, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency); // Modulate oscillator frequency
        osc.connect(gainNode);

        lfo.start();
        osc.start();
        oscRef.current = osc;
      }
    } catch (e) {
      console.warn('AudioContext failed to start', e);
    }
  }, [ambientSound]);

  const stopSound = () => {
    try {
      if (noiseSourceRef.current) {
        noiseSourceRef.current.stop();
        noiseSourceRef.current = null;
      }
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current = null;
      }
    } catch (e) {
      // already stopped or not started
    }
  };

  // Handle Play/Pause
  const toggleTimer = () => {
    if (isActive) {
      setIsActive(false);
      stopSound();
    } else {
      setIsActive(true);
      startSound();
    }
  };

  // Trigger ambient sound change
  useEffect(() => {
    if (isActive) {
      startSound();
    } else {
      stopSound();
    }
    return () => stopSound();
  }, [ambientSound, isActive, startSound]);

  // Handle mode change
  const handleModeChange = (newMode) => {
    setIsActive(false);
    stopSound();
    setMode(newMode);
    setTimeLeft(durations[newMode]);
  };

  // Timer Tick Loop
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            stopSound();
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive]);

  // Timer complete alert & mark selected task complete modal
  const handleTimerComplete = async () => {
    toast.success(`${mode === 'focus' ? 'Focus Session' : 'Break'} complete! Great job.`);
    
    // Play simple notification chime
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {}

    if (mode === 'focus' && selectedTask) {
      setShowCompletionModal(true);
    }
  };

  const handleMarkTaskComplete = async () => {
    if (!selectedTask) return;
    try {
      await api.put(`/tasks/${selectedTask._id}`, { status: 'completed' });
      toast.success('Task marked completed!');
      setSelectedTask(null);
      fetchPendingTasks();
    } catch (e) {
      toast.error('Failed to update task.');
    } finally {
      setShowCompletionModal(false);
    }
  };

  // Reset Timer
  const resetTimer = () => {
    setIsActive(false);
    stopSound();
    setTimeLeft(durations[mode]);
  };

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-fade-in-up w-full pb-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-luxury-light-text-primary dark:text-luxury-dark-text-primary">
          Focus Space 🧘
        </h1>
        <p className="text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary mt-1.5 text-base">
          Tune out distractions with Pomodoro cycles and synthesized binaural white noise.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timer Canvas Block */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-luxury-light-card dark:bg-luxury-dark-card border border-luxury-light-border dark:border-luxury-dark-border p-8 rounded-2xl shadow-xl luxury-jade-glow items-center text-center transition-all duration-300">
          {/* Mode Selector Tabs */}
          <div className="flex gap-2.5 bg-luxury-light-card-hover dark:bg-luxury-dark-bg/60 border border-luxury-light-border dark:border-luxury-dark-border/40 p-1.5 rounded-xl">
            {['focus', 'short', 'long'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleModeChange(m)}
                className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  mode === m
                    ? 'bg-luxury-light-card text-luxury-accent border border-luxury-light-border dark:bg-luxury-dark-card dark:text-luxury-dark-text-primary dark:border-luxury-dark-border/60 shadow-sm'
                    : 'text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:text-luxury-light-text-primary'
                }`}
              >
                {m === 'focus' ? 'Focus Session' : m === 'short' ? 'Short Break' : 'Long Break'}
              </button>
            ))}
          </div>

          {/* Core Display Timer */}
          <div className="my-10 space-y-2 relative">
            <span className="text-7xl sm:text-8xl font-black font-mono tracking-tight luxury-text-gradient select-none">
              {formatTime(timeLeft)}
            </span>
            {selectedTask && (
              <div className="text-xs bg-luxury-accent/10 text-luxury-accent px-3 py-1.5 rounded-xl border border-luxury-accent/15 max-w-sm mx-auto truncate font-semibold">
                🎯 Focusing on: {selectedTask.title}
              </div>
            )}
          </div>

          {/* Controls button Row */}
          <div className="flex items-center gap-4">
            <button
              onClick={resetTimer}
              className="p-3 text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:text-luxury-light-text-primary dark:hover:text-luxury-dark-text-primary bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover border border-luxury-light-border dark:border-luxury-dark-border rounded-2xl transition-colors cursor-pointer"
              title="Reset Timer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
              </svg>
            </button>

            <button
              onClick={toggleTimer}
              className="px-8 py-3.5 bg-gradient-to-r from-luxury-accent-hover via-luxury-accent to-luxury-mint hover:from-luxury-accent hover:to-luxury-accent-hover text-white font-extrabold rounded-2xl shadow-lg hover:shadow-luxury-accent/15 transition-all duration-300 cursor-pointer min-w-[140px]"
            >
              {isActive ? 'Pause' : 'Start Focus'}
            </button>
          </div>

          {/* Ambient Sound synthesis selector */}
          <div className="mt-8 pt-6 border-t border-luxury-light-border/60 dark:border-luxury-dark-border/40 w-full flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold text-luxury-light-text-secondary/70 dark:text-luxury-dark-text-secondary/70 uppercase tracking-widest">
              Ambient Audio Atmosphere
            </span>
            <div className="flex gap-2">
              {[
                { id: 'none', name: 'Mute' },
                { id: 'rain', name: 'Synthesized Rain 🌧️' },
                { id: 'pulse', name: 'Binaural Wave 🌀' }
              ].map(sound => (
                <button
                  key={sound.id}
                  type="button"
                  onClick={() => setAmbientSound(sound.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    ambientSound === sound.id
                      ? 'bg-luxury-accent text-white border-luxury-accent shadow-sm'
                      : 'bg-luxury-light-card-hover border-luxury-light-border text-luxury-light-text-secondary hover:text-luxury-light-text-primary dark:bg-luxury-dark-card-hover dark:border-luxury-dark-border/40 dark:text-luxury-dark-text-secondary'
                  }`}
                >
                  {sound.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task Focus selector Block */}
        <div className="lg:col-span-1 bg-luxury-light-card dark:bg-luxury-dark-card border border-luxury-light-border dark:border-luxury-dark-border p-6 rounded-2xl shadow-xl luxury-jade-glow flex flex-col justify-between max-h-[500px] overflow-hidden">
          <div>
            <h3 className="text-lg font-bold text-luxury-light-text-primary dark:text-luxury-dark-text-primary mb-1">
              Select Focus Task
            </h3>
            <p className="text-xs text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary mb-4">
              Bind a pending task to your session for active progress tracking.
            </p>
            
            <div className="space-y-2 overflow-y-auto max-h-[350px] pr-1 scrollbar-thin">
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-xs text-luxury-light-text-secondary/60 dark:text-luxury-dark-text-secondary/40 italic">
                  No pending tasks found.
                </div>
              ) : (
                tasks.map(task => {
                  const isSelected = selectedTask?._id === task._id;
                  return (
                    <div
                      key={task._id}
                      onClick={() => setSelectedTask(isSelected ? null : task)}
                      className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-luxury-accent/10 border-luxury-accent text-luxury-accent dark:bg-luxury-accent/5'
                          : 'bg-luxury-light-card-hover border-luxury-light-border text-luxury-light-text-primary hover:border-luxury-accent/30 dark:bg-luxury-dark-card-hover dark:border-luxury-dark-border/40 dark:text-luxury-dark-text-secondary'
                      }`}
                    >
                      <span className="truncate pr-2">{task.title}</span>
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-luxury-accent bg-luxury-accent text-white' : 'border-luxury-light-text-secondary/30'
                      }`}>
                        {isSelected && (
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Completion Dialog Modal */}
      {showCompletionModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setShowCompletionModal(false)} />
          <div className="relative bg-luxury-light-card dark:bg-luxury-dark-card border border-luxury-light-border dark:border-luxury-dark-border w-full max-w-md rounded-2xl p-6 shadow-2xl luxury-jade-glow transform scale-100 transition-all duration-300 animate-fade-in-up">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-luxury-accent/15 text-luxury-accent mb-4 shadow-inner">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-luxury-light-text-primary dark:text-luxury-dark-text-primary">
                Focus Session Finished!
              </h3>
              <p className="text-sm text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary mt-2">
                Your focus timer for <strong className="text-luxury-accent">"{selectedTask.title}"</strong> is complete. Would you like to mark this task as Completed?
              </p>
            </div>
            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-luxury-light-border dark:border-luxury-dark-border text-sm font-semibold text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:bg-luxury-light-card-hover dark:hover:bg-luxury-dark-card-hover transition-colors cursor-pointer"
              >
                Keep Pending
              </button>
              <button
                type="button"
                onClick={handleMarkTaskComplete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-luxury-accent-hover to-luxury-accent text-white text-sm font-bold shadow-md hover:shadow-lg hover:shadow-luxury-accent/20 transition-all cursor-pointer"
              >
                Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusSpace;
