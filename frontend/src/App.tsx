// frontend/src/App.tsx
import { useEffect, useState, ChangeEvent } from 'react';
import API from './api';
import { Task } from './types'; // Import our contract

const App = () => {
  // We tell React: "tasks is an array of Task objects"
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");

  // NEW: Professional UI states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // FETCH: Same logic, but TypeScript ensures 'response.data' matches Task[]
  const fetchTasks = async () => {
    setIsLoading(true); // 1. Start loading
    setError(null);     // 2. Clear old errors
    try {
      const response = await API.get<Task[]>('tasks/');
      setTasks(response.data);
    } catch (err: any) {
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setIsLoading(false); // 3. Stop loading no matter what
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- NEW: ADD TASK LOGIC ---
  const addTask = async () => {
    if (!newTaskTitle.trim()) return; // Don't add empty tasks
    try {
      // We tell API.post to expect a 'Task' object back from Django
      const response = await API.post<Task>('tasks/', {
        title: newTaskTitle,
        completed: false
      });
      setTasks([...tasks, response.data]); // Add new task to list
      setNewTaskTitle(""); // Clear the input
    } catch (error: any) { 
  // 'any' is the quick fix, but for learning:
  // In a real app, we check if it's an axios error
  console.error("Operation failed:", error.message);
  }
  };

  // UPDATE (Toggle): We pass the whole 'task' object
  const toggleTask = async (task: Task) => {
    try {
      // PATCH only sends the change. 
      // API.patch<Task> tells TypeScript the return value will be a Task.
      const response = await API.patch<Task>(`tasks/${task.id}/`, { 
        completed: !task.completed 
      });

      // UPDATE LOGIC:
      // We loop through the current tasks. If the ID matches the one we changed,
      // we replace it with the response from the server. Otherwise, keep it as is.
      setTasks(tasks.map(t => t.id === task.id ? response.data : t));
    } catch (error: any) { 
  // 'any' is the quick fix, but for learning:
  // In a real app, we check if it's an axios error
  console.error("Operation failed:", error.message);
  }
  };

  // DELETE: We only need the ID (number)
  const deleteTask = async (id: number) => {
    try {
      await API.delete(`tasks/${id}/`);
      // FILTER LOGIC:
      // Keep every task EXCEPT the one with the ID we just deleted.
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error: any) { 
  // 'any' is the quick fix, but for learning:
  // In a real app, we check if it's an axios error
  console.error("Operation failed:", error.message);
  }
  };

  // --- LEARN: Handling Input Events in TypeScript ---
  // We use ChangeEvent<HTMLInputElement> so TS knows 'e.target.value' is a string
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.target.value);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>My Tasks</h1>
      
      {/* Show error message if it exists */}
      {error && (
        <div style={{ color: 'white', background: '#ff4d4d', padding: '10px', borderRadius: '5px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      
      {/* Input Section */}
      <div style={{ marginBottom: '1rem' }}>
        <input 
          type="text"
          value={newTaskTitle}
          onChange={handleInputChange}
          placeholder="Enter task title..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* List Section */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: '0.5rem' }}>
            <span 
              onClick={() => toggleTask(task)}
              style={{ 
                textDecoration: task.completed ? 'line-through' : 'none',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- CRITICAL: Export the component so it shows up! ---
export default App;