import './style.css'

import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

const editor = new Editor({
  element: document.querySelector('#editor'),
  extensions: [
    StarterKit,
  ],
  content: `
  <p>Hello World!</p>
  <p>This is a simple Notion-like editor.</p>
  `,
})
