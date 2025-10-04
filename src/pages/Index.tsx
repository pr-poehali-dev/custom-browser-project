import { useState, useEffect } from 'react';
import BrowserSidebar from '@/components/BrowserSidebar';
import BrowserHeader from '@/components/BrowserHeader';
import BrowserContent from '@/components/BrowserContent';
import ExtensionsSection from '@/components/sections/ExtensionsSection';
import SettingsSection from '@/components/sections/SettingsSection';
import HistorySection from '@/components/sections/HistorySection';
import BookmarksSection from '@/components/sections/BookmarksSection';
import DownloadsSection from '@/components/sections/DownloadsSection';
import ProfileSection from '@/components/sections/ProfileSection';
import {
  Tab,
  MenuItem,
  HistoryItem,
  Bookmark,
  Download,
  Extension,
  SearchResult
} from '@/components/BrowserTypes';

const Index = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 0, title: 'Новая вкладка', url: '', isSecure: true }
  ]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [activeSection, setActiveSection] = useState('extensions');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: 1, url: 'https://google.com', title: 'Google', folder: 'Часто используемые' },
    { id: 2, url: 'https://github.com', title: 'GitHub', folder: 'Разработка' },
  ]);
  const [downloads, setDownloads] = useState<Download[]>([
    { id: 1, filename: 'document.pdf', url: 'https://example.com/doc.pdf', size: '2.3 MB', status: 'completed', progress: 100 },
    { id: 2, filename: 'image.png', url: 'https://example.com/img.png', size: '1.1 MB', status: 'completed', progress: 100 },
  ]);
  const [extensions, setExtensions] = useState<Extension[]>([
    { id: 1, name: 'AdBlock Plus', description: 'Блокировка рекламы и трекеров', enabled: true, icon: 'Shield' },
    { id: 2, name: 'Dark Reader', description: 'Тёмная тема для всех сайтов', enabled: false, icon: 'Moon' },
    { id: 3, name: 'Password Manager', description: 'Безопасное хранение паролей', enabled: true, icon: 'Key' },
  ]);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showHomePage, setShowHomePage] = useState(true);

  const menuItems: MenuItem[] = [
    { id: 'extensions', label: 'Расширения', icon: 'Puzzle' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
    { id: 'history', label: 'История', icon: 'History' },
    { id: 'bookmarks', label: 'Закладки', icon: 'Bookmark' },
    { id: 'downloads', label: 'Загрузки', icon: 'Download' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
  ];

  const addTab = () => {
    const newTab = {
      id: Date.now(),
      title: 'Новая вкладка',
      url: '',
      isSecure: true
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
    setCurrentUrl('');
  };

  const closeTab = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = tabs.filter(tab => tab.id !== id);
    if (newTabs.length === 0) {
      addTab();
    } else if (activeTab === id) {
      const currentIndex = tabs.findIndex(t => t.id === id);
      const nextTab = newTabs[Math.min(currentIndex, newTabs.length - 1)];
      setActiveTab(nextTab.id);
      setCurrentUrl(nextTab.url);
    }
    setTabs(newTabs);
  };

  const checkUrlSafety = (url: string): { safe: boolean; message: string } => {
    const dangerousPatterns = [
      'phishing', 'malware', 'virus', 'hack', 'scam', 
      'fraud', 'suspicious', 'dangerous'
    ];
    
    const urlLower = url.toLowerCase();
    const isDangerous = dangerousPatterns.some(pattern => urlLower.includes(pattern));
    
    if (isDangerous) {
      return { 
        safe: false, 
        message: 'Внимание! Сайт может быть опасным' 
      };
    }
    
    if (url.startsWith('https://')) {
      return { 
        safe: true, 
        message: 'Безопасное соединение' 
      };
    }
    
    return { 
      safe: true, 
      message: 'Незащищенное соединение' 
    };
  };

  const performSearch = (query: string) => {
    const mockResults: SearchResult[] = [
      {
        id: 1,
        title: `Результаты поиска: ${query}`,
        url: `https://google.com/search?q=${encodeURIComponent(query)}`,
        description: `Поиск в Google по запросу "${query}"`,
        isSecure: true
      },
      {
        id: 2,
        title: `${query} - Википедия`,
        url: `https://ru.wikipedia.org/wiki/${encodeURIComponent(query)}`,
        description: `Статья в Википедии о ${query}`,
        isSecure: true
      },
      {
        id: 3,
        title: `${query} видео`,
        url: `https://youtube.com/results?search_query=${encodeURIComponent(query)}`,
        description: `Видео на YouTube по запросу "${query}"`,
        isSecure: true
      },
      {
        id: 4,
        title: `${query} - новости`,
        url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
        description: `Актуальные новости о ${query}`,
        isSecure: true
      },
      {
        id: 5,
        title: `Изображения ${query}`,
        url: `https://google.com/search?q=${encodeURIComponent(query)}&tbm=isch`,
        description: `Картинки и фото по запросу "${query}"`,
        isSecure: true
      }
    ];
    setSearchResults(mockResults);
    setIsSearching(true);
    setShowHomePage(false);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUrl.trim()) return;

    const isUrl = currentUrl.includes('.') || currentUrl.startsWith('http');
    
    if (!isUrl) {
      performSearch(currentUrl);
      return;
    }

    const safety = checkUrlSafety(currentUrl);
    const updatedTabs = tabs.map(tab => 
      tab.id === activeTab 
        ? { ...tab, url: currentUrl, isSecure: safety.safe, title: currentUrl.replace(/^https?:\/\//, '').split('/')[0] }
        : tab
    );
    setTabs(updatedTabs);

    const newHistoryItem: HistoryItem = {
      id: Date.now(),
      url: currentUrl,
      title: currentUrl.replace(/^https?:\/\//, '').split('/')[0],
      timestamp: new Date(),
      isSecure: safety.safe
    };
    setHistory([newHistoryItem, ...history]);

    setNavigationHistory([...navigationHistory.slice(0, historyIndex + 1), currentUrl]);
    setHistoryIndex(historyIndex + 1);
    setIsSearching(false);
    setShowHomePage(false);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(navigationHistory[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(navigationHistory[historyIndex + 1]);
    }
  };

  const reload = () => {
    if (currentUrl) {
      const updatedTabs = tabs.map(tab => 
        tab.id === activeTab 
          ? { ...tab, url: currentUrl }
          : tab
      );
      setTabs(updatedTabs);
    }
  };

  const goHome = () => {
    setCurrentUrl('');
    setIsSearching(false);
    setShowHomePage(true);
    setSearchResults([]);
    const updatedTabs = tabs.map(tab => 
      tab.id === activeTab 
        ? { ...tab, url: '', title: 'Новая вкладка' }
        : tab
    );
    setTabs(updatedTabs);
  };

  const openSearchResult = (result: SearchResult) => {
    setCurrentUrl(result.url);
    const updatedTabs = tabs.map(tab => 
      tab.id === activeTab 
        ? { ...tab, url: result.url, isSecure: result.isSecure, title: result.title }
        : tab
    );
    setTabs(updatedTabs);
    
    const newHistoryItem: HistoryItem = {
      id: Date.now(),
      url: result.url,
      title: result.title,
      timestamp: new Date(),
      isSecure: result.isSecure
    };
    setHistory([newHistoryItem, ...history]);
    setIsSearching(false);
    setShowHomePage(false);
  };

  const addBookmark = () => {
    if (currentUrl) {
      const newBookmark: Bookmark = {
        id: Date.now(),
        url: currentUrl,
        title: currentUrl.replace(/^https?:\/\//, '').split('/')[0],
        folder: 'Без категории'
      };
      setBookmarks([...bookmarks, newBookmark]);
    }
  };

  const removeBookmark = (id: number) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const toggleExtension = (id: number) => {
    setExtensions(extensions.map(ext => 
      ext.id === id ? { ...ext, enabled: !ext.enabled } : ext
    ));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const removeHistoryItem = (id: number) => {
    setHistory(history.filter(h => h.id !== id));
  };

  useEffect(() => {
    const currentTab = tabs.find(t => t.id === activeTab);
    if (currentTab) {
      setCurrentUrl(currentTab.url);
    }
  }, [activeTab, tabs]);

  const currentSafety = currentUrl ? checkUrlSafety(currentUrl) : { safe: true, message: '' };
  const isBookmarked = bookmarks.some(b => b.url === currentUrl);

  const renderContent = () => {
    if (activeSection === 'extensions') {
      return <ExtensionsSection extensions={extensions} toggleExtension={toggleExtension} />;
    }
    if (activeSection === 'settings') {
      return <SettingsSection />;
    }
    if (activeSection === 'history') {
      return <HistorySection history={history} clearHistory={clearHistory} removeHistoryItem={removeHistoryItem} />;
    }
    if (activeSection === 'bookmarks') {
      return <BookmarksSection bookmarks={bookmarks} removeBookmark={removeBookmark} />;
    }
    if (activeSection === 'downloads') {
      return <DownloadsSection downloads={downloads} />;
    }
    if (activeSection === 'profile') {
      return <ProfileSection />;
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {sidebarOpen && (
        <BrowserSidebar 
          menuItems={menuItems} 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
      )}

      <div className="flex-1 flex flex-col">
        <BrowserHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          goHome={goHome}
          goBack={goBack}
          goForward={goForward}
          reload={reload}
          historyIndex={historyIndex}
          navigationHistory={navigationHistory}
          currentUrl={currentUrl}
          setCurrentUrl={setCurrentUrl}
          handleUrlSubmit={handleUrlSubmit}
          currentSafety={currentSafety}
          addBookmark={addBookmark}
          isBookmarked={isBookmarked}
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          closeTab={closeTab}
          addTab={addTab}
        />

        <main className="flex-1 overflow-auto bg-background">
          {activeSection !== 'extensions' && activeSection !== 'settings' && 
           activeSection !== 'history' && activeSection !== 'bookmarks' && 
           activeSection !== 'downloads' && activeSection !== 'profile' ? (
            <BrowserContent
              isSearching={isSearching}
              searchResults={searchResults}
              openSearchResult={openSearchResult}
              showHomePage={showHomePage}
              currentUrl={currentUrl}
              bookmarks={bookmarks}
              tabs={tabs}
              activeTab={activeTab}
              setCurrentUrl={setCurrentUrl}
              setTabs={setTabs}
              setShowHomePage={setShowHomePage}
              currentSafety={currentSafety}
            />
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
