import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Tab {
  id: number;
  title: string;
  url: string;
  isSecure: boolean;
  favicon?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

interface HistoryItem {
  id: number;
  url: string;
  title: string;
  timestamp: Date;
  isSecure: boolean;
}

interface Bookmark {
  id: number;
  url: string;
  title: string;
  folder: string;
}

interface Download {
  id: number;
  filename: string;
  url: string;
  size: string;
  status: 'completed' | 'downloading' | 'paused';
  progress: number;
}

interface Extension {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
}

interface SearchResult {
  id: number;
  title: string;
  url: string;
  description: string;
  isSecure: boolean;
}

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
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Расширения</h2>
          <div className="grid gap-4">
            {extensions.map((ext) => (
              <Card key={ext.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name={ext.icon} size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{ext.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{ext.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={ext.enabled}
                    onCheckedChange={() => toggleExtension(ext.id)}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (activeSection === 'settings') {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Настройки</h2>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Безопасность</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="safe-browsing">Безопасный просмотр</Label>
                  <Switch id="safe-browsing" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="block-trackers">Блокировка трекеров</Label>
                  <Switch id="block-trackers" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="https-only">Только HTTPS</Label>
                  <Switch id="https-only" />
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Приватность</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="do-not-track">Do Not Track</Label>
                  <Switch id="do-not-track" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="clear-cookies">Очищать cookies при выходе</Label>
                  <Switch id="clear-cookies" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    if (activeSection === 'history') {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">История</h2>
            <Button variant="destructive" onClick={clearHistory} disabled={history.length === 0}>
              <Icon name="Trash2" size={16} className="mr-2" />
              Очистить всё
            </Button>
          </div>
          {history.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="History" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">История пуста</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {item.isSecure ? (
                        <Icon name="Lock" size={16} className="text-green-600" />
                      ) : (
                        <Icon name="ShieldAlert" size={16} className="text-destructive" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.url}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.timestamp.toLocaleString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHistoryItem(item.id)}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeSection === 'bookmarks') {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Закладки</h2>
          <div className="space-y-2">
            {bookmarks.map((bookmark) => (
              <Card key={bookmark.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Icon name="Bookmark" size={16} className="text-primary" />
                    <div>
                      <p className="font-medium">{bookmark.title}</p>
                      <p className="text-sm text-muted-foreground">{bookmark.url}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {bookmark.folder}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBookmark(bookmark.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (activeSection === 'downloads') {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Загрузки</h2>
          <div className="space-y-2">
            {downloads.map((download) => (
              <Card key={download.id} className="p-4">
                <div className="flex items-center gap-3">
                  <Icon name="FileDown" size={24} className="text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{download.filename}</p>
                    <p className="text-sm text-muted-foreground">{download.size}</p>
                    <Badge 
                      variant={download.status === 'completed' ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {download.status === 'completed' ? 'Завершено' : 'Загрузка...'}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Icon name="FolderOpen" size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (activeSection === 'profile') {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Профиль</h2>
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="User" size={40} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Пользователь</h3>
                <p className="text-sm text-muted-foreground">user@securebrowser.com</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Имя</Label>
                <Input defaultValue="Пользователь" className="mt-2" />
              </div>
              <div>
                <Label>Email</Label>
                <Input defaultValue="user@securebrowser.com" className="mt-2" />
              </div>
              <Button className="w-full">Сохранить изменения</Button>
            </div>
          </Card>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {sidebarOpen && (
        <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <Icon name="Shield" className="text-primary" size={24} />
              <h1 className="text-xl font-bold text-sidebar-foreground">SecureBrowser</h1>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <nav className="p-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                    activeSection === item.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Icon name={item.icon} size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </ScrollArea>
        </aside>
      )}

      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border">
          <div className="flex items-center gap-2 px-4 py-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Icon name="Menu" size={20} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={goHome}
              title="Домой"
            >
              <Icon name="Home" size={20} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={goBack}
              disabled={historyIndex <= 0}
            >
              <Icon name="ChevronLeft" size={20} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={goForward}
              disabled={historyIndex >= navigationHistory.length - 1}
            >
              <Icon name="ChevronRight" size={20} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={reload}
              disabled={!currentUrl}
            >
              <Icon name="RotateCw" size={20} />
            </Button>

            <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center gap-2">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {currentSafety.safe ? (
                    <Icon name="Lock" size={16} className="text-green-600" />
                  ) : (
                    <Icon name="ShieldAlert" size={16} className="text-destructive" />
                  )}
                </div>
                <Input
                  type="text"
                  placeholder="Поиск или введите адрес"
                  value={currentUrl}
                  onChange={(e) => setCurrentUrl(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
              <Button type="submit" size="icon" variant="ghost">
                <Icon name="Search" size={20} />
              </Button>
            </form>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={addBookmark}
              disabled={!currentUrl}
            >
              <Icon 
                name={isBookmarked ? "Star" : "Star"} 
                size={20}
                className={isBookmarked ? "fill-primary text-primary" : ""}
              />
            </Button>
          </div>

          <div className="flex items-center gap-1 px-2 pb-2 overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg min-w-[200px] max-w-[250px] cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? 'bg-background border-t border-l border-r border-border'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {tab.isSecure ? (
                  <Icon name="Lock" size={14} className="text-green-600 flex-shrink-0" />
                ) : (
                  <Icon name="ShieldAlert" size={14} className="text-destructive flex-shrink-0" />
                )}
                <span className="text-sm truncate flex-1">{tab.title}</span>
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="flex-shrink-0 hover:bg-muted-foreground/10 rounded p-1"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={addTab}
              className="flex-shrink-0"
            >
              <Icon name="Plus" size={20} />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-background">
          {activeSection !== 'extensions' && activeSection !== 'settings' && 
           activeSection !== 'history' && activeSection !== 'bookmarks' && 
           activeSection !== 'downloads' && activeSection !== 'profile' ? (
            isSearching ? (
              <div className="p-8">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6">Результаты поиска</h2>
                  <div className="space-y-4">
                    {searchResults.map((result) => (
                      <Card 
                        key={result.id} 
                        className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => openSearchResult(result)}
                      >
                        <div className="flex items-start gap-3">
                          {result.isSecure ? (
                            <Icon name="Lock" size={16} className="text-green-600 mt-1" />
                          ) : (
                            <Icon name="ShieldAlert" size={16} className="text-destructive mt-1" />
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-primary hover:underline mb-1">
                              {result.title}
                            </h3>
                            <p className="text-sm text-green-700 mb-2">{result.url}</p>
                            <p className="text-sm text-muted-foreground">{result.description}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : showHomePage && !currentUrl ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-4xl px-4">
                  <Icon name="Shield" size={64} className="mx-auto mb-6 text-primary" />
                  <h2 className="text-3xl font-bold mb-4">Добро пожаловать в SecureBrowser</h2>
                  <p className="text-muted-foreground mb-8">
                    Браузер с усиленной защитой от вредоносных сайтов
                  </p>

                  <div className="mb-12">
                    <h3 className="text-lg font-semibold mb-4">Популярные сайты</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {bookmarks.map((bookmark) => (
                        <Card 
                          key={bookmark.id}
                          className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => {
                            setCurrentUrl(bookmark.url);
                            const updatedTabs = tabs.map(tab => 
                              tab.id === activeTab 
                                ? { ...tab, url: bookmark.url, title: bookmark.title, isSecure: true }
                                : tab
                            );
                            setTabs(updatedTabs);
                            setShowHomePage(false);
                          }}
                        >
                          <Icon name="Globe" size={32} className="mx-auto mb-2 text-primary" />
                          <p className="text-sm font-medium">{bookmark.title}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <Card className="p-6 text-left">
                      <Icon name="ShieldCheck" className="text-primary mb-3" size={32} />
                      <h3 className="font-semibold mb-2">Защита от угроз</h3>
                      <p className="text-sm text-muted-foreground">
                        Автоматическая проверка сайтов на наличие вредоносного кода
                      </p>
                    </Card>
                    
                    <Card className="p-6 text-left">
                      <Icon name="Lock" className="text-primary mb-3" size={32} />
                      <h3 className="font-semibold mb-2">Безопасное соединение</h3>
                      <p className="text-sm text-muted-foreground">
                        Приоритет HTTPS-соединениям для защиты ваших данных
                      </p>
                    </Card>
                    
                    <Card className="p-6 text-left">
                      <Icon name="Eye" className="text-primary mb-3" size={32} />
                      <h3 className="font-semibold mb-2">Контроль приватности</h3>
                      <p className="text-sm text-muted-foreground">
                        Блокировка трекеров и защита личной информации
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8">
                {!currentSafety.safe && (
                  <Card className="border-destructive bg-destructive/10 p-6 mb-6">
                    <div className="flex items-start gap-4">
                      <Icon name="ShieldAlert" size={32} className="text-destructive flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-bold text-destructive mb-2">
                          {currentSafety.message}
                        </h3>
                        <p className="text-sm mb-4">
                          Этот сайт может содержать вредоносное ПО или попытаться украсть ваши данные.
                          Рекомендуем не продолжать просмотр.
                        </p>
                        <div className="flex gap-2">
                          <Button variant="destructive" onClick={() => setCurrentUrl('')}>
                            Вернуться в безопасное место
                          </Button>
                          <Button variant="outline">
                            Продолжить (не рекомендуется)
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
                
                <div className="text-center py-12">
                  <Badge variant="outline" className="mb-4">
                    {currentSafety.safe ? (
                      <><Icon name="CheckCircle" size={14} className="mr-1" /> Безопасно</>
                    ) : (
                      <><Icon name="AlertTriangle" size={14} className="mr-1" /> Опасно</>
                    )}
                  </Badge>
                  <p className="text-muted-foreground">
                    Загрузка: {currentUrl}
                  </p>
                </div>
              </div>
            )
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;