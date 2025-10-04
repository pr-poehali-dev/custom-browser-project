import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tab } from './BrowserTypes';

interface BrowserHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  goHome: () => void;
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  historyIndex: number;
  navigationHistory: string[];
  currentUrl: string;
  setCurrentUrl: (url: string) => void;
  handleUrlSubmit: (e: React.FormEvent) => void;
  currentSafety: { safe: boolean; message: string };
  addBookmark: () => void;
  isBookmarked: boolean;
  tabs: Tab[];
  activeTab: number;
  setActiveTab: (id: number) => void;
  closeTab: (id: number, e: React.MouseEvent) => void;
  addTab: () => void;
}

const BrowserHeader = ({
  sidebarOpen,
  setSidebarOpen,
  goHome,
  goBack,
  goForward,
  reload,
  historyIndex,
  navigationHistory,
  currentUrl,
  setCurrentUrl,
  handleUrlSubmit,
  currentSafety,
  addBookmark,
  isBookmarked,
  tabs,
  activeTab,
  setActiveTab,
  closeTab,
  addTab
}: BrowserHeaderProps) => {
  return (
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
  );
};

export default BrowserHeader;
