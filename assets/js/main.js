const previewSection = document.querySelector(".preview_seaction");

const userInput = document.querySelector(".search_section input[type='text']");
const bringBtn = document.querySelector(".search_section button.bring");

bringBtn.addEventListener("click", () => {
    const userInputValue = userInput.value;
    const regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const ID = userInputValue.match(regex)[1];
    getData(ID)
})


async function getData(videoId) {
    let url = `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${videoId}`;
    let options = {
        method: "GET",
        headers: {
            'X-RapidAPI-Key': 'f83e220fdcmsh011f3866683bcbep1a8730jsnaa741684244d',
            'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com'
        }
    };

    const reponse = await fetch(url, options);
    const result = await reponse.json();
    showData(result)
}


function showData(data) {
    // video informations
    const videoTitle = data.title;
    const channelTitle = data.channelTitle;
    const viewsCount = `${data.viewCount} view`;
    const videoThumbnail = data.thumbnail[data.thumbnail.length - 1].url;

    // video download links
    const videoFormats = data.formats;

    // audio download link
    let audioFormat = null;
    for (let i = 0; i < data.adaptiveFormats.length; i++) {
        if (data.adaptiveFormats[i].itag == 139) {
            audioFormat = data.adaptiveFormats[i].url;
            break;
        }
    }

    youtubeVideoHtml(videoTitle, channelTitle, viewsCount, videoThumbnail)
    // this element has been created from the function above
    const downloadButtons = document.querySelector(".downloads_buttons");
    downloadButtonsHtml(downloadButtons, videoFormats, audioFormat)
}

function youtubeVideoHtml(videoTitle, channelTitle, viewsCount, videoThumbnail) {
    previewSection.innerHTML = `
        <div class="youtube_video">
            <div class="thumbnail">
                <img src="${videoThumbnail}" alt="">
            </div>
            <div class="video_title">${videoTitle}</div>
            <div class="video_channelNme">${channelTitle}</div>
            <div class="video_viewCount">${viewsCount}</div>
        </div>

        <div class="downloads_buttons">
        </div>
    `;
}

function downloadButtonsHtml(element, downloadDataLinks, audioFormat) {
    for (let i = 0; i < downloadDataLinks.length; i++) {
        let currentFormatObject = downloadDataLinks[i];

        element.innerHTML += `
            <button 
                class="btn_to_download" 
                data-downloadurl="${currentFormatObject.url}">
                ${currentFormatObject.qualityLabel}
            </button>
        `;
    };

    element.innerHTML += `
            <button 
                class="btn_to_download" 
                data-downloadurl="${audioFormat}">
                audio / mp3
            </button>
    `

    const btn = document.querySelectorAll(".btn_to_download");

    btn.forEach(button => {
        button.addEventListener("click", () => {
            const downloadUrl = button.dataset.downloadurl;
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.target = "_blank";
            a.click()
        })
    })

    previewSection.style.display = "block";
}
