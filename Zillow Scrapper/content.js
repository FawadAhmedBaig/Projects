// const totalWebsiteData = []
(async () => {
    const { status } = await chrome.storage.local.get('status')
    if (status) {
        getPageData()
    }
})()
async function getPageData() {

    // const mainSection = document.querySelector("#grid-search-results")
    const properties = document.querySelectorAll('article[role="group"] a')
    for (let property = 0; property < properties.length; property++) {
        const { status } = await chrome.storage.local.get('status')
        if (status) {
            scrollToElement(properties[property])
            await new Promise((rs, rj) => setTimeout(rs, 100))

            // console.log(property)
            // console.log(price, address, firstInventoryPrice, firstInventoryBed, badge)
            let url = properties[property].getAttribute('href')
            const doc = await fetchAndParseHTML(url)

            let spans = doc.querySelectorAll('[class="layout-content-container"] span');
            var price;
            for (let element of spans) {
                if (element.innerText.includes('$')) {
                    price = element.innerText || 'N/A';
                    break;
                }
            }
            console.log(price)

            // const price = properties[property].querySelector(`[data-test="property-card-price"]`)?.innerText?.split(' ')[0] || 'N/A'
            const address = doc.querySelector('[data-test-id="bdp-building-address"]')?.innerText || 'N/A'
            const ownerName = doc.querySelector('[data-testid="expandable-card"] [class="RCFOrientedSection"] span')?.innerText || 'N/A'
            const phoneNumber = doc.querySelector('[data-testid="expandable-card"] [class="RCFOrientedSection"] [data-test-id="agent-phone"]')?.innerText || 'N/A'


            let data = { price, address, ownerName, phoneNumber }
            const { totalWebsiteData } = await chrome.storage.local.get('totalWebsiteData');

            totalWebsiteData.push(data)

            chrome.storage.local.set({ totalWebsiteData });
        } else {
            const { totalWebsiteData } = await chrome.storage.local.get('totalWebsiteData');
            // chrome.storage.local.set({ status: false })
            jsonToCsv(totalWebsiteData)
            XlxSheet(totalWebsiteData)
            sendData(totalWebsiteData)

        }


    }

    const nextButton = document.querySelector('button[title="Next page"]')
    console.log(nextButton)
    scrollToElement(nextButton)
    await new Promise((rs, rj) => setTimeout(rs, 2000))
    if (nextButton.getAttribute('disabled') != '') { //if not disabled / enabled
        const nextPageURL = nextButton.href
        // deleteAllCookies();
        window.open(nextPageURL, target = "_self")
        // nextButton.click()
        // await new Promise((rs, rj) => setTimeout(rs, 2000))
        // getPageData()
    } else {
        const { totalWebsiteData } = await chrome.storage.local.get('totalWebsiteData');
        chrome.storage.local.set({ status: false })
        jsonToCsv(totalWebsiteData)
        XlxSheet(totalWebsiteData)
        sendData(totalWebsiteData)
    }

}

chrome.runtime.onMessage.addListener(function (req) {
    console.log(req);
    if (req.message == 'start') {
        getPageData()
    }

});



// function deleteAllCookies() {

//     var cookies = document.cookie.split("; ");
//     for (var c = 0; c < cookies.length; c++) {
//         var d = window.location.hostname.split(".");
//         while (d.length > 0) {
//             var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
//             var p = location.pathname.split('/');
//             document.cookie = cookieBase + '/';
//             while (p.length > 0) {
//                 document.cookie = cookieBase + p.join('/');
//                 p.pop();
//             };
//             d.shift();
//         }
//     }

// }


function scrollToElement(element) {
    element?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// let data = [{ name: 'Adeel' }, { name: "fawad" }]

// jsonToCsv(data)


function convertToCSV(jsonArray) {
    console.log(jsonArray);
    const headers = new Set();
    jsonArray.forEach(obj => Object.keys(obj).forEach(key => headers.add(key)));
    const headerArray = Array.from(headers);

    const csvRows = [];
    csvRows.push(headerArray.join(','));

    jsonArray.forEach(obj => {
        const row = headerArray.map(header => {
            const cell = obj[header] !== undefined ? obj[header] : '';
            return `"${cell}"`;
        });
        csvRows.push(row.join(','));
    });

    console.log(csvRows.join('\n'));

    return csvRows.join('\n');
}


async function jsonToCsv(jsonData) {

    const csv = convertToCSV(jsonData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        chrome.storage.local.set({ totalWebsiteData: [] });

    }


}



async function fetchAndParseHTML(url) {
    try{
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Network rsponse was not ok');
    }

    const htmlString = await response.text();

    const parser = new DOMParser();

    const doc = parser.parseFromString(htmlString, 'text/html');
    console.log(doc);

    return doc;
    } catch (error) {
        console.error('Error fetching and parsing HTML:', error); 
    }
}

// const pageHTML = await fetchAndParseHTML(template);
// console.log(pageHTML);
// const SRP = pageHTML.querySelector('[data-style-editor-text*=".msrp .price-value"]')?.innerText || ''
// const pageInfo = await getPageInfo(pageHTML, SRP, price, template)   

function XlxSheet(jsonData){
var ws = XLSX.utils.json_to_sheet(jsonData);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    var arrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    var blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "summit" + '.xlsx';

    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}

async function sendData(data) {
    console.log(data);

    // Use JSON.stringify to send the data as JSON in the body
    fetch('https://script.google.com/macros/s/AKfycbzssxz5opzDkHSod90I4mkNyI6hI2ZrISr8MxylX7uExITtrmP_2tuF4oAZzku7FOfS4g/exec', {
        method: 'POST',
        mode: 'no-cors',  // Note: 'no-cors' mode may prevent you from seeing the response
        headers: {
            'Content-Type': 'application/json'
        },
        body: new URLSearchParams(data)  // Convert the data to JSON format
    })
        .then(res => {
            // 'no-cors' will not allow reading the actual response
            console.log("Request sent");
            return res;
        })
        .then(data => {
            console.log("Response received", data);
        })
        .catch(error => {
            console.log('Error:', error);
        });
}
