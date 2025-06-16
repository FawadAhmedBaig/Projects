
function handleSubmit(event){
    event.preventDefault()
    console.log("Hello There!")
}

export default function Form(){
    return(
        <form onSubmit={handleSubmit}>
            <input type="password"/>
            <button>Submit</button>
        </form>
    )
}