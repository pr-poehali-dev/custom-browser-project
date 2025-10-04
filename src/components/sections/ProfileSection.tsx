import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProfileSection = () => {
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
};

export default ProfileSection;
