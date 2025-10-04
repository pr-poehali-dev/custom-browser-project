import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HistoryItem } from '../BrowserTypes';

interface HistorySectionProps {
  history: HistoryItem[];
  clearHistory: () => void;
  removeHistoryItem: (id: number) => void;
}

const HistorySection = ({ history, clearHistory, removeHistoryItem }: HistorySectionProps) => {
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
};

export default HistorySection;
