import Image from 'next/image'
import React, { ChangeEvent } from 'react'
import MoiButton from '../form/moiButton'
import { useNotif } from './moiNotification';

import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import BookmarkAddRoundedIcon from '@mui/icons-material/BookmarkAddRounded';
import { useModal } from './moiModal';
import PropsBookmarkModal from '../modalView/propsBookmarkModal';
import AddBookmarkModal from '../modalView/addBookmarkModal';

interface MoiHeaderProps {
  setSearchQuery: (value: string) => void;
  searchQuery: string;
}

export default function MoiHeader(props: MoiHeaderProps) {
  const useMoiModal = useModal();
  function onSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    props.setSearchQuery(event.target.value);
  }

  function onConfigClick() {
    useMoiModal.showModal(<PropsBookmarkModal/>);
  }

  function onAddBookmarkClick() {
    useMoiModal.showModal(<AddBookmarkModal onClose={useMoiModal.hideModal}/>);
  }

  return (
    <header className='flex items-center justify-between bg-white w-full py-3 px-5 md:px-10'>
      <Image alt='logo' src={"/logo.svg"} width={164} height={36} priority/>

      <input type='text' placeholder='search' className='hidden md:flex focus:outline-none focus:border-none focus:ring-4 ring-indigo-500/40 bg-gray-200 h-10 px-5 rounded-md w-full max-w-md mx-3' onChange={onSearchInputChange} value={props.searchQuery} />

      <div className='flex gap-3 items-center'>
        <button onClick={onConfigClick} className='bg-indigo-100 text-indigo-500 rounded-md p-2 focus:outline-none focus:border-none hover:ring-4 focus:ring-4 ring-indigo-500/40 transition-all flex gap-2 flex-nowrap'>
          <SettingsRoundedIcon />
         </button>
        
        <button onClick={onAddBookmarkClick} className='bg-indigo-500 text-white
         rounded-md px-3 py-2 focus:outline-none focus:border-none hover:ring-4 focus:ring-4 ring-indigo-500/40 transition-all flex gap-2 flex-nowrap whitespace-nowrap'>
          <BookmarkAddRoundedIcon />
          New Bookmark
         </button>
      </div>
    </header>
  )
}
