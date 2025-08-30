import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit3, Plus, CheckCircle } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API = `${API_BASE}/api`;

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async () => {
    if (!newTodo.title.trim()) return;
    
    try {
      const response = await axios.post(`${API}/todos`, newTodo);
      setTodos([...todos, response.data]);
      setNewTodo({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const updateTodo = async (todoId, updateData) => {
    try {
      const response = await axios.put(`${API}/todos/${todoId}`, updateData);
      setTodos(todos.map(todo => todo.id === todoId ? response.data : todo));
      setEditingTodo(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(`${API}/todos/${todoId}`);
      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const toggleComplete = (todo) => {
    updateTodo(todo.id, { completed: !todo.completed });
  };

  const startEditing = (todo) => {
    setEditingTodo({ ...todo });
  };

  const saveEdit = () => {
    updateTodo(editingTodo.id, {
      title: editingTodo.title,
      description: editingTodo.description
    });
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Todo List</h1>
          <p className="text-gray-600">Stay organized and get things done</p>
          <div className="mt-4 flex justify-center items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">{completedCount} completed</span>
            </div>
            <div className="text-sm text-gray-600">
              {totalCount} total tasks
            </div>
          </div>
        </div>

        {/* Add New Todo */}
        <Card className="p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Task</h2>
          <div className="space-y-4">
            <Input
              placeholder="Task title..."
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className="text-lg"
            />
            <Textarea
              placeholder="Description (optional)..."
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              rows={3}
            />
            <Button 
              onClick={createTodo} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </Button>
          </div>
        </Card>

        {/* Todo List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading tasks...</p>
            </div>
          ) : todos.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 text-lg">No tasks yet. Add one above to get started!</p>
            </Card>
          ) : (
            todos.map((todo) => (
              <Card 
                key={todo.id} 
                className={`p-6 shadow-md transition-all hover:shadow-lg ${
                  todo.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                }`}
              >
                {editingTodo && editingTodo.id === todo.id ? (
                  // Edit mode
                  <div className="space-y-4">
                    <Input
                      value={editingTodo.title}
                      onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                      className="text-lg font-medium"
                    />
                    <Textarea
                      value={editingTodo.description}
                      onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <Button onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingTodo(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display mode
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleComplete(todo)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h3 className={`text-lg font-medium ${
                        todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={`mt-1 ${
                          todo.completed ? 'line-through text-gray-400' : 'text-gray-600'
                        }`}>
                          {todo.description}
                        </p>
                      )}
                      <div className="mt-2 text-xs text-gray-400">
                        Created: {new Date(todo.created_at).toLocaleDateString()}
                        {todo.updated_at !== todo.created_at && (
                          <span className="ml-2">
                            • Updated: {new Date(todo.updated_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(todo)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;