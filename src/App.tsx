import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Schedule from './components/Schedule';
import Statistics from './components/Statistics';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Task, ScheduleItem, View } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [tasks, setTasks] = useLocalStorage<Task[]>('smartsma_tasks', []);
  const [schedule, setSchedule] = useLocalStorage<ScheduleItem[]>('smartsma_schedule', []);

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addSchedule = (itemData: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...itemData,
      id: crypto.randomUUID(),
    };
    setSchedule([...schedule, newItem]);
  };

  const deleteSchedule = (id: string) => {
    setSchedule(schedule.filter(item => item.id !== id));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard tasks={tasks} schedule={schedule} onNavigate={setCurrentView} />;
      case 'tasks':
        return (
          <Tasks 
            tasks={tasks} 
            onAddTask={addTask} 
            onToggleTask={toggleTask} 
            onDeleteTask={deleteTask} 
          />
        );
      case 'schedule':
        return (
          <Schedule 
            schedule={schedule} 
            onAddSchedule={addSchedule} 
            onDeleteSchedule={deleteSchedule} 
          />
        );
      case 'statistics':
        return <Statistics tasks={tasks} />;
      default:
        return <Dashboard tasks={tasks} schedule={schedule} onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}
