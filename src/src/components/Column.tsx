import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Column as ColumnType, Task } from '../types';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

interface ColumnProps {
  column: ColumnType;
  onAddTask: (columnId: string) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function Column({ column, onAddTask, onUpdateTask, onDeleteTask }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="w-80 bg-gray-100 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{column.title}</h2>
        <button
          onClick={() => onAddTask(column.id)}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <Plus size={20} />
        </button>
      </div>
      <div ref={setNodeRef} className="space-y-3">
        <SortableContext
          items={column.tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}