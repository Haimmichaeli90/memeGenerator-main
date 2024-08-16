'use strict'

let gElCanvas
let gCtx
let gStartPos
let gDragTarget = null
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

var gImgs = [
    { id: 1, url: 'img/1.jpeg', keywords: ['excited', 'cat'] },
    { id: 2, url: 'img/2.jpeg', keywords: ['Funny', 'lama'] },
    { id: 3, url: 'img/3.jpeg', keywords: ['HAPPY', 'penguin'] },
    { id: 4, url: 'img/4.jpeg', keywords: ['superAnimal', 'monkey'] },
    { id: 5, url: 'img/5.jpeg', keywords: ['HAPPY', 'dog'] },
    { id: 6, url: 'img/6.jpeg', keywords: ['superAnimal', 'cat'] },
    { id: 7, url: 'img/7.jpeg', keywords: ['HAPPY', 'dog'] },
    { id: 8, url: 'img/8.jpeg', keywords: ['Animal', 'monkey'] },
    { id: 9, url: 'img/9.jpeg', keywords: ['Funny', 'cat'] },
    { id: 10, url: 'img/10.jpeg', keywords: ['Funny', 'cat'] },
    { id: 11, url: 'img/11.jpeg', keywords: ['superAnimal', 'raccoon'] },
    { id: 12, url: 'img/12.jpeg', keywords: ['exited', 'giraffe'] },
    { id: 13, url: 'img/13.jpeg', keywords: ['superAnimal', 'kangaroo'] },
    { id: 14, url: 'img/14.jpeg', keywords: ['superAnimal', 'Elephant'] },
    { id: 15, url: 'img/15.jpeg', keywords: ['Animal', 'rabbit'] },
]

const emojis = [
    0x1F600, 0x1F604, 0x1F34A, 0x1F344, 0x1F37F, 0x1F363, 0x1F370, 0x1F355,
    0x1F354, 0x1F35F, 0x1F6C0, 0x1F48E, 0x1F5FA, 0x23F0, 0x1F579, 0x1F4DA,
    0x1F431, 0x1F42A, 0x1F439, 0x1F424
]


function onInit() {
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    renderMeme()
    renderGallery()
    generateRandomMeme()
    createEmojiPicker()
    var filterInput = document.querySelector('#gallery-filter')
    filterInput.oninput = function() {
        renderGallery()
    }
}

function initGallery() {
    createKeywordElements()
    displayImages(gImgs)
}

function createKeywordElements() {
    const keywordContainer = document.getElementById('keyword-container')
    keywordContainer.innerHTML = ''
    const keywords = []

    for (let keyword in gKeywordSearchCountMap) {
        keywords.push(keyword)
    }

    keywords.forEach(keyword => {
        const count = gKeywordSearchCountMap[keyword]
        const fontSize = Math.min(20 + count, 40)
        const keywordElement = `
            <span class="keyword" onclick="filterByKeyword('${keyword}')" style="font-size: ${fontSize}px;">
                ${keyword}
            </span>
        `
        keywordContainer.innerHTML += keywordElement
    })
}

function filterByKeyword(keyword) {
    const filteredImgs = gImgs.filter(img => img.keywords.includes(keyword))
    displayImages(filteredImgs)
    highlightSelectedKeyword(keyword)
}

function displayImages(images) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = images.map(img => `
        <div class="gallery-item">
            <img src="${img.url}" alt="Image">
        </div>
    `).join('')
}

function highlightSelectedKeyword(selectedKeyword) {
    const keywords = document.querySelectorAll('.keyword')
    keywords.forEach(kw => {
        if (kw.textContent === selectedKeyword) {
            kw.classList.add('active')
        } else {
            kw.classList.remove('active')
        }
    })
}
function addDragListeners() {
    const lines = document.querySelectorAll('.meme-line')

    lines.forEach(line => {
        line.onmousedown = onDown
        line.onmousemove = onMove
        line.onmouseup = onUp

        line.ontouchstart = onDown
        line.ontouchmove = onMove
        line.ontouchend = onUp
    })
}

function onDown(ev) {
    const pos = getEvPos(ev)

    if (ev.target.dataset.index !== undefined) {
        const index = Number(ev.target.dataset.index)
        setActiveLine(index)
        gDragTarget = getMeme().lines[index]
        gStartPos = pos
        document.body.style.cursor = 'grabbing'
        ev.preventDefault()
    }
}

function onMove(ev) {
    if (!gDragTarget) return

    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y

    moveLine(gDragTarget, dx, dy)
    gStartPos = pos
    renderMeme()
}

function onUp() {
    gDragTarget = null
    document.body.style.cursor = 'grab'
}

function getEvPos(ev) {
    let pos = {
        x: ev.clientX,
        y: ev.clientY,
    }
    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.clientX,
            y: ev.clientY,
        }
    }
    return pos
}

function moveLine(line, dx, dy) {

    const imgContainer = document.querySelector('.image-container')
    const imgRect = imgContainer.getBoundingClientRect()

    const imgWidth = imgRect.width
    const imgHeight = imgRect.height

    line.x = Math.max(0, Math.min(100, line.x + (dx / imgWidth) * 100))
    line.y = Math.max(0, Math.min(100, line.y + (dy / imgHeight) * 100))

    setMeme(getMeme())
}

function onUploadImg() {
    // Gets the image from the canvas
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg')

    function onSuccess(uploadedImgUrl) {
        // Handle some special characters
        const url = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
    }

    // Send the image to the server
    doUploadImg(imgDataUrl, onSuccess)
}

// Upload the image to a server, get back a URL 
// call the function onSuccess when done
function doUploadImg(imgDataUrl, onSuccess) {
    // Pack the image for delivery
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    // Send a post req with the image to the server
    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        // If the request is not done, we have no business here yet, so return
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        // if the response is not ok, show an error
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR

        //* If the response is ok, call the onSuccess callback function, 
        //* that will create the link to facebook using the url we got
        console.log('Got back live url:', url)
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}