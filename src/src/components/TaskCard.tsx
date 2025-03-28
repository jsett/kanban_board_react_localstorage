import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import MDEditor from '@uiw/react-md-editor';
import { Trash2, GripVertical } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow p-3"
    >
      <div className="flex justify-between items-start mb-2">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical size={16} className="text-gray-400" />
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      {isEditing ? (
        <MDEditor
          value={task.content}
          onChange={(value) => {
            onUpdate({ ...task, content: value || '' });
          }}
          onBlur={() => setIsEditing(false)}
          preview="edit"
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="cursor-pointer"
        >
          <MDEditor.Markdown source={task.content} />
        </div>
      )}
    </div>
  );
}