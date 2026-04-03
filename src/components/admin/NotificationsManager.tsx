import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Megaphone, Send, Users } from "lucide-react";
import { toast } from "sonner";

export function NotificationsManager() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Get all user IDs to send to
  const { data: userCount } = useQuery({
    queryKey: ["user-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("user_id", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const sendPromotion = useMutation({
    mutationFn: async ({ title, body }: { title: string; body: string }) => {
      // Get all user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id");
      if (profilesError) throw profilesError;

      if (!profiles?.length) throw new Error("No users found");

      // Insert notifications for all users
      const notifications = profiles.map((p) => ({
        user_id: p.user_id,
        title,
        body,
        type: "promotion" as const,
        is_read: false,
      }));

      // Batch insert in chunks of 100
      for (let i = 0; i < notifications.length; i += 100) {
        const chunk = notifications.slice(i, i + 100);
        const { error } = await supabase.from("notifications").insert(chunk);
        if (error) throw error;
      }

      return profiles.length;
    },
    onSuccess: (count) => {
      toast.success(`Promotion sent to ${count} users!`);
      setTitle("");
      setBody("");
    },
    onError: (error) => {
      toast.error(`Failed to send: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Please fill in both title and message");
      return;
    }
    sendPromotion.mutate({ title: title.trim(), body: body.trim() });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Send Promotional Notification
          </CardTitle>
          <CardDescription className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            Will be sent to {userCount ?? "..."} registered users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="promo-title">Title</Label>
              <Input
                id="promo-title"
                placeholder="e.g., 🎉 Special Weekend Offer!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="promo-body">Message</Label>
              <Textarea
                id="promo-body"
                placeholder="e.g., Get 20% off all smoothies this weekend! Use code SMOOTH20 at checkout."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={500}
                rows={3}
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!title.trim() || !body.trim() || sendPromotion.isPending}
            >
              <Send className="h-4 w-4 me-2" />
              {sendPromotion.isPending ? "Sending..." : "Send to All Users"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
