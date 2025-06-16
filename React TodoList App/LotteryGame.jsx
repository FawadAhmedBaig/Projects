import { useState } from "react"
import { genRandomNumbers } from "./helper"
import {sum} from "./helper"


export default function LotteryGame(){
    let [ticket, setTicket] = useState(genRandomNumbers(3))
    let isWinning = sum(ticket)===15
    function genTicket(){
    setTicket(genRandomNumbers(3))
    }
    return (
        <div>
            <h1>Lottery Game</h1>
            <div style={{border: "2px solid white", borderRadius: "14px"}}>
                <span>{ticket[0]}</span>
                <span>{ticket[1]}</span>
                <span>{ticket[2]}</span>
            </div>
            <br></br>
            <button onClick={genTicket}>Buy Ticket</button>
            <h3>{isWinning && "Congratulations, You Won!"}</h3>
        </div>
    )
}