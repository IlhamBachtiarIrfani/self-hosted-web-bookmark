'use client';

import Header from '@moi-meow/components/common/moiHeader';
import { useNotif } from '@moi-meow/components/common/moiNotification';
import BookmarkItem from '@moi-meow/components/item/bookmarkItem';
import { BookmarkItemData } from '@moi-meow/utils/bookmark';
import useApiBaseUrl from '@moi-meow/utils/useApiBaseUrl';
import useLocalStorageState from '@moi-meow/utils/useLocalStorageState';
import { useCallback, useEffect, useRef, useState } from 'react'

export default function Home() {
  const API_BASE_URL = useApiBaseUrl();

  const useMoiNotif = useNotif();
  const timeoutIdRef = useRef<NodeJS.Timeout>();

  const [searchQuery, setSearchQuery] = useState("");

  const [showUrl, setShowUrl] = useLocalStorageState("_showUrl", false);
  const [showDesc, setShowDesc] = useLocalStorageState("_showDesc", false);
  const [showTags, setShowTags] = useLocalStorageState("_showTags", true);
  const [showPageTitle, setShowPageTitle] = useLocalStorageState("_showPageTitle", false);

  const [data, setData] = useState<Array<BookmarkItemData>>([]);

  // ===== GET BOOKMARK DATA FETCH API =====
  const getBookmarkData = useCallback(async () => {
    if (!API_BASE_URL) return;

    const response = await fetch(`${API_BASE_URL}bookmarks?search=${searchQuery}`);
    const jsonData = await response.json();

    setData(jsonData);
  }, [searchQuery, API_BASE_URL])

  // ===== ON EVENT IS CHANGE UPDATE BOOKMARK =====
  const handleEventSource = useCallback(() => {
    const source = new EventSource(`${API_BASE_URL}bookmarks/subscribe`);

    source.onmessage = function (event) {
      const jsonData = JSON.parse(event.data);
      if (jsonData.notification === "dataUpdated") {
        getBookmarkData();

        useMoiNotif.addNotif({
          title: "Data Updated",
          desc: jsonData.detail
        });
      }
    };
    return source;
  }, [API_BASE_URL, getBookmarkData, useMoiNotif]);

  // ===== ON SEARCH CHANGE ======
  const onSearchQuery = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => getBookmarkData(), 300);

    return () => {
      clearTimeout(timeoutIdRef.current);
    }

  }, [getBookmarkData])

  // ===== ON INPUT SEARCH CHANGE =====
  useEffect(() => {
    onSearchQuery();
  }, [searchQuery, onSearchQuery])

  // ===== ON APP START =====
  useCallback(() => {
    if (API_BASE_URL) {

      console.log("First call on mount..");
      console.log(API_BASE_URL);

      const source = handleEventSource();
      getBookmarkData();

      return () => {
        source.close();
        console.log("Cleanup..");
      }
    }
  }, [API_BASE_URL, getBookmarkData, handleEventSource])

  return (
    <main className="flex min-h-screen flex-col items-center gap-3 bg-gray-200 text-black">
      <Header setSearchQuery={setSearchQuery} searchQuery={searchQuery} />

      <div className='auto-grid gap-3 py-3 px-10'>
        {
          data.map((item, index) => {
            return <BookmarkItem key={item.id ?? index} item={item} index={index} showUrl={showUrl} showDesc={showDesc} showTags={showTags} showPageTitle={showPageTitle} onRequestUpdateData={getBookmarkData} />
          })
        }
      </div>
    </main>
  )
}
