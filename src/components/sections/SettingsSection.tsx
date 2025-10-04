import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const SettingsSection = () => {
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
};

export default SettingsSection;
