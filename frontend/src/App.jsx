import { useEffect, useState } from 'react'
import API from './api'

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // 1. Fetch tasks from Django
  const fetchTasks = async () => {
    try {
      const response = await API.get('tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. Add a new task
  const addTask = async () => {
    try {
      const response = await API.post('tasks/', { title: newTaskTitle, completed: false });
      setTasks([...tasks, response.data]); // Update UI immediately
      setNewTaskTitle(""); // Clear input
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Django + React Task List</h1>
      
      <input 
        value={newTaskTitle} 
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="New task..."
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} {task.completed ? "✅" : "⏳"}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App