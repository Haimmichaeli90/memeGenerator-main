
'use strict'

function onImgSelect(imgId) {
    setImg(imgId)
    renderMeme()
    switchToEditor()
}

function onOpenGallery() {
    renderGallery()
    switchToGallery()
}

function renderGallery() {
    const imgs = getImgs()
    const elGalleryContainer = document.querySelector('.gallery')
    const filterInput = document.querySelector('#gallery-filter')
    const datalist = document.querySelector('#gallery-keywords')

    const keywordsObj = {}
    imgs.forEach(img => {
        img.keywords.forEach(keyword => {
            keywordsObj[keyword] = true
        })
    })
    const keywordsArray = Object.keys(keywordsObj)
    datalist.innerHTML = keywordsArray.map(keyword => `<option value="${keyword}">`).join('')

    // Filter images
    const filterText = filterInput.value.toLowerCase()
    const filteredImgs = imgs.filter(img => img.keywords.some(keyword => keyword.toLowerCase().includes(filterText)))
    const strHtmls = filteredImgs.map(img => `
        <section class="gallery-item">
            <img src="${img.url}" data-id="${img.id}" alt="Meme Image" onclick="onImgSelect(${img.id})" style="width: 240px;height: 240px;">
        </section>
    `).join('')
    elGalleryContainer.innerHTML = strHtmls
}
 

function switchToGallery() {
    document.querySelector('.saved-page').style.display = 'none'
    document.querySelector('.meme-editor').style.display = 'none'
    document.querySelector('.image-gallery').style.display = 'none'
    document.querySelector('.new-gallery').style.display = 'block'
}