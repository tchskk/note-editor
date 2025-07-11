import './style.css'

import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { open, save } from '@tauri-apps/plugin-dialog'
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import { getCurrentWindow } from '@tauri-apps/api/window'; 

let currentFilePath = null // Tracks the current file path
let isContentChanged = false // Tracks if the content has changed since the last save

const editor = new Editor({
  element: document.querySelector('#editor'),
  extensions: [
    StarterKit,
  ],
  autofocus: 'start',
  onUpdate: () => {
    isContentChanged = true
  },
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

// Option Button

optionsBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  optionsMenu.classList.toggle('show')
  menuOpen = !menuOpen
  container.style.pointerEvents = menuOpen ? 'none' : 'auto'
})

// Option Menu

optionsMenu.addEventListener('mousedown', (e) => {
  e.stopPropagation(); // Prevent closing the menu when clicking inside it
});

document.addEventListener('mousedown', (e) => {
  if (menuOpen && !optionsMenu.contains(e.target) && e.target !== optionsBtn) {
    optionsMenu.classList.remove('show')
    menuOpen = false
    container.style.pointerEvents = menuOpen ? 'none' : 'auto'
  }
})

// Font Family

const fontFamilySelect = document.getElementById('font-family-select')
fontFamilySelect.addEventListener('change', () => {
  const tiptap = document.querySelector('.tiptap')
  if (tiptap) {
    tiptap.style.fontFamily = fontFamilySelect.value
  }
})

// Font Size

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

// Save File
async function saveFile() {
  if (currentFilePath) {
    await writeTextFile(currentFilePath, editor.getHTML())
    isContentChanged = false
    console.log(`File saved successfully at ${currentFilePath}`)
    return true
  } else {
    const filePath = await save({ filters: [{ name: "HTML", extensions: ["html"] }] })
    if (filePath) {
      await writeTextFile(filePath, editor.getHTML())
      currentFilePath = filePath
      isContentChanged = false
      console.log(`File saved successfully at ${filePath}`)
      return true
    }
  }
  return false
}

// Save Button
document.getElementById('save-btn').addEventListener('click', saveFile);

// Save Shortcut
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && !event.shiftKey && !event.altKey) {
    if (event.key === 's') {
      event.preventDefault()
      saveFile()
    }
  }
})

// Load File
async function loadFile() {
  if (isContentChanged) {
    const confirmSave = await confirm('You have unsaved changes. Do you want to save them before loading another note ?');
    if (confirmSave == true) {
      await saveFile()
    }
  }

  const filePath = await open({ filters: [{ name: "HTML", extensions: ["html"] }] })
  if (filePath) {
    const content = await readTextFile(filePath)
    editor.commands.setContent(content)
    currentFilePath = filePath;
    isContentChanged = false
    console.log(`File loaded successfully from ${filePath}`);
  }
}

// Load Button
document.getElementById('load-btn').addEventListener('click', loadFile);

// New Note
document.getElementById('new-btn').addEventListener('click', async () => {
  if (isContentChanged) {
    const confirmSave = await confirm('You have unsaved changes. Do you want to save them before creating a new note ?');
    if (confirmSave) {
      await saveFile()
    }
  }
  editor.commands.clearContent()
  currentFilePath = null
  isContentChanged = false
  console.log('New note created.')
})

// Exit application
getCurrentWindow().onCloseRequested(async (e) => {
  if (isContentChanged) {
    const confirmSave = await confirm('You have unsaved changes. Do you want to save them before exiting ?')
    if (confirmSave) {
      if (!await saveFile()){
        e.preventDefault()
      }
    }
  }
})



// Load last opened note
// async function loadLastOpenedNote() {
//   const lastFilePath = await invoke('get_last_opened_file'); // Custom Tauri command
//   if (lastFilePath) {
//     currentFilePath = lastFilePath;
//     const content = await readTextFile(currentFilePath);
//     editor.commands.setContent(content);
//     isContentChanged = false;
//     console.log(`Last opened note loaded from ${currentFilePath}`);
//   }
// }

// loadLastOpenedNote();