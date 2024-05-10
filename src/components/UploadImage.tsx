import Image from 'next/image'
import {useState} from 'react'
import {toast} from 'react-toastify';
import { createClient } from '@supabase/supabase-js';
import DefaultUploadImage from '@/assets/image.svg'


interface UploadImageProps{
    setIsLoading: (value: boolean) => void
    setImageUrl: (value: string)  => void
}

export function UploadImage({ setImageUrl, setIsLoading}: UploadImageProps){
    const [isDragging, setIsDragging] = useState(false)

    function validateImage(file: File) {
        if (file.type.startsWith("image/")) return true
        toast.error('Please select a valid image')
        return false
    }
    
    function handleDragOver(e: DragEvent<HTMLDivElement>){
        e.preventDefault()
        setIsDragging(true)
    }
    function handleDragLeave(){
        setIsDragging(false)

    }

    async function handleDrop(e: DragEvent<HTMLDivElement>){
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]

        await handleSupabaseUpload(file)
    }

    async function handleFileInput(e: ChangeEvent<HTMLInputElement>){
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]

        file && (await handleSupabaseUpload(file))
    }

    async function handleSupabaseUpload(file: File){
        if(file && validateImage(file)){
            try{
                setIsLoading(true)
                
                const formData = new FormData()
                formData.append('file', file)

                const response = await fetch('api/upload', {
                    method: 'POST',
                    body: formData
                })

                const {imageUrl, error} = await response.json()

                if (error) throw new Error(error)

                setImageUrl(imageUrl)
            } catch (error){
                console.error(error)
                if (error instanceof Error){
                    toast.error(error.message)
                }
            } finally{
                setIsLoading(false)
            }
        }
    }

    return (
        <div className='flex flex-col gap-5 items-center justify-start'>
            <h1 className='text-gray-500 text-xl'>Upload your image</h1>
            <p className='text-gray-400 text-xs'>File should be Jpeg, Png...</p>

            <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            className={` bg-gray-50 ${isDragging ? 'border-green' : 'border-light-blue' } border-2 border-dashed rounded-xl p-10 flex items-center flex-col w-full justify-center gap-10`}>
                <Image 
                src={DefaultUploadImage}
                alt='default image'
                height={100}
                priority
                />
                <h3 className='text-gray-300 text-sm'>
                    {''}
                    {!isDragging && 'Drag'} & Drop your Image here</h3>
            </div>

            <div className='bg-primary hover:brightness-90 text-xs text-white rounded-lg'>
                <label className='py-3 px-5 cursor-pointer block' htmlFor='fileInput'>
                    Choose a file
                </label>
                <input onChange={handleFileInput} type='file' className='hidden' id='fileInput' />
            </div>
        </div>
    )
}