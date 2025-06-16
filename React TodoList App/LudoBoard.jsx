import { useState } from "react"


export default function LudoBoard(){
    
    let [moves, setMoves] = useState({blue: 0, red:0 , yellow: 0, green: 0})
    let [arr, setArr] = useState(["no moves"])
    
    let updateBlue = ()=>{
        console.log(`moves.blue: ${moves.blue}`)
        console.log(arr)
        setMoves((prevMoves)=>{
            return {...prevMoves, blue : moves.blue+1}
        })
        setArr((prevArr)=>{
            return [...prevArr, "blue moves"]
        })
    }
        let updateGreen = ()=>{
        console.log(`moves.green: ${moves.green}`)
        setMoves((prevMoves)=>{
            return {...prevMoves, green : moves.green+1}
        })
    }
        let updateRed = ()=>{
        console.log(`moves.red: ${moves.red}`)
        setMoves((prevMoves)=>{
            return {...prevMoves, red : moves.red+1}
        })
    }
        let updateYellow = ()=>{
        console.log(`moves.yellow: ${moves.yellow}`)
        setMoves((prevMoves)=>{
            return {...prevMoves, yellow : moves.yellow+1}
        })
    }
    
    return (
        <div>
            <p >Blue Moves: {moves.blue}</p>
            <button onClick={updateBlue} style={{color: "blue"}}>+1</button>
            <p>Green Moves: {moves.green}</p>
            <button onClick={updateGreen} style={{color: "green"}}>+1</button>
            <p>Red Moves: {moves.red}</p>
            <button onClick={updateRed} style={{color: "red"}}>+1</button>
            <p>Yellow Moves: {moves.yellow}</p>
            <button onClick={updateYellow} style={{color: "yellow"}}>+1</button>
        </div>
    )
}