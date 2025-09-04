import PlayerAvatar from "@/app/components/common/PlayerAvatar";
import { Button } from "@/app/components/core/Button";
import type { Topsoccer } from "@/types";
import { cn, Tooltip } from "@heroui/react";
import { useState } from "react";
import RemovePlayerModal from "../components/modals/RemovePlayerModal";

interface ManagePlayerWaitingCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  player: Topsoccer.User.UserInterface & {
    phone_number: string | null;
  };
  removePlayer: () => Promise<void>;
}

export default function ManagePlayerWaitingCard({
  player,
  removePlayer,
  ...rest
}: ManagePlayerWaitingCardProps) {
  const [removePlayerModalOpen, setRemovePlayerModalOpen] = useState(false);

  return (
    <div
      {...rest}
      className={cn(
        "relative flex flex-col items-center gap-1 rounded-xl border border-theme-light-gray bg-theme-card p-2",
        rest.className,
      )}
    >
      <PlayerAvatar className="h-10 w-10 rounded-xl" src={player.photo_url} />
      <p>{player.display_name}</p>
      <div className="flex w-full gap-2 text-center text-xs">
        <Tooltip content={player.email}>
          <p className="min-w-0 flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-xl border border-theme-light-gray bg-theme-light-gray/50 py-1">
            <span className="px-1">{player.email}</span>
          </p>
        </Tooltip>
        {player.phone_number && (
          <Tooltip content={player.phone_number}>
            <p className="flex-1 rounded-xl border border-theme-light-gray bg-theme-light-gray/50 py-1">
              {player.phone_number}
            </p>
          </Tooltip>
        )}
      </div>
      <Button color="danger" onPress={() => setRemovePlayerModalOpen(true)}>
        מחק
      </Button>
      <RemovePlayerModal
        player={player}
        removePlayer={removePlayer}
        isOpen={removePlayerModalOpen}
        onOpenChange={setRemovePlayerModalOpen}
      />
    </div>
  );
}
