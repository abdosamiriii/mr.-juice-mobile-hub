import { useState } from "react";
import avatar1 from "@/assets/avatars/avatar_1.png";
import avatar2 from "@/assets/avatars/avatar_2.png";
import avatar3 from "@/assets/avatars/avatar_3.png";
import avatar4 from "@/assets/avatars/avatar_4.png";

const avatarMap: Record<string, string> = {
  avatar_1: avatar1,
  avatar_2: avatar2,
  avatar_3: avatar3,
  avatar_4: avatar4,
};

export const getAvatarSrc = (avatarId: string): string => {
  return avatarMap[avatarId] || avatarMap.avatar_1;
};

export const AVATAR_OPTIONS = ["avatar_1", "avatar_2", "avatar_3", "avatar_4"] as const;

interface UserAvatarProps {
  avatarId?: string;
  size?: number;
  className?: string;
}

export const UserAvatar = ({ avatarId = "avatar_1", size = 96, className = "" }: UserAvatarProps) => {
  const [error, setError] = useState(false);
  const src = error ? avatarMap.avatar_1 : getAvatarSrc(avatarId);

  return (
    <img
      src={src}
      alt="User avatar"
      width={size}
      height={size}
      onError={() => setError(true)}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
