import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AVATAR_COLORS = [
  "bg-primary text-primary-foreground",
  "bg-accent text-accent-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-muted text-muted-foreground",
] as const;

export const AVATAR_OPTIONS = ["avatar_1", "avatar_2", "avatar_3", "avatar_4"] as const;

const AVATAR_EMOJIS: Record<string, string> = {
  avatar_1: "😊",
  avatar_2: "😎",
  avatar_3: "🤩",
  avatar_4: "🧃",
};

interface UserAvatarProps {
  avatarId?: string;
  size?: number;
  className?: string;
  name?: string;
}

export const UserAvatar = ({ avatarId = "avatar_1", size = 96, className = "", name }: UserAvatarProps) => {
  const index = AVATAR_OPTIONS.indexOf(avatarId as any);
  const colorClass = AVATAR_COLORS[index >= 0 ? index : 0];
  const emoji = AVATAR_EMOJIS[avatarId] || "😊";
  const fontSize = Math.max(size * 0.4, 16);

  return (
    <Avatar className={`${className}`} style={{ width: size, height: size }}>
      <AvatarFallback className={`${colorClass} text-lg`} style={{ fontSize }}>
        {name ? name.charAt(0).toUpperCase() : emoji}
      </AvatarFallback>
    </Avatar>
  );
};

export const getAvatarSrc = (_avatarId: string): string => "";
