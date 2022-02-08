import {
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  UnderlineIcon,
} from '@radix-ui/react-icons'
import type {Editor} from '@tiptap/core'

function StylesTab({editor}: {editor: Editor | null}) {
  return (
    <div>
      <p className="font-semibold">style</p>
      <div className="flex justify-between mt-10">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className="p-2 border w-1/4 flex justify-center rounded-l"
        >
          <FontBoldIcon />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className="p-2 border w-1/4 flex justify-center"
        >
          <FontItalicIcon />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className="p-2 border w-1/4 flex justify-center"
        >
          <UnderlineIcon />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className="p-2 rounded-r border w-1/4 flex justify-center"
        >
          <StrikethroughIcon />
        </button>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => editor?.commands.setTextAlign('left')}
          className="p-2 border w-1/4 flex justify-center rounded-l"
        >
          <TextAlignLeftIcon />
        </button>

        <button
          className="p-2 border w-1/4 flex justify-center"
          onClick={() => editor?.commands.setTextAlign('center')}
        >
          <TextAlignCenterIcon />
        </button>

        <button
          className="p-2 border w-1/4 flex justify-center"
          onClick={() => editor?.commands.setTextAlign('right')}
        >
          <TextAlignRightIcon />
        </button>
        <button
          className="p-2 rounded-r border w-1/4 flex justify-center"
          onClick={() => editor?.commands.setTextAlign('justify')}
        >
          <TextAlignJustifyIcon />
        </button>
      </div>
    </div>
  )
}

export function ActionMenu({editor}: {editor: Editor | null}) {
  return (
    <div className="w-1/6 bg-white border-l p-4 flex flex-col justify-between">
      <div>
        <StylesTab editor={editor} />
      </div>
      <div>show online user avatars</div>
    </div>
  )
}
