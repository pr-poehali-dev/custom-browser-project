import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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

const Index = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 0, title: 'Новая вкладка', url: '', isSecure: true }
  ]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [activeSection, setActiveSection] = useState('extensions');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      id: tabs.length,
      title: 'Новая вкладка',
      url: '',
      isSecure: true
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const closeTab = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = tabs.filter(tab => tab.id !== id);
    if (newTabs.length === 0) {
      addTab();
    } else if (activeTab === id) {
      setActiveTab(newTabs[0].id);
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

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const safety = checkUrlSafety(currentUrl);
    const updatedTabs = tabs.map(tab => 
      tab.id === activeTab 
        ? { ...tab, url: currentUrl, isSecure: safety.safe, title: currentUrl || 'Новая вкладка' }
        : tab
    );
    setTabs(updatedTabs);
  };

  const currentSafety = currentUrl ? checkUrlSafety(currentUrl) : { safe: true, message: '' };

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
            
            <Button variant="ghost" size="icon">
              <Icon name="ChevronLeft" size={20} />
            </Button>
            
            <Button variant="ghost" size="icon">
              <Icon name="ChevronRight" size={20} />
            </Button>
            
            <Button variant="ghost" size="icon">
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

            <Button variant="ghost" size="icon">
              <Icon name="Star" size={20} />
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
          {!currentUrl ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-2xl px-4">
                <Icon name="Shield" size={64} className="mx-auto mb-6 text-primary" />
                <h2 className="text-3xl font-bold mb-4">Добро пожаловать в SecureBrowser</h2>
                <p className="text-muted-foreground mb-8">
                  Браузер с усиленной защитой от вредоносных сайтов
                </p>
                
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
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
