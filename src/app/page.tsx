"use client"

import {UploadImage} from '@/components/UploadImage'
import {useState} from 'react'
import { Toast } from '@/components/Toast'
import {UploadLoading} from '@/components/UploadLoading'
import 'react-toastify/dist/ReactToastify.css';
import {ImagePreview} from '@/components/ImagePreview'


export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState('')

  return (
    <>
      <Toast />
      <main className='bg-background w-full h-screen flex items-center justify-center'>
        <div className='w-full max-w-[420px] bg-white rounded-xl drop-shadow-md p-8'>
          {isLoading ? (
            <UploadLoading />
          ) : imageUrl ? (
            <ImagePreview imageUrl={imageUrl} />
          ):(
            <UploadImage 
          setIsLoading={setIsLoading} 
          setImageUrl={setImageUrl} />
          )}
        </div>
      </main>
    </>
  );
}
