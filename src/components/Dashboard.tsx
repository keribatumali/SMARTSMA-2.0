import { format, isToday, parseISO } from 'date-fns';
import { Task, ScheduleItem, View } from '../types';
import { CheckCircle2, Circle, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  tasks: Task[];
  schedule: ScheduleItem[];
  onNavigate: (view: View) => void;
}

export default function Dashboard({ tasks, schedule, onNavigate }: DashboardProps) {
  const todayTasks = tasks.filter(task => !task.completed && isToday(parseISO(task.deadline)));
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;

  const currentDay = format(new Date(), 'EEEE');
  const todaySchedule = schedule.filter(item => item.day === currentDay);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Selamat Datang! 👋</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Hari ini adalah {format(new Date(), 'EEEE, d MMMM yyyy')}</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">Pending</span>
          </div>
          <p className="text-3xl font-display font-bold">{pendingTasks}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Tugas belum selesai</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">Selesai</span>
          </div>
          <p className="text-3xl font-display font-bold">{completedTasks}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Tugas telah selesai</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">Deadline</span>
          </div>
          <p className="text-3xl font-display font-bold">{todayTasks.length}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Deadline hari ini</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Deadlines */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-bold">Deadline Hari Ini</h3>
            <button 
              onClick={() => onNavigate('tasks')}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
            >
              Lihat Semua <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="space-y-3">
            {todayTasks.length > 0 ? (
              todayTasks.map(task => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm"
                >
                  <div className={`w-2 h-10 rounded-full ${
                    task.priority === 'High' ? 'bg-red-500' : 
                    task.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{task.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{task.subject}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                      task.priority === 'High' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 
                      task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' : 
                      'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-slate-100 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm">Tidak ada deadline hari ini. Santai dulu! ☕</p>
              </div>
            )}
          </div>
        </section>

        {/* Today's Schedule */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-bold">Jadwal Hari Ini</h3>
            <button 
              onClick={() => onNavigate('schedule')}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
            >
              Atur Jadwal <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            {todaySchedule.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {todaySchedule.map((item, idx) => (
                  <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <span className="w-8 h-8 flex items-center justify-center bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{item.subject}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm">Belum ada jadwal untuk hari {currentDay}.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
