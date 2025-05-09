(async () => {
    // const { fullData } = await chrome.storage.local.get('fullData')

    // console.log(fullData);

    chrome.storage.onChanged.addListener((data, areaName) => {
        console.log(areaName);
        console.log(data);
        if (areaName == 'local' && data?.totalWebsiteData?.newValue) {
            document.querySelector('#success').innerText = data.totalWebsiteData.newValue.length
        }
    })

    const { status } = await chrome.storage.local.get('status')

    if (status) {
        document.querySelector('#start_button').setAttribute('disabled', true)
        document.querySelector('#stop_button').removeAttribute('disabled')
    } else {
        document.querySelector('#start_button').removeAttribute('disabled')
        document.querySelector('#stop_button').setAttribute('disabled', true)
    }

    setInterval(async () => {
        const { status } = await chrome.storage.local.get('status')
        if (status) {
            const { count } = await chrome.storage.local.get('count');
            document.getElementById("success").innerText = count;
        }
    }, 500)

    document.querySelector('#start_button').addEventListener('click', (e) => {
        console.log('clcik');



        chrome.storage.local.set({ count: 0 })
        chrome.storage.local.set({ fullCount: 0 })


        chrome.storage.local.set({ status: true })

        document.querySelector('#start_button').setAttribute('disabled', true)
        document.querySelector('#stop_button').removeAttribute('disabled')

        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { message: "start" }).catch(console.log);
        });


    })

    document.querySelector('#stop_button').addEventListener('click', async (e) => {
        console.log('stopped clicked');
        e.target.setAttribute('disabled', true);
        document.querySelector('#start_button').removeAttribute('disabled')

        chrome.storage.local.set({ status: false })


    })


    document.querySelector('#download_csv_button').addEventListener('click', async (e) => {
        // jsonToCsv()
        const { totalWebsiteData } = await chrome.storage.local.get('totalWebsiteData');
        jsonToCsv(totalWebsiteData)
    })

    document.querySelector('#download_excel_button').addEventListener('click', async (e) => {
        // jsonToCsv()
        const { totalWebsiteData } = await chrome.storage.local.get('totalWebsiteData');
        XlxSheet(totalWebsiteData)
    })


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

        if (jsonData.length) {
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
            }
        } else {
            alert('There is no data to export!')
        }
    }
})()
