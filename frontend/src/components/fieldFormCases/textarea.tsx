'use client'

import { ReactNode, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Link, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from 'lucide-react';
import { FieldConfig } from '@/lib/interfaces/fields';

const extensions = [
    StarterKit
];

function MenuButton({ 
    onClick, 
    active, 
    icon 
} : { 
    onClick: () => void, 
    active: boolean, 
    icon: ReactNode 
        }) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={`p-2 rounded-md transition-colors cursor-pointer ${
                    active ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-600'
                }`}
            >
                {icon}
            </button>
        );
}

function TextArea({ 
    value, 
    onChange, 
    base_id,
    config,
} : {
    value: any,
    onChange: (val: string) => void,
    base_id: string,
    config: FieldConfig<any>
}) {

        const editor = useEditor({
            extensions,
            content: value,
            immediatelyRender: false,
            onUpdate: ({ editor }) => {
                onChange(editor.getHTML())
            },
            editorProps: {
                attributes: {
                    id: base_id,
                    class: 'p-3 min-h-[250px] focus:outline-none',
                },
            },
        })

        // If the form changes it value externally, update the editor
        useEffect(() => {
            if (editor && value !== editor.getHTML()) {
                editor.commands.setContent(value);
            }
        }, [value, editor]);
        
        if (!editor) return null;

        return (
                <div className="border rounded-lg overflow-hidden">

                    <input 
                        id={base_id} 
                        className="sr-only" 
                        aria-hidden="true"
                        onFocus={() => editor?.commands.focus()} 
                    />

                    {/* Tools */}
                    <div className="bg-gray-50 border-b p-2 flex gap-2">

                        <MenuButton 
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            active={editor.isActive('bold')}
                            icon={<Bold size={16} />}
                        />
                        <MenuButton 
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            active={editor.isActive('italic')}
                            icon={<Italic size={16} />}
                        />
                        <MenuButton 
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            active={editor.isActive('underline')}
                            icon={<UnderlineIcon size={16} />}
                        />

                        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

                        <MenuButton 
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            active={editor.isActive('bulletList')}
                            icon={<List size={16} />}
                        />

                        <MenuButton 
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            active={editor.isActive('orderedList')}
                            icon={<ListOrdered size={16} />}
                        />

                        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

                        <MenuButton 
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1}).run()}
                            active={editor.isActive('heading', { level: 1 })}
                            icon={<Heading1 size={16} />}
                        />

                        <MenuButton 
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            active={editor.isActive('heading', { level: 2 })}
                            icon={<Heading2 size={16} />} 
                        />

                        <MenuButton 
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            active={editor.isActive('heading', { level: 3 })}
                            icon={<Heading3 size={16} />} 
                        />

                    </div>

                    {/* Editing field */}
                    <EditorContent 
                        editor={editor} 
                        className="
                            [&_h1]:text-lg [&_h1]:font-normal 
                            [&_h2]:text-sm [&_h2]:font-normal 
                            [&_h3]:text-md [&_h3]:font-normal
                            [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ml-4 [&_ol]:ml-4
                            p-3 min-h-[250px] focus:outline-none"
                    />
            </div>
          )
}

export default TextArea;