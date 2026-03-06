export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
}

export interface ScheduleItem {
  id: string;
  day: string;
  subject: string;
}

export type View = 'dashboard' | 'tasks' | 'schedule' | 'statistics';
