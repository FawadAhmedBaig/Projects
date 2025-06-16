import { useState } from "react"

function init(){
    console.log("init was executed!")
    return Math.random()
}

export default function LikeButton(){
    
    let [isLiked, setIsLiked] = useState(false)
    let [count, setCount] = useState(init)
    
    function toggle(){
        setIsLiked(!isLiked)
        setCount((curCount)=>
            {return curCount + 1}
        )        
        setCount((curCount)=>
            {return curCount + 2}
        )
    }
    

    return(
        <>
            <h1>Sate Activity</h1>
            <p onClick={toggle}>
                {(isLiked)? <i class="fa-solid fa-heart" style={{color: "blue", fontSize : "70px"}}></i> : <i className="fa-regular fa-heart" style={{fontSize : "70px"}}></i>}
            </p>
            <h3>Count: {count}</h3>
        </>
    )
}