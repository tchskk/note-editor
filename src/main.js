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