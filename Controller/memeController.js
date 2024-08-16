'use strict'

const ALIGNMENT_STEP = 1

function renderMeme() {
    const gallery = document.querySelector('.image-gallery')
    const meme = getMeme()
    
    const selectedImg = meme.img ? { url: meme.img } : gImgs.find(img => img.id === meme.selectedImgId)

    const linesHtml = meme.lines.map((line, index) => `
        <div data-index="${index}" style="
            position: absolute;
            left: ${line.x || 50}%;
            top: ${line.y || 50}%;
            transform: translate(-50%, -50%);
            font-size: ${line.size}px;
            color: ${line.color};
            font-family: ${line.fontFamily || 'Arial'};
            text-align: ${line.align || 'center'};
            white-space: nowrap;
            padding: 2px;
            width: 90%;
            box-sizing: border-box;
            ${line.type === 'sticker' ? `font-size: ${line.size}px;` : ''}
        " class="meme-line">
            ${line.txt}
        </div>
    `).join('')

    const imgHtml = `
        <div style="position: relative; display: inline-block;" class="image-container">
            <img src="${selectedImg.url}" style="display: block;">
            ${linesHtml}
        </div>
    `
    gallery.innerHTML = imgHtml
    addDragListeners()
}

function generateRandomMeme() {
    const randomImg = gImgs[Math.floor(Math.random() * gImgs.length)]
    const newMeme = {
        selectedImgId: randomImg.id,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'Your text here',
                size: 50,
                color: 'Yellow',
                x: 50,
                y: 10,
                fontFamily: 'Impact',
                align: 'center',
                type: 'text' 
            }
        ]
    }
    setMeme(newMeme)
    renderMeme()
    switchToEditor()
}

function switchToEditor() {
    document.querySelector('.meme-editor').style.display = 'block'
    document.querySelector('.saved-page').style.display = 'none'
    document.querySelector('.image-gallery').style.display = 'block'
    document.querySelector('.new-gallery').style.display = 'none'

    clearFileInput()
}

function onImgInput(ev) {
    loadImageFromInput(ev, function(elImg) {
        const newMeme = {
            selectedImgId: 'user-upload',
            selectedLineIdx: 0,
            lines: [
                {
                    txt: 'Your text here',
                    size: 20,
                    color: 'black',
                    x: 50,
                    y: 50,
                    fontFamily: 'Arial',
                    align: 'center',
                    type: 'text'
                }
            ],
            img: elImg.src 
        }
        setMeme(newMeme)
        renderMeme()
        switchToEditor()
    })
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()
    reader.onload = function (event) {
        let elImg = new Image()
        elImg.src = event.target.result
        elImg.onload = () => onImageReady(elImg)
    }
    reader.readAsDataURL(ev.target.files[0])
}

function clearFileInput() {
    const fileInput = document.getElementById('image-upload')
    fileInput.value = ''
}

function handleTextInput() {
    const textInput = document.querySelector('.meme-text')
    if (textInput) {
        const newText = textInput.value
        setLineTxt(newText)
        renderMeme()
    }
}

function handleColorChange() {
    const colorInput = document.querySelector('.text-color')
    if (colorInput) {
        const newColor = colorInput.value
        setLineColor(newColor)
        renderMeme()
    }
} 

function changeFontSize(action) {
    const meme = getMeme()
    const currentLine = meme.lines[meme.selectedLineIdx]
    if (action === 'increase') {
        currentLine.size += 5
    } else if (action === 'decrease') {
        currentLine.size = Math.max(8, currentLine.size - 2)
    }
    setMeme(meme)
    renderMeme()
}

function nextLine() {
    const meme = getMeme()
    const linesCount = meme.lines.length
    if (linesCount > 0) {
        meme.selectedLineIdx = (meme.selectedLineIdx + 1) % linesCount
        setMeme(meme)
        renderMeme()
        updateEditor()
    }
}

function deleteLine() {
    const meme = getMeme()
    if (meme.lines.length === 0) return
    meme.lines.splice(meme.selectedLineIdx, 1)
    meme.selectedLineIdx = Math.max(0, meme.selectedLineIdx - 1)
    setMeme(meme)
    renderMeme()
}

 
function detectTextClick(x, y) {
    const lines = document.querySelectorAll('.image-gallery div')
    lines.forEach((lineElement, index) => {
        const rect = lineElement.getBoundingClientRect()
        if (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        ) {
            setActiveLine(index)
        }
    })
}


function changeTextAlign(alignment) {
    const meme = getMeme()
    console.log('Changing text alignment to:', alignment)
    if (!['left', 'center', 'right'].includes(alignment)) {
        console.error('Invalid alignment value')
        return
    }
    meme.lines[meme.selectedLineIdx].align = alignment
    setMeme(meme)
    renderMeme()
}

function updateEditor() {
    const meme = getMeme()
    const selectedLine = meme.lines[meme.selectedLineIdx]
    if (selectedLine) {
        document.querySelector('.meme-text').value = selectedLine.txt
    }
}

function handleLineClick(index) {
    setActiveLine(index)
    updateEditor()
}

function addLine() {
    const meme = getMeme()
    const newLine = {
        txt: 'Add Here New Text',
        size: 20,
        color: 'blue',
        x: 30,
        y: 30,
        type: 'text'
    }
    meme.lines.push(newLine)
    meme.selectedLineIdx = meme.lines.length - 1
    setMeme(meme)
    renderMeme()
}

function addSticker(emoji) {
    const meme = getMeme()
    const newSticker = {
        txt: emoji,
        size: 40,
        color: 'black',
        x: 50,
        y: 50,
        type: 'sticker'
    }
    meme.lines.push(newSticker)
    meme.selectedLineIdx = meme.lines.length - 1
    setMeme(meme)
    renderMeme()
}

function toggleEmojiPicker() {
    const emojiPicker = document.querySelector('.emoji-picker')
    emojiPicker.style.display = (emojiPicker.style.display === 'none') ? 'block' : 'none'
}

function createEmojiPicker() {
    const emojiPicker = document.querySelector('.emoji-picker')
    emojiPicker.innerHTML = emojis.map(emoji => `
        <button onclick="addSticker('${String.fromCodePoint(emoji)}')">
            ${String.fromCodePoint(emoji)}
        </button>
    `).join('')
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
    renderMeme()
}

function downloadImg(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}
