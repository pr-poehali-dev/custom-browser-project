import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download } from '../BrowserTypes';

interface DownloadsSectionProps {
  downloads: Download[];
}

const DownloadsSection = ({ downloads }: DownloadsSectionProps) => {
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
};

export default DownloadsSection;
