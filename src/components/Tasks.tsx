import React, { useState } from 'react';
import { Task, Priority } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, Calendar as CalendarIcon, Filter, X, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, parseISO } from 'date-fns';
import { cn } from '../lib/utils';

interface TasksProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export default function Tasks({ tasks, onAddTask, onToggleTask, onDeleteTask }: TasksProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newDeadline, setNewDeadline] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newPriority, setNewPriority] = useState<Priority>('Medium');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSubject) return;
    
    onAddTask({
      title: newTitle,
      subject: newSubject,
      deadline: newDeadline,
      priority: newPriority,
    });
    
    setNewTitle('');
    setNewSubject('');
    setIsAdding(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  }).sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const priorityColors = {
    High: 'bg-red-500',
    Medium: 'bg-amber-500',
    Low: 'bg-emerald-500'
  };

  const priorityBadges = {
    High: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    Medium: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    Low: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-6"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Daftar Tugas</h2>
          <p className="text-slate-500 dark:text-slate-400">Kelola semua tugas sekolahmu di sini.</p>
        </motion.div>
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-primary-500/20 transition-all active:scale-95"
        >
          {isAdding ? <X size={20} /> : <Plus size={20} />}
          {isAdding ? 'Batal' : 'Tambah Tugas'}
        </motion.button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Tugas</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Laporan Praktikum Fisika"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mata Pelajaran</label>
                  <input 
                    type="text" 
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Contoh: Fisika"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deadline</label>
                  <input 
                    type="date" 
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prioritas</label>
                  <div className="flex gap-2">
                    {(['Low', 'Medium', 'High'] as Priority[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPriority(p)}
                        className={cn(
                          "flex-1 py-3 rounded-xl text-sm font-semibold transition-all border",
                          newPriority === p 
                            ? "bg-primary-600 text-white border-primary-600 shadow-md" 
                            : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                        )}
                      >
                        {p === 'Low' ? 'Rendah' : p === 'Medium' ? 'Sedang' : 'Tinggi'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20"
              >
                Simpan Tugas
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'pending', 'completed'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
              filter === f ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800"
            )}
          >
            {f === 'all' ? 'Semua' : f === 'pending' ? 'Belum Selesai' : 'Selesai'}
          </button>
        ))}
      </motion.div>

      <motion.div layout className="grid grid-cols-1 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <motion.div
                layout
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ x: 5 }}
                className={cn(
                  "bg-white dark:bg-slate-900 p-4 rounded-2xl border transition-all flex items-center gap-4 group shadow-sm",
                  task.completed ? "opacity-60 border-slate-100 dark:border-slate-800" : "border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700"
                )}
              >
                <motion.button 
                  whileTap={{ scale: 1.5 }}
                  onClick={() => onToggleTask(task.id)}
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    task.completed ? "text-emerald-500" : "text-slate-300 hover:text-primary-500"
                  )}
                >
                  {task.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                </motion.button>
                
                <div className={cn("w-1.5 h-12 rounded-full flex-shrink-0", priorityColors[task.priority])} />
                
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "font-bold text-slate-900 dark:text-white truncate",
                    task.completed && "line-through text-slate-400"
                  )}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{task.subject}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <CalendarIcon size={12} />
                      {format(parseISO(task.deadline), 'd MMM yyyy')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={cn("hidden sm:inline-block text-[10px] font-bold uppercase px-2 py-1 rounded-md", priorityBadges[task.priority])}>
                    {task.priority === 'High' ? 'Tinggi' : task.priority === 'Medium' ? 'Sedang' : 'Rendah'}
                  </span>
                  <button 
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-12 text-center"
            >
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Belum Ada Tugas</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">Klik tombol "Tambah Tugas" untuk mulai mencatat tugas sekolahmu.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
