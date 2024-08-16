'use strict'

function saveToStorage(key, val) {
    const valStr = JSON.stringify(val)
    sessionStorage.setItem(key, valStr)
}

function loadFromStorage(key) {
    const valStr = sessionStorage.getItem(key)
    return JSON.parse(valStr)
}