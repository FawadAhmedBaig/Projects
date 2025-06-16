
function handleClick(){
    console.log("Clicked!")
}

function handleHover(){
    console.log("Hello")
}

function handleDblClick(){
    console.log("Double Clicked!!!!")
}

export default function Button(){
    return (
        <>
        <button onClick={handleClick} onMouseOver={handleHover}>Click Me!</button>
        <p onClick={handleClick} onDoubleClick={handleDblClick}>Hi Click Me!</p>

        </>
    )
}