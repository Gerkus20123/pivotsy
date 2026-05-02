'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ImageIcon, X } from 'lucide-react';

export default function ImageUploadCase({ 
    field, 
    config,
    base_id
} : { 
    field: any, 
    config: any,
    base_id: string
}
) {
    const [preview, setPreview] = useState<string | null>(field.value || null);
    const API_BASE_URL = "http://127.0.0.1:5000";

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            field.onChange(file);
        }
    };

    const removeImage = () => {
        setPreview(null);
        field.onChange(null);
    };

    useEffect(() => {
        if (field.value && typeof field.value === 'string') {
            setPreview(field.value);
        }
    }, [field.value]);

    const getImageUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith('data:')) return path;
        
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${API_BASE_URL}${cleanPath}`.replace(/([^:]\/)\/+/g, "$1"); 
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="relative border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <input
                    id={base_id}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                {preview ? (
                    <div className="relative h-40 w-full flex justify-center">
                        <img 
                            src={getImageUrl(preview)} 
                            alt="Preview"
                            width={150}
                            height={100}
                            className="object-contain rounded-md" 
                        />
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeImage(); }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md cursor-pointer hover:scale-110"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                        <ImageIcon size={40} strokeWidth={1} />
                        <span className="text-sm">Click to upload {config.label}</span>
                    </div>
                )}
            </div>
        </div>
    );
}