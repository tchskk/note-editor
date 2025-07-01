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

let fontSize = 16 // default font size

function updateFontSize() {
  const tiptap = document.querySelector('.tiptap')
  if (tiptap) {
    tiptap.style.fontSize = `${fontSize}px`
  }
}

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