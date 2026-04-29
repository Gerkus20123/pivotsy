'use client'

import { ReactNode, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Underline as UnderlineIcon, List } from 'lucide-react';
import { FieldConfig } from '@/lib/interfaces/fields';
import UnderlineExtension from '@tiptap/extension-underline';

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
    field
} : {
    value: any,
    onChange: (val: string) => void,
    base_id: string,
    config: FieldConfig<any> 
    field: any
}) {

        const editor = useEditor({
            extensions: [
                StarterKit,
                UnderlineExtension
            ],
            content: value,
            immediatelyRender: false,
            onUpdate: ({ editor }) => {
                onChange(editor.getHTML())
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

                </div>

                {/* Editing field */}
                <EditorContent 
                    editor={editor} 
                    className="p-3 min-h-[250px] focus:outline-none 
                        [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ml-4 [&_ol]:ml-4"
                    id={base_id}
                    placeholder={config.placeholder}
                />
            </div>
          )
}

export default TextArea;