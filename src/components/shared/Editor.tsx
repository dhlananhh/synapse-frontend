'use client'

import React, { useEffect, useReducer, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Mention from '@tiptap/extension-mention'
import Placeholder from '@tiptap/extension-placeholder'
import tippy, { Instance as TippyInstance, type GetReferenceClientRect } from 'tippy.js'
import { communityService } from '@/modules/services/community-service'
import { TCreatePostSchema, MAX_TAGGED } from '@/libs/validators/post-validator' // + MAX_TAGGED

type EditorProps = {
  communityId: string
  disabled?: boolean
}

export default function Editor({ communityId, disabled = false }: EditorProps) {
  const { setValue, watch } = useFormContext<TCreatePostSchema>()
  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  // keep the latest communityId for mention items()
  const communityIdRef = useRef<string | undefined>(communityId)
  useEffect(() => {
    communityIdRef.current = communityId
  }, [communityId])

  const contentHtml = watch('contentHtml')
  const contentJson = watch('contentJson')

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      // 1) Mention first, use latest id
      Mention.configure({
        HTMLAttributes: {
          class: 'bg-muted text-primary font-medium rounded px-1 hover:underline cursor-pointer',
        },
        suggestion: {
          char: '@',
          // don’t trigger inside code or code blocks
          allow: ({ editor }) => !(editor.isActive('code') || editor.isActive('codeBlock')),

          items: async ({ query }) => {
            const cid = communityIdRef.current
            // console.log('[mention] query:', query, 'cid:', cid)
            if (!cid) return []
            const res = await communityService.getMembers(cid, { q: query, limit: 4 })
            // console.log('ayooo ', res)
            return Array.isArray(res?.members) ? res.members : []
          },
          render: () => {
            let popup: TippyInstance | null = null
            let container: HTMLElement | null = null
            let selectedIndex = 0

            return {
              onStart(props) {
                container = renderItems(props)
                selectedIndex = 0
                updateSelectedItem()

                const getRect: GetReferenceClientRect = () =>
                  props.clientRect ? (props.clientRect() as DOMRect) : new DOMRect(0, 0, 0, 0)

                popup = tippy(document.body, {
                  getReferenceClientRect: getRect,
                  appendTo: () => document.body,
                  content: container,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                  theme: 'light',
                })
              },

              onUpdate(props) {
                container = renderItems(props)
                selectedIndex = 0
                updateSelectedItem()
                popup?.setContent(container)
              },

              onKeyDown(props) {
                if (!container) return false

                const items = Array.from(container.querySelectorAll('button'))
                const lastIndex = items.length - 1

                if (props.event.key === 'ArrowDown') {
                  selectedIndex = selectedIndex >= lastIndex ? 0 : selectedIndex + 1
                  updateSelectedItem()
                  return true
                }

                if (props.event.key === 'ArrowUp') {
                  selectedIndex = selectedIndex <= 0 ? lastIndex : selectedIndex - 1
                  updateSelectedItem()
                  return true
                }

                if (props.event.key === 'Enter') {
                  const selected = items[selectedIndex] as HTMLButtonElement
                  selected?.click()
                  return true
                }

                return false
              },

              onExit() {
                popup?.destroy()
                popup = null
                container = null
              },
            }

            function updateSelectedItem() {
              if (!container) return
              const items = Array.from(container.querySelectorAll('button'))
              items.forEach((el, i) => {
                const active = i === selectedIndex
                // Darker, high-contrast active state + subtle ring
                el.classList.toggle('bg-neutral-200', active)
                el.classList.toggle('text-neutral-900', active)
                el.classList.toggle('dark:bg-neutral-700', active)
                el.classList.toggle('dark:text-white', active)
                el.classList.toggle('ring-1', active)
                el.classList.toggle('ring-primary/40', active)
              })
            }
          },
        },
      }),

      // 2) Link after Mention (StarterKit link disabled)
      Link.configure({
        openOnClick: true,
        autolink: true, // if this still conflicts, set to false
        linkOnPaste: true,
        HTMLAttributes: {
          class:
            'text-blue-500 underline underline-offset-2 cursor-pointer hover:text-blue-400 transition-colors',
        },
      }),

      // 3) Core kit
      StarterKit.configure({
        codeBlock: {},
        blockquote: {},
        bulletList: {},
        orderedList: {},
        horizontalRule: {},
        heading: { levels: [1, 2, 3] },
        link: false,
      }),

      Placeholder.configure({
        placeholder: 'Write your post…',
        showOnlyWhenEditable: true,
      }),
    ],
    content: contentHtml || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const json = editor.getJSON()
      setValue('contentHtml', html, { shouldDirty: true })
      setValue('contentJson', json, { shouldDirty: true })

      // Keep taggedUserIds in sync with current mentions
      const ids = extractMentionIds(json).slice(0, MAX_TAGGED)
      setValue('taggedUserIds', ids, { shouldDirty: true, shouldValidate: true })
    },
    onSelectionUpdate: () => forceUpdate(),
    onTransaction: () => forceUpdate(),
    onFocus: () => forceUpdate(),
    onBlur: () => forceUpdate(),
  })

  // Keep editor in sync when content changes externally
  useEffect(() => {
    if (editor && contentHtml && editor.getHTML() !== contentHtml) {
      editor.commands.setContent(contentHtml)
      // Also recompute tagged ids after external content set
      const ids = extractMentionIds(editor.getJSON()).slice(0, MAX_TAGGED)
      setValue('taggedUserIds', ids, { shouldDirty: true, shouldValidate: true })
    }
  }, [contentHtml, editor, setValue])

  // React to disabled changes after init
  useEffect(() => {
    if (editor) editor.setEditable(!disabled)
  }, [disabled, editor])

  if (!editor) return null

  const onEditorShellMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    const target = e.target as HTMLElement
    const insidePM = !!target.closest('.ProseMirror')
    if (!insidePM) {
      e.preventDefault()
      // place caret at end (textarea-like behavior)
      editor.chain().focus().setTextSelection(editor.state.doc.content.size).run()
    }
  }

  const ToolbarButton = ({
    onClick,
    active,
    label,
    children,
    disabled: btnDisabled,
  }: {
    onClick: () => void
    active?: boolean
    label: string
    children: React.ReactNode
    disabled?: boolean
  }) => (
    <button
      type='button'
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active ? 'true' : 'false'}
      disabled={btnDisabled}
      className={[
        'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors',
        active
          ? 'bg-accent text-primary-foreground'
          : 'text-foreground/80 hover:bg-accent/60 active:bg-accent/80',
        btnDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
        'border border-transparent',
      ].join(' ')}
    >
      {children}
    </button>
  )

  return (
    <div className='rounded-lg border bg-card shadow-sm'>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-1 border-b bg-muted/40 p-2'>
        {/* Headings */}
        <div className='flex items-center gap-1'>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            label='Heading 1'
            disabled={disabled}
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            label='Heading 2'
            disabled={disabled}
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            label='Heading 3'
            disabled={disabled}
          >
            H3
          </ToolbarButton>
        </div>

        <span className='mx-1 h-6 w-px bg-border' />

        {/* Inline */}
        <div className='flex items-center gap-1'>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            label='Bold'
            disabled={disabled}
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            label='Italic'
            disabled={disabled}
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            label='Code'
            disabled={disabled}
          >
            {'</>'}
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              if (disabled) return
              const prev = editor.getAttributes('link')?.href as string | undefined
              const url = window.prompt('Enter URL', prev ?? '')
              if (url === null) return
              if (url === '') {
                editor.chain().focus().unsetLink().run()
                return
              }
              try {
                new URL(url)
                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
              } catch {
                editor.chain().focus().unsetLink().run()
              }
            }}
            active={editor.isActive('link')}
            label='Link'
            disabled={disabled}
          >
            🔗
          </ToolbarButton>
        </div>

        <span className='mx-1 h-6 w-px bg-border' />

        {/* Blocks */}
        <div className='flex items-center gap-1'>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            label='Bullet List'
            disabled={disabled}
          >
            ••
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            label='Ordered List'
            disabled={disabled}
          >
            1.
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            label='Blockquote'
            disabled={disabled}
          >
            ❝
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive('codeBlock')}
            label='Code Block'
            disabled={disabled}
          >
            ⌘
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            active={false}
            label='Horizontal Rule'
            disabled={disabled}
          >
            ―
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      <div className='p-3'>
        <div
          className={[
            'relative rounded-md border bg-background px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-primary/40',
            disabled ? 'opacity-60' : '',
          ].join(' ')}
          onMouseDown={onEditorShellMouseDown}
          aria-disabled={disabled ? 'true' : 'false'}
        >
          {/* Disabled overlay message */}
          {disabled && (
            <div
              className='pointer-events-none absolute inset-0 flex items-center justify-center rounded-md bg-background/60 backdrop-blur-[1px]'
              role='note'
              aria-live='polite'
            >
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/30'>
                  !
                </span>
                <span>You have to select a community first</span>
              </div>
            </div>
          )}

          <EditorContent
            editor={editor}
            className={[
              'prose prose-sm max-w-none min-h-[180px] whitespace-pre-wrap focus:outline-none dark:prose-invert',
              disabled ? 'cursor-not-allowed' : 'cursor-text',
            ].join(' ')}
          />
        </div>
        <div className='mt-1 text-xs text-muted-foreground'>
          Use formatting, lists, links, code and more.
        </div>
      </div>
    </div>
  );
}

// ---- Mention popup renderer ----
function renderItems({
  items,
  command,
}: {
  items: Array<{ id: string; label: string; userId: string; username: string; role?: string }>
  command: (item: { id: string; label: string }) => void
}): HTMLElement {
  const container = document.createElement('div')
  container.className =
    'bg-popover text-popover-foreground shadow-md border rounded-md p-1 w-56 max-h-60 overflow-y-auto'

  items.forEach((user) => {
    const el = document.createElement('button')
    el.type = 'button'
    el.className = [
      'mention-item block w-full text-left px-2 py-1 text-sm rounded transition-colors',
      // base (non-selected) look
      'hover:bg-neutral-100 dark:hover:bg-neutral-800',
      'focus:outline-none',
    ].join(' ')

    el.innerHTML = `
      <div class="flex flex-col space-y-0.5">
        <span class="font-medium leading-tight">${user.username}</span>
        ${user.role ? `<span class="text-xs text-muted-foreground">${user.role}</span>` : ''}
      </div>
    `
    el.onclick = () => command({ id: user.userId, label: user.username })
    container.append(el)
  })

  return container
}

// Collect all mention node ids from a TipTap JSON doc
function extractMentionIds(doc: any): string[] {
  const ids = new Set<string>()
  const walk = (node: any) => {
    if (!node) return
    if (node.type === 'mention' && typeof node.attrs?.id === 'string') {
      ids.add(node.attrs.id)
    }
    if (Array.isArray(node.content)) node.content.forEach(walk)
  }
  walk(doc)
  return Array.from(ids)
}
