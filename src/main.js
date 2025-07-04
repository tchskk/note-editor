import './style.css'

import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

const editor = new Editor({
  element: document.querySelector('#editor'),
  extensions: [
    StarterKit,
  ],
  autofocus: 'start',
})

const container = document.querySelector('#editor')
container.addEventListener('mousedown', (event) => {
  if (event.target === container) {
    const { doc } = editor.state
    const lastNode = doc.lastChild

    if (!lastNode || lastNode.type.name !== 'paragraph' || lastNode.content.size !== 0) {
      editor.commands.focus('end')
      editor.commands.enter()
    }

    editor.commands.focus('end')
    event.preventDefault()
  }
})

const optionsBtn = document.getElementById('options-btn')
const optionsMenu = document.getElementById('options-menu')
let menuOpen = false

optionsBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  optionsMenu.classList.toggle('show')
  menuOpen = !menuOpen
})

document.addEventListener('mousedown', (e) => {
  if (menuOpen && !optionsMenu.contains(e.target) && e.target !== optionsBtn) {
    optionsMenu.classList.remove('show')
    menuOpen = false
  }
})

// --- Font Family ---
const fontFamilySelect = document.getElementById('font-family-select')
fontFamilySelect.addEventListener('change', () => {
  const tiptap = document.querySelector('.tiptap')
  if (tiptap) {
    tiptap.style.fontFamily = fontFamilySelect.value
  }
})

const fontSizeLabel = document.getElementById('font-size-label')
const fontIncreaseBtn = document.getElementById('font-increase')
const fontDecreaseBtn = document.getElementById('font-decrease')

let fontSize = 16 // default font size

function updateFontSize() {
  const tiptap = document.querySelector('html')
  if (tiptap) {
    tiptap.style.fontSize = `${fontSize}px`
  }
  fontSizeLabel.textContent = fontSize
}

fontIncreaseBtn.addEventListener('click', () => {
  fontSize = Math.min(fontSize + 2, 48)
  updateFontSize()
})

fontDecreaseBtn.addEventListener('click', () => {
  fontSize = Math.max(fontSize - 2, 8)
  updateFontSize()
})

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && !event.shiftKey && !event.altKey) {
    if (event.key === '+' || event.key === '=') {
      fontSize = Math.min(fontSize + 2, 48)
      updateFontSize()
      event.preventDefault()
    } else if (event.key === '-') {
      fontSize = Math.max(fontSize - 2, 8)
      updateFontSize()
      event.preventDefault()
    }
  }
})

updateFontSize()

// --- Save/Load File (basic implementation) ---
document.getElementById('save-btn').addEventListener('click', () => {
  const blob = new Blob([editor.getHTML()], { type: 'text/html' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'note.html'
  a.click()
})

document.getElementById('load-btn').addEventListener('click', () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.html,.txt'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      editor.commands.setContent(ev.target.result)
    }
    reader.readAsText(file)
  }
  input.click()
})