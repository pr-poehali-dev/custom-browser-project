import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchResult, Tab, Bookmark } from './BrowserTypes';

interface BrowserContentProps {
  isSearching: boolean;
  searchResults: SearchResult[];
  openSearchResult: (result: SearchResult) => void;
  showHomePage: boolean;
  currentUrl: string;
  bookmarks: Bookmark[];
  tabs: Tab[];
  activeTab: number;
  setCurrentUrl: (url: string) => void;
  setTabs: (tabs: Tab[]) => void;
  setShowHomePage: (show: boolean) => void;
  currentSafety: { safe: boolean; message: string };
}

const BrowserContent = ({
  isSearching,
  searchResults,
  openSearchResult,
  showHomePage,
  currentUrl,
  bookmarks,
  tabs,
  activeTab,
  setCurrentUrl,
  setTabs,
  setShowHomePage,
  currentSafety
}: BrowserContentProps) => {
  if (isSearching) {
    return (
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
    );
  }

  if (showHomePage && !currentUrl) {
    return (
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
    );
  }

  return (
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
  );
};

export default BrowserContent;
