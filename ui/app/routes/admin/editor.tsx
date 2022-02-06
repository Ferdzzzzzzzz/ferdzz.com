import {useEditor, EditorContent} from '@tiptap/react'
import {DefaultLayout} from '~/components/DefaultLayout'
import {Document} from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import Heading from '@tiptap/extension-heading'
import OrderedList from '@tiptap/extension-ordered-list'
import {ScrollArea} from '~/components/ScrollArea'

const content = `
<p>
  That’s a boring paragraph followed by a fenced code block:
</p>
<pre><code class="language-javascript">for (var i=1; i <= 20; i++)
  {
    if (i % 15 == 0)
      console.log("FizzBuzz");
    else if (i % 3 == 0)
      console.log("Fizz");
    else if (i % 5 == 0)
      console.log("Buzz");
    else
      console.log(i);
  }
  </code></pre>
`

export default function Editor() {
  const editor = useEditor({
    editable: true,
    extensions: [
      Document,
      Text,
      Paragraph,
      OrderedList,
      BulletList,
      ListItem,
      Heading,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'outline-none border rounded border-pink-400 p-10 prose prose-slate prose-sm min-w-full h-full',
      },
    },
  })

  return (
    <DefaultLayout>
      <div className="w-2/3 mx-auto">
        <ScrollArea className="h-screen bg-red-100">
          <EditorContent editor={editor} />
        </ScrollArea>
      </div>
    </DefaultLayout>
  )
}
