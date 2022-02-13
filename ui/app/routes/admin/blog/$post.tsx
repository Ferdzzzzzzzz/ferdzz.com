import {EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function Post() {
  let editor = useEditor({
    content: '<h1>Hello World</h1>',
    extensions: [StarterKit],
  })

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  )
}
