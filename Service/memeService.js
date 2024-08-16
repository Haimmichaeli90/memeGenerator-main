'use strict'

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
    {
        txt: 'I sometimes eat Falafel',
            size: 20,
            color: 'red',
            x: 50,
            y: 50 
        },
        {
            txt: 'Do I Look Pretty Today?',
            size: 20,
            color: 'blue',
            x: 50,
            y: 70 
        }
    ]
}

function setMeme(updatedMeme) {
    gMeme = updatedMeme
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
}

function setLineTxt(txt){
    const meme = getMeme()
    meme.lines[meme.selectedLineIdx].txt = txt
}

function setLineColor(color) {
    const meme = getMeme()
    meme.lines[meme.selectedLineIdx].color = color
}

function setActiveLine(index) {
    const meme = getMeme()
    meme.selectedLineIdx = index
    setMeme(meme)
    renderMeme()
}

function setLineFontFamily(fontFamily) {
    const meme = getMeme()
    meme.lines[meme.selectedLineIdx].fontFamily = fontFamily
    setMeme(meme)
    renderMeme()
}

function getSavedMemes() {
    return loadFromStorage('savedMemes') || []
}

function getMemeImage() {
    const elCanvas = document.querySelector('.image-gallery div img')
    return elCanvas
}

function getImgs() {
    return  gImgs
}

function getMeme() {
    return gMeme
}

