import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Header from './components/Header';
import TaskColumn from './components/TaskColumn';
import AddTaskModal from './components/AddTaskModal';
import { Task, TaskStatus } from './types';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Setup DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    setIsAddModalOpen(false);
  };
  
  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };
  
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inProgress');
  const doneTasks = tasks.filter(task => task.status === 'done');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header onAddClick={() => setIsAddModalOpen(true)} />
      
      <main className="container mx-auto p-4 pt-6 md:p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <SortableContext items={todoTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <TaskColumn 
                title="To Do" 
                tasks={todoTasks} 
                onStatusChange={updateTaskStatus} 
                onDelete={deleteTask}
                status="todo"
              />
            </SortableContext>
            
            <SortableContext items={inProgressTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <TaskColumn 
                title="In Progress" 
                tasks={inProgressTasks} 
                onStatusChange={updateTaskStatus} 
                onDelete={deleteTask} 
                status="inProgress"
              />
            </SortableContext>
            
            <SortableContext items={doneTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <TaskColumn 
                title="Done" 
                tasks={doneTasks} 
                onStatusChange={updateTaskStatus} 
                onDelete={deleteTask}
                status="done"
              />
            </SortableContext>
          </div>
        </DndContext>
      </main>
      
      <AddTaskModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={addTask}
      />
    </div>
  );
};

export default App;