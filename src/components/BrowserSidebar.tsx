import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuItem } from './BrowserTypes';

interface BrowserSidebarProps {
  menuItems: MenuItem[];
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const BrowserSidebar = ({ menuItems, activeSection, setActiveSection }: BrowserSidebarProps) => {
  return (
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
  );
};

export default BrowserSidebar;
