import Image from 'next/image'
import React, { ChangeEvent } from 'react'
import MoiButton from '../form/moiButton'

interface MoiHeaderProps {
  setSearchQuery: (value: string) => void;
  searchQuery: string;
  onClickConfig?: () => void;
  onClickNewBookmark?: () => void;
}

export default function MoiHeader(props: MoiHeaderProps) {

  function onSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    props.setSearchQuery(event.target.value);
  }

  return (
    <header className='flex items-center justify-between bg-white w-full py-3 px-10'>
      <Image alt='logo' src={"/logo.svg"} width={164} height={36} />

      <input type='text' placeholder='search' className='focus:outline-none focus:border-none focus:ring-4 ring-indigo-500/40 bg-gray-200 h-10 px-5 rounded-md w-full max-w-md mx-3' onChange={onSearchInputChange} value={props.searchQuery} />

      <div className='flex gap-5 items-center'>
        <MoiButton label='Config' onClick={props.onClickConfig} />
        <MoiButton label='New Bookmark' onClick={props.onClickConfig} />
      </div>
    </header>
  )
}
