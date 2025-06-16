import { useState } from "react"
import { v4 as uuidv4 } from 'uuid';

export default function TodoList(){
    let [newTodo, setNewTodo] = useState("")
    let [todos, setTodos] = useState([{task:"Sample Item", id: uuidv4(), isDone: false}])

    function updateTodoValue(event){
        setNewTodo(event.target.value)
    } 
    function addNewTask(){
        setTodos((prevTodos)=>{
            return [...prevTodos, {task: newTodo, id: uuidv4(), isDone: false}]
        })
        setNewTodo("")
    }
    function removeTask(id){
        setTodos((prevTodos)=>todos.filter((prevTodos)=>prevTodos.id !== id))
    }
    function updateAll(){
        setTodos((prevTodos)=> (
            prevTodos.map((todo)=>
            {
            return {...todo, task: todo.task.toUpperCase()}
            })
        ))
    }
        function markDoneAll(){
        setTodos((prevTodos)=> (
            prevTodos.map((todo)=>
            {
            return {...todo, isDone: !todo.isDone}
            })
        ))
    }
    function updateOne(id){
        setTodos((prevTodos)=> (
            prevTodos.map((todo)=>
            {
                if(todo.id === id){
                    return {...todo, task: todo.task.toUpperCase()}
                }
                else {
                    return todo
                }
        })
        ))
    }
    function taskDone(id){
        setTodos((prevTodos)=> (
            prevTodos.map((todo)=>
            {
                if(todo.id === id){
                    return {...todo, isDone: !todo.isDone}
                }
                else {
                    return todo
                }
        })
        ))
    }
        return (  
            <div>
                <h4>Todo List</h4>
                <input value={newTodo} type="text" onChange={updateTodoValue}/>
                <br></br>
                <button onClick={addNewTask}>Add Task</button>
                <br></br><br></br><br></br><br></br>
                <hr></hr>
                <h4>Tasks Todo</h4>
                <ul>
                    {todos.map((todo)=>(
                       <li key={todo.id}><span style={todo.isDone? {textDecoration: "line-through"} : {}}>{todo.task}</span>&nbsp;&nbsp;&nbsp;<span><button onClick={()=>removeTask(todo.id)}>Del</button> <button onClick={()=>updateOne(todo.id)}>Update</button> <button onClick={()=>taskDone(todo.id)}>Done</button> </span> </li>
                    ))}
                </ul>
                <br></br><br></br>
                <button onClick={updateAll}>Update All</button>&nbsp;&nbsp;&nbsp;&nbsp;
                <button onClick={markDoneAll}>Mark All Done</button>

            </div>
        )
}