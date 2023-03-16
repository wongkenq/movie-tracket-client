import { useEffect, useState } from 'react';
import axios from 'axios';
const api_base = 'http://localhost:9000';

function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoId, setNewTodoId] = useState('');
  const [updateMode, setUpdateMode] = useState(false);

  async function getTodos() {
    const response = await axios.get(api_base);
    setTodos(response.data);
  }

  useEffect(() => {
    getTodos();
  }, []);

  const createTodo = async (e, req, res) => {
    e.preventDefault();
    const response = await axios.post(`${api_base}/createTodo`, {
      text: newTodo,
    });
    setTodos([...todos, response.data.data]);
    setNewTodo('');

    console.log(response.data.data);
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${api_base}/todo/delete/${id}`);
    setTodos(todos);
  };

  const update = (todo) => {
    setUpdateMode(true);
    setNewTodo(todo.text);
    setNewTodoId(todo._id);
  };

  const updateTodo = async (e, id) => {
    e.preventDefault();
    await axios.put(`${api_base}/todo/update/${id}`, {
      text: newTodo,
    });
    const newTodoArr = [];
    todos.map((todo) => {
      if (todo._id === id) {
        todo.text = newTodo;
        newTodoArr.push(todo);
      } else {
        newTodoArr.push(todo);
      }
    });
    setTodos(newTodoArr);
    setNewTodo('');
    setUpdateMode(false);
  };

  const handleComplete = async (id, complete) => {
    await axios.put(`${api_base}/todo/complete/${id}`, {
      complete: !complete,
    });
    const newTodoArr = [];
    todos.map((todo) => {
      if (todo._id === id) {
        todo.complete = !complete;
        newTodoArr.push(todo);
      } else {
        newTodoArr.push(todo);
      }
    });
    setTodos(newTodoArr);
  };

  const handleChange = (e) => {
    setNewTodo(e.target.value);
  };

  return (
    <div className="App">
      <form
        onSubmit={updateMode ? (e) => updateTodo(e, newTodoId) : createTodo}
      >
        <label htmlFor="todo">Todo</label>
        <input type="text" onChange={handleChange} value={newTodo} />
        <button>{updateMode ? 'Update' : 'Submit'}</button>
      </form>
      {todos.map((todo) => (
        <div key={todo._id}>
          <span onClick={() => handleComplete(todo._id, todo.complete)}>
            {todo.text} {`${todo.complete}`}
          </span>
          <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          <button onClick={() => update(todo)}>Update</button>
        </div>
      ))}
    </div>
  );
}

export default Todo;
