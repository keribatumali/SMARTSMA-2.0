import React from 'react';
import { Task } from '../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { CheckCircle2, Circle, Trophy, TrendingUp } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface StatisticsProps {
  tasks: Task[];
}

export default function Statistics({ tasks }: StatisticsProps) {
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const doughnutData = {
    labels: ['Selesai', 'Belum Selesai'],
    datasets: [
      {
        data: [completedCount, pendingCount],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)', // Emerald 500
          'rgba(245, 158, 11, 0.8)', // Amber 500
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            family: 'Inter',
            size: 12,
          }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 14, family: 'Outfit' },
        bodyFont: { size: 13, family: 'Inter' },
        cornerRadius: 12,
      }
    },
    cutout: '70%',
    maintainAspectRatio: false,
  };

  // Group tasks by subject for a bar chart
  const subjectStats: Record<string, { completed: number; pending: number }> = {};
  tasks.forEach(task => {
    if (!subjectStats[task.subject]) {
      subjectStats[task.subject] = { completed: 0, pending: 0 };
    }
    if (task.completed) {
      subjectStats[task.subject].completed++;
    } else {
      subjectStats[task.subject].pending++;
    }
  });

  const barData = {
    labels: Object.keys(subjectStats),
    datasets: [
      {
        label: 'Selesai',
        data: Object.values(subjectStats).map(s => s.completed),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 8,
      },
      {
        label: 'Belum Selesai',
        data: Object.values(subjectStats).map(s => s.pending),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderRadius: 8,
      }
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true }
    },
    plugins: {
      legend: { position: 'bottom' as const }
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Statistik Produktivitas</h2>
        <p className="text-slate-500 dark:text-slate-400">Pantau kemajuan belajarmu secara visual.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm md:col-span-1 flex flex-col items-center justify-center text-center">
          <div className="relative w-48 h-48 mb-6">
            <Doughnut data={doughnutData} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-display font-bold text-slate-900 dark:text-white">{completionRate}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selesai</span>
            </div>
          </div>
          <div className="space-y-2 w-full">
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Selesai</span>
              </div>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{completedCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Belum</span>
              </div>
              <span className="font-bold text-amber-700 dark:text-amber-400">{pendingCount}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-primary-600 to-blue-700 p-6 rounded-3xl text-white shadow-lg shadow-primary-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Pencapaian</span>
              </div>
              <p className="text-lg font-semibold leading-tight">
                {completionRate >= 80 ? 'Luar biasa! Pertahankan semangatmu!' : 
                 completionRate >= 50 ? 'Bagus! Sedikit lagi menuju target.' : 
                 'Ayo semangat! Selesaikan tugasmu satu per satu.'}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-primary-600" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Tugas</span>
              </div>
              <p className="text-4xl font-display font-bold text-slate-900 dark:text-white">{totalCount}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tugas terdaftar di sistem</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm h-64">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Tugas per Mata Pelajaran</h4>
            {Object.keys(subjectStats).length > 0 ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-400 text-sm italic">Belum ada data mata pelajaran</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
