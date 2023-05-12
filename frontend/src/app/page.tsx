'use client';

import Header from '@moi-meow/components/common/moiHeader';
import MoiModalProvider from '@moi-meow/components/common/moiModal';
import MoiButton from '@moi-meow/components/form/moiButton';
import BookmarkItem from '@moi-meow/components/item/bookmarkItem';
import AddBookmarkModal, { AddBookmarkModalRef } from '@moi-meow/components/modal/addBookmarkModal';
import PropsBookmarkModal, { PropsBookmarkModalRef } from '@moi-meow/components/modal/propsBookmarkModal';
import { BookmarkItemData } from '@moi-meow/utils/bookmark';
import { API_BASE_URL } from '@moi-meow/utils/common';
import useLocalStorageState from '@moi-meow/utils/useLocalStorageState';
import Image from 'next/image'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

export default function Home() {
  const timeoutIdRef = useRef<NodeJS.Timeout>();

  const addBookmarkRef = useRef<AddBookmarkModalRef>(null);
  const propsBookmarkRef = useRef<PropsBookmarkModalRef>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [showUrl, setShowUrl] = useLocalStorageState("_showUrl", false);
  const [showDesc, setShowDesc] = useLocalStorageState("_showDesc", false);
  const [showTags, setShowTags] = useLocalStorageState("_showTags", true);
  const [showPageTitle, setShowPageTitle] = useLocalStorageState("_showPageTitle", false);

  const [data, setData] = useState<Array<BookmarkItemData>>([]);

  useEffect(() => {
    getBookmarkData();

    return () => {

    }
  }, [])

  useEffect(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => getBookmarkData(), 300);

    return () => {
      clearTimeout(timeoutIdRef.current);
    }

  }, [searchQuery])

  async function getBookmarkData() {
    const response = await fetch(`${API_BASE_URL}bookmarks?search=${searchQuery}`);
    const jsonData = await response.json();

    setData(jsonData);
  }

  return (
    <MoiModalProvider>
      <main className="flex min-h-screen flex-col items-center gap-3 bg-gray-200 text-black">
        <AddBookmarkModal ref={addBookmarkRef} onAddBookmarkComplete={getBookmarkData} />
        <PropsBookmarkModal ref={propsBookmarkRef} />

        <Header setSearchQuery={setSearchQuery} searchQuery={searchQuery} onClickConfig={propsBookmarkRef.current?.openDialog} onClickNewBookmark={addBookmarkRef.current?.openDialog} />

        <div className='auto-grid gap-3 py-3 px-10'>
          {
            data.map((item, index) => {
              return <BookmarkItem key={item.id ?? index} item={item} index={index} showUrl={showUrl} showDesc={showDesc} showTags={showTags} showPageTitle={showPageTitle} onRequestUpdateData={getBookmarkData} />
            })
          }
        </div>
      </main>
    </MoiModalProvider>
  )
}
