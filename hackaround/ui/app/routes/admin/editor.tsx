import {useEditor, EditorContent} from '@tiptap/react'
import {Document} from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import Heading from '@tiptap/extension-heading'
import OrderedList from '@tiptap/extension-ordered-list'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import Collaboration from '@tiptap/extension-collaboration'
import {useYDoc} from '~/core/hooks'
import * as Y from 'yjs'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import Strike from '@tiptap/extension-strike'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'

import TextAlign from '@tiptap/extension-text-align'
import {ActionMenu} from './ActionMenu'

function EditorSection({ydoc}: {ydoc: Y.Doc}) {
  const editor = useEditor({
    // content: '<p style="text-align: right">right</p>',
    editable: true,
    extensions: [
      Collaboration.configure({
        document: ydoc,
      }),
      Document,
      Text,
      Paragraph,
      OrderedList,
      BulletList,
      ListItem,
      Heading,
      Bold,
      Italic,
      Link,
      Strike,
      Superscript,
      Subscript,
      TextStyle,
      Underline,
      TextAlign.configure({types: ['heading', 'paragraph']}),
    ],
    editorProps: {
      attributes: {
        class: 'outline-none prose prose-slate prose-sm',
      },
    },
  })

  return (
    <div className="h-full flex">
      <div className="w-1/6 bg-slate-50 border-r p-4">
        <p>Filetree</p>
      </div>

      <ScrollArea.Root className="grow h-[100%]">
        <ScrollArea.Viewport className="h-full">
          <div className="max-w-2xl mx-auto">
            <Spacer />
            <EditorContent editor={editor} />
            <Spacer />
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="w-1">
          <ScrollArea.Thumb className="w-1 bg-slate-400 rounded" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      <ActionMenu editor={editor} />
    </div>
  )
}

function Spacer() {
  return <div className="h-20" />
}

export default function EditorView() {
  const ydoc = useYDoc()

  if (!ydoc) {
    return <div>Loading...</div>
  }

  return <EditorSection ydoc={ydoc} />
}
