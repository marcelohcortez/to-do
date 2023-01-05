import { useState, useEffect } from 'react'
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill, BsPlusLg } from "react-icons/bs"

import Loading from "./assets/loading.svg"

import './App.scss'

const API = "http://localhost:5000"

export default function App() {

  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [todoList, setTodoList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { //on every page load, run this
    const loadData = async () => {
      setLoading(true) //show loading animation

      const response = await fetch(API + "/todoList")
        .then((response) => response.json())
        .then((data) => data)
        .catch((err) => console.log(err)) //fetch the data and convert from json to an object array
      
      setLoading(false) //hide loading animation

      setTodoList(response) //populate the 'todoList'
    }

    loadData()
  }, [])
  
  //when the user submits the form
  const handleSubmit = async (e) => {
    e.preventDefault(); //don't let the page reload

    const setTaskID = Math.random() //just a temporary solution to generate the unique ID

    const newTask = {
      id: setTaskID,
      title,
      time,
      done: false
    }

    await fetch(API + "/todoList", {
      method: "POST",
      body: JSON.stringify(newTask),
      headers: {
        "Content-Type" : "application/json"
      }
    })

    setTodoList((prev) => [...prev, newTask]) //after inserting in the json, reload list with updated info

    setTitle("") //reset the input field
    setTime("") //reset the input field
  }

  //when the user deletes a task
  const handleDelete = async (id) => {
    await fetch(API + "/todoList/" + id, {
      method: "DELETE"
    })

    setTodoList((prev) => prev.filter((task) => task.id !== id)) //after deleting in the json, reload list with updated info
  }

  //when the use 'checks' a task as done or undone
  const handleEdit = async(todo) => {
    todo.done = !todo.done

    const data = await fetch(API + "/todoList/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type" : "application/json"
      }
    })

    setTodoList((prev) => prev.map( //after editing the json, reload list with updated info
      (task) => (
        task.id === data.id ? (task = data) : task
      )
    )) 
  }

  if (loading) {
    return <main><div className="loading" ><img src={Loading}/></div></main>
  }

  return (
    <main>
      <header>
          <h1>To Do App</h1>
      </header>
      <div className="app">
        <div className="form-block">
          <header>
            <h2>New Task</h2>
          </header>
          <form>
            <div className="form-control">
              <div className="form-item">
                <label htmlFor="title">Title of the task: </label>
                <input 
                  type="text" 
                  name="title" 
                  placeholder="Set the title" 
                  onChange={(e) => {setTitle(e.target.value)}} //set value as the title
                  value={title || ""} //controlled input, if not empty, show the title
                  required
                />
              </div>
              <div className="form-item"> 
                <label htmlFor="time">Estimated time for the task: </label>
                <input 
                  type="text" 
                  name="time" 
                  placeholder="Set the time" 
                  onChange={(e) => {setTime(e.target.value)}} //set value as the time
                  value={time || ""} //controlled input, if not empty, show the time
                />
              </div>
              <div className="button-holder">
                <a className="button" href="#" role="button" onClick={ handleSubmit }>
                  <span>Add task</span>
                  <div className="icon">
                    <BsPlusLg/>
                  </div>
                </a>
              </div>
            </div>
          </form>
        </div>
        <div className="tasks">
          <header>
            <h2>To Do List:</h2>
          </header>
          <div className="tasks-list">
            {(todoList.length === 0) ? 
              <p className="no-task-found">No task found.</p>
              :
              todoList.map((todo) => (
                <div className={todo.done ? "task done" : "task"} key={todo.id}>
                  <h3 className={todo.done ? "done" : ""}>{todo.title}</h3>
                  <p>Time: {todo.time}</p>
                  <div className="actions">
                    <span className="icon icon-edit" onClick={() => handleEdit(todo)}>
                      {todo.done ? <BsBookmarkCheckFill/> : <BsBookmarkCheck/>}
                    </span>
                    <span className="icon icon-delete">
                      <BsTrash onClick={() => handleDelete(todo.id)}/>
                      </span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </main>
  )
}
