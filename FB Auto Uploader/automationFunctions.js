function setTextArea(input, text) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set
    nativeInputValueSetter.call(input, text)

    const event = new Event('input', { bubbles: true })
    input.dispatchEvent(event)
}

function pasteText(ele, text) {
    console.log(ele)
    const dt = new DataTransfer()
    dt.setData('text/plain', text)

    const pasteEvent = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })
    ele.dispatchEvent(pasteEvent)
    ele.addEventListener('paste', (e) => {
        console.log('Pasted:', e.clipboardData.getData('text/plain'));
    });
}

const simulateMouseFocus = (element) => {
    ['mousedown', 'click', 'focus'].forEach(mouseEventType =>
        element.dispatchEvent(
            new MouseEvent(mouseEventType, {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1
            })
        )
    );
};


function checkElement(selector) {
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            if (document.querySelector(selector)) {
                clearInterval(intervalId);
                resolve(true);
            }
        }, 100);
    });
}
function checkElementPosted(selector) {
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            if (document.querySelector(selector).innerText.includes('processed')) {
                clearInterval(intervalId);
                resolve(true);
            }
        }, 100);
    });
}



function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function uploadVideo(videoUrl) {
    try {
        const VideoURL = chrome.runtime.getURL(`Videos/${videoUrl}`);
        const response = await fetch(VideoURL);
        const blob = await response.blob();
        const file = new File([blob], "uploaded_video.mp4", { type: blob.type });

        // Find the file input element
        const inputElement = document.querySelector('input[type="file"]');
        if (!inputElement) {
            console.error("❌ File input selector not found");
            document.querySelector('[aria-label="Photo/video"]').click()
            uploadVideo(videoUrl)
        }

        // Create a DataTransfer object and set the file
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputElement.files = dataTransfer.files;

        // ✅ Manually trigger input and change events
        inputElement.dispatchEvent(new Event("input", { bubbles: true }));
        inputElement.dispatchEvent(new Event("change", { bubbles: true }));

        console.log("✅ Video uploaded and change event triggered.");
        return true; // ✅ Return true when successful
    } catch (error) {
        console.error("❌ Error uploading video:", error);
        return false; // ❌ Return false on error
    }
}



async function uploadImageFromLink(imageName) {
    try {

        const imagePath = chrome.runtime.getURL(`images/${imageName}`)
        console.log(imagePath);
        const res = await fetch(imagePath)


        const blob = await res.blob()
        console.log(blob)
        const file = new File([blob], 'image.jpeg', { type: blob.type });

        const inputElement = document.querySelector('input[type="file"]')
        if (!inputElement) {
            throw new Error('Input element not found');
        }

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        // Assign the files to the input element
        inputElement.files = dataTransfer.files;
        const changeEvent = new Event('change', { bubbles: true });
        console.log(inputElement)
        inputElement.dispatchEvent(changeEvent);
        return true
    } catch (error) {
        console.log('Error uploading image:', error);
        return false;
    }
}

function setTextArea(input, text){
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLDivElement.prototype, 'value').set
    nativeInputValueSetter.call(input,text)

    const event = new Event('input', {bubbles: true})
    input.dispatchEvent(event)
}