let imagesData = undefined
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse){
    if(request.message == 'start'){
        videosData = await getData();
        console.log(videosData)
        const video = videosData.shift();
        console.log(video);
        post(video)
    }
})

async function post(video){
    const postButton = document.querySelectorAll('[aria-label="Create a post"] [role="button"]')[2]
    // await checkElements(postButton)
    postButton.click();

    await checkElement('[role="dialog"]>[method="POST"] [role="textbox"]')
    const inputTextField = document.querySelector('[role="dialog"]>[method="POST"] [role="textbox"]');
    pasteText(inputTextField, video['Caption'])

    const uploaded = await uploadVideo(video['Video Name'])

    if(uploaded){
        await checkElement('[aria-label="Attached media"] video')
        console.log('uploaded')
        await new Promise ((rs, rj) => setTimeout(rs, 2000))
        const postBtn = document.querySelector('[aria-label="Post"][role="button"')
        postBtn.click()
        await checkElementPosted('ul>li div[role = "alert"]>span>span')
        let {count} = await chrome.storage.local.get('count')
        count++;
        await chrome.storage.local.set({count});
        await new Promise ((rs, rj) => setTimeout(rs, 3000))
        console.log(videosData)
        const data = videosData.shift()
        console.log(data)
        let {status} = await chrome.storage.local.get('status')

        if(data && status){
            post(data)
        }
        else {
            chrome.storage.local.set({status: false})
            alert("All Videos Uploaded Successfully")
        }
    }
    else {
        console.log('not uploaded moving next upload');
        document.querySelector('[aria-label="Close"][role="button"]').click()
        console.log(videosData)
        const data = videosData.shift()
        console.log(data)
        if(data){
            post(data)
        }
        else {
            chrome.storage.local.set({status: false})
            alert("All Videos Uploaded Successfully")
        }
    }
}


async function getData() {
    try {
        const filePath = chrome.runtime.getURL("Video_Data.xlsx");
        console.log(filePath);

        // Fetch the file and convert it to an array buffer
        const response = await fetch(filePath);
        const data = await response.arrayBuffer();

        // Read the Excel workbook
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming the first sheet contains the data
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const range = { s: { r: 0, c: 0 }, e: { r: 1300, c: 4 } };

        // Parse data from the worksheet
        let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 2, range });
        console.log(jsonData);

        // Flatten and process the data
        jsonData = jsonData.flat(Infinity);
        console.log(jsonData);
        console.log(jsonData);

        return jsonData; // Return the processed data
    } catch (error) {
        console.error("Error loading the Excel file:", error);
    }
}