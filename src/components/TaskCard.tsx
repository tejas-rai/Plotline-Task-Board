import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskStatus } from '../types';
import { 
  GripVertical, 
  MoreVertical, 
  Trash, 
  Clock, 
  ArrowRight, 
  Check, 
  ArrowLeft,
  XCircle
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard = ({ task, onStatusChange, onDelete }: TaskCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusActions = () => {
    switch (task.status) {
      case 'todo':
        return [
          {
            icon: <ArrowRight className="w-4 h-4 mr-1" />,
            label: 'Move to Progress',
            action: () => onStatusChange(task.id, 'inProgress')
          },
        ];
      case 'inProgress':
        return [
          {
            icon: <ArrowLeft className="w-4 h-4 mr-1" />,
            label: 'Move to Todo',
            action: () => onStatusChange(task.id, 'todo')
          },
          {
            icon: <Check className="w-4 h-4 mr-1" />,
            label: 'Mark Complete',
            action: () => onStatusChange(task.id, 'done')
          },
        ];
      case 'done':
        return [
          {
            icon: <ArrowLeft className="w-4 h-4 mr-1" />,
            label: 'Move to Progress',
            action: () => onStatusChange(task.id, 'inProgress')
          },
        ];
      default:
        return [];
    }
  };
  
  const statusActions = getStatusActions();
  const formattedDate = new Date(task.createdAt).toLocaleDateString();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-white rounded-lg shadow-sm border transition-all ${expanded ? 'p-4' : 'p-3'}`}
    >
      <div className="flex items-start">
        <div 
          {...listeners} 
          className="cursor-grab mt-1 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <GripVertical className="w-5 h-5" />
        </div>
        
        <div className="flex-grow cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex justify-between">
            <h3 className="font-medium text-gray-800">{task.title}</h3>
            
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 focus:outline-none"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border z-10">
                  <div className="py-1">
                    {statusActions.map((action, index) => (
                      <button 
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.action();
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        {action.icon}
                        {action.label}
                      </button>
                    ))}
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.id);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <Trash className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Categories and metadata */}
          <div className="flex flex-wrap gap-2 mt-2 items-center">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor()}`}>
              {task.priority}
            </span>
            
            {task.category && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                {task.category}
              </span>
            )}
            
            <span className="text-xs text-gray-500 flex items-center ml-auto">
              <Clock className="w-3 h-3 mr-1" />
              {formattedDate}
            </span>
          </div>
          
          {/* Expandable description */}
          {expanded && task.description && (
            <div className="mt-3 text-sm text-gray-600 border-t pt-3">
              {task.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;