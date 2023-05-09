'use client';

import useLocalStorageState from '@moi-meow/utils/useLocalStorageState';
import Image from 'next/image'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'

const API_BASE_URL = process.env.API_URL || "http://172.20.0.3:3001/";

export default function Home() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [showUrl, setShowUrl] = useLocalStorageState("_showUrl", false);
  const [showDesc, setShowDesc] = useLocalStorageState("_showDesc", true);
  const [showTags, setShowTags] = useLocalStorageState("_showTags", false);
  const [showPageTitle, setShowPageTitle] = useLocalStorageState("_showPageTitle", false);

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  const [data, setData] = useState<Array<any>>([]);

  const [titleInput, setTitleInput] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [tagsInput, setTagsInput] = useState("")

  useEffect(() => {
    const source = new EventSource(`${API_BASE_URL}bookmark/subscribe`);

    source.onmessage = function (event) {
      const data = JSON.parse(event.data);
      setData(data);
      console.log(data);
    };

    return () => {

    }
  }, [])

  function onTitleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setTitleInput(event.target.value);
  }

  function onUrlInputChange(event: ChangeEvent<HTMLInputElement>) {
    setUrlInput(event.target.value);
  }

  function onTagsInputChange(event: ChangeEvent<HTMLInputElement>) {
    setTagsInput(event.target.value);
  }

  function onShowUrlInputChange(event: ChangeEvent<HTMLInputElement>) {
    setShowUrl(event.target.checked);
  }

  function onShowDescInputChange(event: ChangeEvent<HTMLInputElement>) {
    setShowDesc(event.target.checked);
  }

  function onShowTagsInputChange(event: ChangeEvent<HTMLInputElement>) {
    setShowTags(event.target.checked);
  }

  function onShowPageTitleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setShowPageTitle(event.target.checked);
  }

  async function onCreateSubmit(event: FormEvent) {
    event.preventDefault();

    closeDialog();

    const formData = new FormData();
    formData.append("title", titleInput.toString());
    formData.append("url", urlInput.toString());

    if (tagsInput.toString() !== "") {
      tagsInput.toString().split(",").forEach(tag => {
        formData.append("tags[]", tag.trim());
      });
    }

    setTitleInput("");
    setUrlInput("");
    setTagsInput("");

    console.log("Inserting data");

    const response = await fetch(`${API_BASE_URL}bookmark`, {
      method: "POST",
      body: formData
    })

    const responseJSON = await response.json();

    console.log("insert: " + responseJSON.toString());
  }


  return (
    <main className="flex min-h-screen flex-col items-center gap-3 bg-gray-200 text-black">
      <dialog className='backdrop:bg-black/50 w-96 rounded-2xl p-5' ref={dialogRef}>
        <form onSubmit={onCreateSubmit} className='flex flex-col gap-3'>
          <p>New Bookmark</p>

          <input type='text' placeholder='Bookmark Title' className='h-10 w-full rounded-md bg-gray-100 px-3 focus:outline-none focus:ring-2 ring-indigo-500' onChange={onTitleInputChange} value={titleInput} />

          <input type='url' placeholder='Website Url' className='h-10 w-full rounded-md bg-gray-100 px-3 focus:outline-none focus:ring-2 ring-indigo-500' onChange={onUrlInputChange} value={urlInput} />

          <input type='text' placeholder='Tags A, Tags B, Tags C' className='h-10 w-full rounded-md bg-gray-100 px-3 focus:outline-none focus:ring-2 ring-indigo-500' onChange={onTagsInputChange} value={tagsInput} />

          <div className='flex w-full justify-end gap-3'>
            <button className='border-indigo-500 border text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-md px-3 py-2  focus:outline-0 hover:ring-4 focus:ring-4 ring-indigo-500/50 transition-all  ' onClick={closeDialog} type='button' >Close</button>
            <button className='bg-indigo-500 text-white
         rounded-md px-3 py-2 focus:outline-0 hover:ring-4 focus:ring-4 ring-indigo-500/50 transition-all' type='submit'>Submit</button>
          </div>
        </form>
      </dialog>

      <div className='flex items-center justify-between bg-white w-full py-3 px-10'>
        <Image alt='logo' src={"/logo.svg"} width={164} height={36} />

        <div className='flex gap-5 items-center'>
          <label>
            <input type='checkbox' onChange={onShowUrlInputChange} checked={showUrl} />
            Show Url
          </label>

          <label>
            <input type='checkbox' onChange={onShowDescInputChange} checked={showDesc} />
            Show Desc
          </label>

          <label>
            <input type='checkbox' onChange={onShowTagsInputChange} checked={showTags} />
            Show Tags
          </label>

          <label>
            <input type='checkbox' onChange={onShowPageTitleInputChange} checked={showPageTitle} />
            Show Real Page Title
          </label>
          <button onClick={openDialog} className='bg-indigo-500 text-white
         rounded-md px-3 py-2 focus:outline-0 hover:ring-4 focus:ring-4 ring-indigo-500/50 transition-all'>New Bookmark</button>
        </div>
      </div>
      <div className='auto-grid gap-3 py-3 px-10'>
        {
          data.map((item, index) => {
            return <a href={item.url ?? "#"} target='_blank' key={item.id ?? index} className='group w-full flex flex-col bg-white rounded-2xl p-1 hover:ring-2 focus:outline-0 focus:ring-2 ring-indigo-500 hover:scale-105 focus:scale-105 transition-all duration-300'>
              <div className='aspect-video bg-gray-200 rounded-xl overflow-hidden relative'>

                {(item.image || item.thumbnail) && <Image alt='image' src={item.image ?? item.thumbnail} className='w-full h-full object-cover group-hover:scale-105 group-hover:blur-sm group-focus:scale-105 group-focus:blur-sm transition-transform duration-700' width={1280} height={720} />}

                {item.thumbnail && <Image alt='image' src={item.thumbnail} className='absolute inset-0 object-cover scale-100 opacity-0 group-hover:scale-105 group-focus:scale-105 group-hover:opacity-100 group-focus:opacity-100 blur-sm group-hover:blur-none group-focus:blur-none transition-all duration-700' width={1280} height={720} />}
              </div>

              <div className='p-2 flex flex-col gap-1'>
                <div className='flex gap-2 items-center'>
                  <div className='aspect-square w-5 p-0.5 flex-none'>
                    {item.favicon ? <Image alt='favicon' src={item.favicon} width={128} height={128} /> : <div className='bg-gray-200 w-full h-full rounded-md' />}
                  </div>
                  <p className='font-medium line-clamp-1'>{showPageTitle ? item.pageTitle : item.title}</p>
                </div>

                {
                  showUrl && <p className='text-xs text-indigo-500 line-clamp-1'>{item.url}</p>
                }

                {
                  showDesc && <p className='text-xs text-gray-400 line-clamp-2'>{item.description}</p>
                }

                {
                  showTags && <div className='flex flex-wrap gap-1'>
                    {
                      item.tags.map((tagData: any) => {
                        return <p key={tagData.id} className='text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md'>{tagData.name}</p>
                      })
                    }
                  </div>
                }
              </div>
            </a>
          })
        }
      </div>
    </main>
  )
}
