import './style.css'

import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

const editor = new Editor({
  element: document.querySelector('#editor'),
  extensions: [
    StarterKit,
  ],
  content: `
  New Document
  `,
})

const container = document.querySelector('#editor')
container.addEventListener('mousedown', (event) => {
  // Only handle clicks outside the .tiptap area
  if (event.target === container) {
    const { doc } = editor.state
    const lastNode = doc.lastChild

    // If the last node is not an empty paragraph, add one
    if (!lastNode || lastNode.type.name !== 'paragraph' || lastNode.content.size !== 0) {
      editor.commands.insertContent('<p></p>')
    }

    // Focus at the end (which is now a new empty line)
    editor.commands.focus('end')
    event.preventDefault()
  }
})