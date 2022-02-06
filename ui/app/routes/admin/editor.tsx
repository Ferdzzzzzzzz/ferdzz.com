import {useEditor, EditorContent} from '@tiptap/react'
import {DefaultLayout} from '~/components/DefaultLayout'
import {Document} from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'

const bulletListNode = BulletList.configure({
  HTMLAttributes: {
    class: 'list-disc list-inside',
  },
})

const listItemNode = ListItem.configure({
  HTMLAttributes: {
    class: '',
  },
})

const paragraphNode = Paragraph.configure({
  HTMLAttributes: {
    class: 'bg-pink-100',
  },
})

export default function Editor() {
  const editor = useEditor({
    extensions: [Document, Text, paragraphNode, bulletListNode, listItemNode],
    content: '<ul><li>Hello Worldddddd!</li></ul>',
    editorProps: {
      attributes: {
        class:
          'outline-none border rounded border-pink-400 p-2 outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-2xl',
      },
    },
  })

  return (
    <DefaultLayout>
      <div className="w-1/2 mx-auto">
        <h1 className="text-xs">Editor</h1>
        <EditorContent editor={editor} />
      </div>
      <ul className="list-disc list-inside">
        <li>Hello WOrld</li>
      </ul>
    </DefaultLayout>
  )
}
