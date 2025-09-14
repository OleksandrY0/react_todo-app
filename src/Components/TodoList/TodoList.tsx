import React, { useContext, useState } from 'react';
import { Todo, TodoContext } from '../../context/TodoContext';

interface Props {
  todos: Todo[];
  onEditComplete: () => void;
}
export const TodoList: React.FC<Props> = ({ todos, onEditComplete }) => {
  const { deleteTodo, toggleTodo, editTodo } = useContext(TodoContext);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleEditStart = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingValue(todo.title);
  };

  const handleEditSubmit = (id: number) => {
    editTodo(id, editingValue);

    setEditingId(null);
    onEditComplete();
  };

  const handleEditCancel = (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo) setEditingValue(todo.title);
    setEditingId(null);
    onEditComplete();
  };

  return (
    <>
      {todos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={`todo ${todo.completed ? 'completed' : ''} ${editingId === todo.id ? 'editing' : ''}`}
          onDoubleClick={() => handleEditStart(todo)}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
          </label>

          {editingId === todo.id ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleEditSubmit(todo.id);
              }}
            >
              <input
                className="todo__title-field"
                data-cy="TodoTitleField"
                value={editingValue}
                onChange={e => setEditingValue(e.target.value)}
                onBlur={() => handleEditSubmit(todo.id)}
                onKeyUp={e => {
                  if (e.key === 'Enter') handleEditSubmit(todo.id);
                  if (e.key === 'Escape') handleEditCancel(todo.id);
                }}
                autoFocus
              />
            </form>
          ) : (
            <>
              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>
            </>
          )}
        </div>
      ))}
    </>
  );
};
