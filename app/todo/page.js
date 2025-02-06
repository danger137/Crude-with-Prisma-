'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchTodos = async () => {
  try {
    const res = await fetch('/api/todos');
    if (!res.ok) throw new Error('Failed to fetch tasks');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const createTodo = async (title) => {
  try {
    if (!title || typeof title !== "string" || title.trim() === "") {
      throw new Error("Invalid title input");
    }

    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim() }),
    });

    if (!res.ok) throw new Error('Failed to create task');

    return res.json();
  } catch (error) {
    console.error(error);
  }
};

const updateTodo = async ({ id, title }) => {
  try {
    const res = await fetch(`/api/todos/${id}`, {  // ✅ Corrected route
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      throw new Error(`Failed to update task: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};





const deleteTodo = async (id) => {
  try {
    const res = await fetch(`/api/todos/${id}`, { // ✅ Correct API route
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Failed to delete task: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};


function TodoApp() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  
  const queryClient = useQueryClient();

  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleCreateTodo = (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    createTodoMutation.mutate(newTodoTitle);
    setNewTodoTitle('');
  };

  const handleEditClick = (todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
  };

  const handleSaveEdit = (id, isCompleted) => {
    if (!editTitle.trim()) return;
    updateTodoMutation.mutate({ id, title: editTitle.trim(), isCompleted });
    setEditId(null);
  };

  const handleToggleComplete = (todo) => {
    updateTodoMutation.mutate({
      id: todo.id,
      title: todo.title,
      isCompleted: !todo.isCompleted,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">My Tasks</h1>

        <form onSubmit={handleCreateTodo} className="flex gap-4 mb-6">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Enter new task..."
            className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={createTodoMutation.isLoading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all"
            disabled={createTodoMutation.isLoading}
          >
            Add
          </button>
        </form>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading tasks...</p>
        ) : (
          <ul className="space-y-4">
            {todos?.map((todo) => (
              <li
                key={todo.id}
                className={`p-4 flex justify-between items-center rounded-lg transition-all shadow-md ${todo.isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => handleToggleComplete(todo)}
                    className="w-5 h-5 text-green-500"
                  />

                  {editId === todo.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className={`flex-1 text-lg ${todo.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>{todo.title}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {editId === todo.id ? (
                    <button
                      onClick={() => handleSaveEdit(todo.id, todo.isCompleted)}
                      className="text-green-500 hover:text-green-700 font-semibold"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(todo)}
                      className="text-blue-500 hover:text-blue-700 font-semibold"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteTodoMutation.mutate(todo.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TodoApp;
