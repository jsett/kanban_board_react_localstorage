import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Column from './components/Column';
import { KanbanData, Task, Column as ColumnType } from './types';

const initialColumns: ColumnType[] = [
  { id: 'todo', title: 'To Do', tasks: [] },
  { id: 'inProgress', title: 'In Progress', tasks: [] },
  { id: 'done', title: 'Done', tasks: [] },
];

function App() {
  const [data, setData] = useState<KanbanData>(() => {
    const saved = localStorage.getItem('kanbanData');
    return saved ? JSON.parse(saved) : { columns: initialColumns };
  });

  useEffect(() => {
    localStorage.setItem('kanbanData', JSON.stringify(data));
  }, [data]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = findTask(active.id as string);
    if (!activeTask) return;

    const activeColumn = findColumn(activeTask.columnId);
    const overColumn = findColumn(over.id as string);

    if (!activeColumn || !overColumn) return;

    if (activeColumn.id === overColumn.id) {
      // Reorder within the same column
      const oldIndex = activeColumn.tasks.findIndex(t => t.id === active.id);
      const newIndex = activeColumn.tasks.findIndex(t => t.id === over.id);

      const newTasks = arrayMove(activeColumn.tasks, oldIndex, newIndex);
      updateColumn(activeColumn.id, { ...activeColumn, tasks: newTasks });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = findTask(active.id as string);
    if (!activeTask) return;

    const activeColumn = findColumn(activeTask.columnId);
    const overColumn = findColumn(over.id as string);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return;

    // Move task to new column
    const updatedTask = { ...activeTask, columnId: overColumn.id };
    const newActiveColumnTasks = activeColumn.tasks.filter(
      task => task.id !== activeTask.id
    );
    const newOverColumnTasks = [...overColumn.tasks, updatedTask];

    updateColumn(activeColumn.id, { ...activeColumn, tasks: newActiveColumnTasks });
    updateColumn(overColumn.id, { ...overColumn, tasks: newOverColumnTasks });
  };

  const findTask = (taskId: string): Task | undefined => {
    for (const column of data.columns) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) return task;
    }
  };

  const findColumn = (columnId: string): ColumnType | undefined => {
    return data.columns.find(c => c.id === columnId);
  };

  const updateColumn = (columnId: string, updatedColumn: ColumnType) => {
    setData(prev => ({
      ...prev,
      columns: prev.columns.map(col =>
        col.id === columnId ? updatedColumn : col
      ),
    }));
  };

  const handleAddTask = (columnId: string) => {
    const column = findColumn(columnId);
    if (!column) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      content: '# New Task\nClick to edit',
      columnId,
    };

    updateColumn(columnId, {
      ...column,
      tasks: [...column.tasks, newTask],
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const column = findColumn(updatedTask.columnId);
    if (!column) return;

    updateColumn(column.id, {
      ...column,
      tasks: column.tasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    });
  };

  const handleDeleteTask = (taskId: string) => {
    const task = findTask(taskId);
    if (!task) return;

    const column = findColumn(task.columnId);
    if (!column) return;

    updateColumn(column.id, {
      ...column,
      tasks: column.tasks.filter(t => t.id !== taskId),
    });
  };

  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Kanban Board</h1>
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex gap-6">
          {data.columns.map(column => (
            <Column
              key={column.id}
              column={column}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export default App;