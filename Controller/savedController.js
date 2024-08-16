'use strict'

function onOpenSaved() {
    renderSavedMemes()
    switchToSaved()
}

function renderSavedMemes() {
    const savedMemes = getSavedMemes();
    const elSavedContainer = document.querySelector('.saved-container')

    const memesHtml = savedMemes.map((meme, idx) => {
        const lines = Array.isArray(meme.lines) ? meme.lines : []
        const linesHtml = lines.map((line) =>
        ` <div  style="
                position: absolute;
                left: ${line.x || 50}%;
                top: ${line.y || 50}%;
                transform: translate(-50%, -50%);
                font-size: ${line.size}px;
                color: ${line.color};
                font-family: ${line.fontFamily || 'Arial'};
                text-align: ${line.align || 'center'};
                white-space: nowrap;
            ">
                ${line.txt}
            </div>
            `
        ).join('')
        return `
        <div style="position: relative; display: inline-block; margin: 10px;">
        <img src="${meme.dataUrl}" style="display: block;width:500px; height: 380px;">
        ${linesHtml}
        <button onclick="editSavedMeme(${idx})">Edit</button>
        </div>
        `
    }).join('')
    elSavedContainer.innerHTML = memesHtml
}

function editSavedMeme(idx) {
    const savedMemes = getSavedMemes()
    const meme = savedMemes[idx]

    if(meme)
    setMeme({
        selectedImgId: meme.id,
        selectedLineIdx: 0,
        lines: meme.lines
    })
    switchToEditor()
    renderMeme()
}

function saveMemeToStorage() {
    const image = getMemeImage()
    const meme = getMeme()
    const jsonArr = getImgs()

    jsonArr.forEach(json => {
        if (image.currentSrc.indexOf(json.url) !== -1) {
            meme.id = json.id
        }
    })

    const savedMemes = loadFromStorage('savedMemes') || []
    const existingMemeIdx = savedMemes.findIndex(savedMeme => savedMeme.id === meme.id)
    if (existingMemeIdx !== -1) {
        savedMemes[existingMemeIdx] = {
            id: meme.id,
            dataUrl: image.currentSrc,
            lines: meme.lines   
        }
    } else {
        // If not found, push as new
        savedMemes.push({
            id: meme.id,
            dataUrl: image.currentSrc,
            lines: meme.lines
        })
    }
    saveToStorage('savedMemes', savedMemes);
}

 
function onSaveMeme() {
    const meme = getMeme()
    const dataUrl = getMemeImage()
    meme.dataUrl = dataUrl
    saveMemeToStorage(meme)
    document.querySelector('.message-modal').style.display = 'block'
    setTimeout(() => document.querySelector('.message-modal').style.display = 'none', 2000)
}

function onSaveMeme() {
    saveMemeToStorage()
    document.querySelector('.message-modal').classList.remove('hidden')
    setTimeout(() => {
        document.querySelector('.message-modal').classList.add('hidden')
    }, 2000)
}
 
function switchToSaved() {
    document.querySelector('.meme-editor').style.display = 'none'
    document.querySelector('.new-gallery').style.display = 'none'
    document.querySelector('.image-gallery').style.display = 'none'
    document.querySelector('.saved-page').style.display = 'block'
}