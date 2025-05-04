import { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: TaskStatus;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

const TaskColumn = ({ title, tasks, status, onStatusChange, onDelete }: TaskColumnProps) => {
  const getColumnColor = () => {
    switch (status) {
      case 'todo': return 'from-blue-50 to-blue-100 border-blue-200';
      case 'inProgress': return 'from-amber-50 to-amber-100 border-amber-200';
      case 'done': return 'from-teal-50 to-teal-100 border-teal-200';
      default: return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const getHeaderColor = () => {
    switch (status) {
      case 'todo': return 'bg-blue-500 text-white';
      case 'inProgress': return 'bg-amber-500 text-white';
      case 'done': return 'bg-teal-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden shadow-md border bg-gradient-to-b ${getColumnColor()}`}>
      <div className={`px-4 py-3 font-medium ${getHeaderColor()}`}>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{title}</h3>
          <span className="bg-white bg-opacity-30 px-2 py-0.5 rounded text-sm">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div className="p-3 min-h-[150px]">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-20 border border-dashed rounded-lg border-gray-300 bg-white bg-opacity-50 text-gray-400">
            No tasks yet
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;