import { useNotifications, Notification } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCheck, ShoppingCart, Package, Megaphone, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const typeIcons: Record<Notification["type"], React.ReactNode> = {
  cart_reminder: <ShoppingCart className="h-4 w-4 text-orange-500" />,
  order_update: <Package className="h-4 w-4 text-primary" />,
  promotion: <Megaphone className="h-4 w-4 text-green-500" />,
};

export function NotificationList() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {unreadCount > 0 && (
        <div className="px-4 py-2 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            <CheckCheck className="h-3.5 w-3.5 me-1" />
            Mark all as read
          </Button>
        </div>
      )}

      <ScrollArea className="flex-1">
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No notifications yet</p>
            <p className="text-xs mt-1">We'll notify you about your orders</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex gap-3 ${
                  !notification.is_read ? "bg-primary/5" : ""
                }`}
                onClick={() => {
                  if (!notification.is_read) {
                    markAsRead.mutate(notification.id);
                  }
                }}
              >
                <div className="mt-0.5 shrink-0">
                  {typeIcons[notification.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${!notification.is_read ? "font-semibold" : "font-medium"} text-foreground`}>
                      {notification.title}
                    </p>
                    {!notification.is_read && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {notification.body}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
