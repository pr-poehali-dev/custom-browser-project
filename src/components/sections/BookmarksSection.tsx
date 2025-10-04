import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark } from '../BrowserTypes';

interface BookmarksSectionProps {
  bookmarks: Bookmark[];
  removeBookmark: (id: number) => void;
}

const BookmarksSection = ({ bookmarks, removeBookmark }: BookmarksSectionProps) => {
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
};

export default BookmarksSection;
