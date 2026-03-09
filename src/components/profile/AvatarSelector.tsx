import { useState } from "react";
import { UserAvatar, AVATAR_OPTIONS } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const AvatarSelector = () => {
  const { avatarId: currentAvatarId, updateAvatar, isSaving } = useProfile();
  const [selected, setSelected] = useState(currentAvatarId);

  const hasChanged = selected !== currentAvatarId;

  const handleSave = async () => {
    if (!hasChanged) return;
    try {
      await updateAvatar(selected);
      toast.success("Avatar updated!");
    } catch {
      toast.error("Failed to update avatar");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-6 px-5">
      {/* Current preview */}
      <div className="relative">
        <UserAvatar avatarId={selected} size={96} className="ring-4 ring-primary/20 shadow-elevated" />
      </div>

      {/* 2x2 grid */}
      <div className="grid grid-cols-2 gap-4">
        {AVATAR_OPTIONS.map((id) => (
          <button
            key={id}
            onClick={() => setSelected(id)}
            className={`rounded-full transition-all duration-150 ${
              selected === id
                ? "ring-[3px] ring-primary scale-105"
                : "ring-2 ring-transparent hover:ring-muted-foreground/30"
            }`}
          >
            <UserAvatar avatarId={id} size={96} />
          </button>
        ))}
      </div>

      {/* Save button */}
      <Button
        onClick={handleSave}
        disabled={!hasChanged || isSaving}
        className="w-full max-w-[220px] rounded-full"
      >
        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
        Save Avatar
      </Button>
    </div>
  );
};
