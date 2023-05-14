import Image from 'next/image'
import React, { ChangeEvent } from 'react'
import MoiButton from '../form/moiButton'
import { useNotif } from './moiNotification';

import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import BookmarkAddRoundedIcon from '@mui/icons-material/BookmarkAddRounded';

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
      <Image alt='logo' src={"/logo.svg"} width={164} height={36} priority/>

      <input type='text' placeholder='search' className='focus:outline-none focus:border-none focus:ring-4 ring-indigo-500/40 bg-gray-200 h-10 px-5 rounded-md w-full max-w-md mx-3' onChange={onSearchInputChange} value={props.searchQuery} />

      <div className='flex gap-3 items-center'>
        <button onClick={props.onClickConfig} className='bg-indigo-100 text-indigo-500 rounded-md p-2 focus:outline-none focus:border-none hover:ring-4 focus:ring-4 ring-indigo-500/40 transition-all flex gap-2 flex-nowrap'>
          <SettingsRoundedIcon />
         </button>
        
        <button onClick={props.onClickNewBookmark} className='bg-indigo-500 text-white
         rounded-md px-3 py-2 focus:outline-none focus:border-none hover:ring-4 focus:ring-4 ring-indigo-500/40 transition-all flex gap-2 flex-nowrap'>
          <BookmarkAddRoundedIcon />
          New Bookmark
         </button>
      </div>
    </header>
  )
}
