(async ()=>{
    const {status} = await chrome.storage.local.get('status');

    if(status){
        document.querySelector('#start_button').setAttribute('disabled', true)
        document.querySelector('#stop_button').removeAttribute('disabled');
    }
    else{
        document.querySelector('#start_button').removeAttribute('disabled')
        document.querySelector('#stop_button').setAttribute('disabled', true)
    }

    setInterval(async ()=>{
        const {status} = await chrome.storage.local.get('status')
        if (status){
            const {count} = await chrome.storage.local.get('count')
            console.log(count);
            document.getElementById('success').innerText = count;
        }
    }, 500)

    document.querySelector('#start_button').addEventListener('click', async(e)=>{
        chrome.storage.local.set({count: 0})
        chrome.storage.local.set({status: true});

        e.target.setAttribute('disabled', true)
        document.querySelector('#stop_button').removeAttribute('disabled')

        chrome.tabs.query({currentWindow: true, active: true}, (tabs)=>{
            const activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {message: "start"}).catch(console.log);
        });
    })

    document.querySelector('#stop_button').addEventListener('click', (e)=>{
        chrome.storage.local.set({status: false})
        
        e.target.setAttribute('disabled', true);
        document.querySelector('#start_button').removeAttribute('disabled')

        chrome.tabs.query({currentWindow: true, active: true}, (tabs)=>{
            const activeTab = tabs[0]
            chrome.tabs.sendMessage(activeTab.id, {message: "stop"}).catch(console.log)
        })
    })

})()