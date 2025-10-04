import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Extension } from '../BrowserTypes';

interface ExtensionsSectionProps {
  extensions: Extension[];
  toggleExtension: (id: number) => void;
}

const ExtensionsSection = ({ extensions, toggleExtension }: ExtensionsSectionProps) => {
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
};

export default ExtensionsSection;
