import type { Topsoccer } from "@/types";
import { cn } from "@heroui/theme";
import { Tooltip } from "@heroui/tooltip";
import { IconTrash } from "@tabler/icons-react";
import GroupIcon from "./GroupIcon";
import CleanNetIcon from "./icons/CleanNetIcon";
import GoalIcon from "./icons/GoalIcon";
import GoalsKingIcon from "./icons/GoalsKingIcon";
import MVPIcon from "./icons/MVPIcon";
import PenaltyIcon from "./icons/PenaltyIcon";
import PlayerAvatar from "./PlayerAvatar";

interface PlayerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  player: {
    id: string;
    display_name: string;
    photo_url: string | null;
    goals?: number;
    penalty_saved?: number;
    is_goalkeeper?: boolean;
    clean_net?: number;
  };
  group?: Topsoccer.Group.Name | null;
  mvp?: boolean;
  goalsKing?: boolean;
  index: number;
  showStats?: boolean;
  arbitraryStat?: any;
  onDelete?: (index: number) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  group,
  mvp,
  goalsKing,
  index,
  showStats = true,
  onDelete,
  arbitraryStat,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={cn(
        "relative flex justify-between overflow-hidden rounded-xl border border-theme-light-gray bg-white hover:border-theme-green dark:bg-[#3f3f46]",
        rest.className,
      )}
    >
      <div className="ml-4 flex items-center">
        <PlayerAvatar
          className="h-10 w-10"
          src={player.photo_url}
          disableCache={false}
        />

        <div className="mr-3 flex items-center gap-2">
          {group && <GroupIcon color={group} />}
          {mvp && (
            <Tooltip content="מקום ראשון">
              <MVPIcon className="h-6 w-6" />
            </Tooltip>
          )}
          {goalsKing && (
            <Tooltip content="מלך השערים">
              <GoalsKingIcon className="h-6 w-6" />
            </Tooltip>
          )}
          <p>
            {!mvp && !goalsKing && `${index + 1}. `}
            {player.display_name}
          </p>
          {player.is_goalkeeper && (
            <p className="mr-4 font-medium text-theme-green">שוער</p>
          )}
        </div>
      </div>
      {showStats && (
        <div className="flex justify-between gap-2 p-2 font-medium text-theme-green">
          <Tooltip content="כמות שערים">
            <div className="flex items-center gap-1 rounded-md bg-theme-card px-[6px]">
              <GoalIcon className="h-[14px] w-[14px]" />

              <p className="w-3 text-sm leading-[14px]">{player.goals || 0}</p>
            </div>
          </Tooltip>
          {player.is_goalkeeper && (
            <>
              <Tooltip content="הצלות פנדלים">
                <div className="flex items-center gap-1 rounded-md bg-theme-card px-[6px]">
                  <PenaltyIcon className="h-4 w-4" />

                  <p className="w-3 text-sm leading-4">
                    {player.penalty_saved || 0}
                  </p>
                </div>
              </Tooltip>
              <Tooltip content="רשת נקייה">
                <div className="flex items-center gap-1 rounded-md bg-theme-card px-[6px]">
                  <CleanNetIcon className="h-4 w-4" />

                  <p className="w-3 text-sm leading-4">
                    {player.clean_net || 0}
                  </p>
                </div>
              </Tooltip>
            </>
          )}
        </div>
      )}

      {onDelete && (
        <button
          className={cn(
            "absolute bottom-0 left-0 top-0 rounded-xl p-2 transition",
            "hover:bg-theme-light-gray",
          )}
          onClick={() => onDelete(index)}
          type="button"
        >
          <IconTrash className="text-danger" />
        </button>
      )}
      {arbitraryStat !== undefined && (
        <div className="absolute bottom-0 left-0 top-0 rounded-xl p-2">
          {arbitraryStat}
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
