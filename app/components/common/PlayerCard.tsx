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
        "relative flex flex-col justify-between overflow-hidden rounded-xl border border-theme-light-gray bg-white hover:border-theme-green dark:bg-[#3f3f46] md:flex-row md:gap-4",
        rest.className,
      )}
    >
      <div className="flex items-center border-b border-theme-light-gray md:border-none">
        <PlayerAvatar
          className="h-10 w-10"
          src={player.photo_url}
          disableCache={false}
        />

        <div className="flex items-center gap-3 pr-2">
          <div className="flex items-center gap-2">
            {group && <GroupIcon color={group} />}
            <div className="flex">
              {mvp && (
                <Tooltip content="מקום ראשון">
                  <MVPIcon className="h-5 w-5" />
                </Tooltip>
              )}
              {goalsKing && (
                <Tooltip content="מלך השערים">
                  <GoalsKingIcon className="h-5 w-5" />
                </Tooltip>
              )}
            </div>
            <p>
              {!mvp && !goalsKing && (
                <span className="text-theme-green">{index + 1}. </span>
              )}
              {player.display_name}
            </p>
          </div>
          {player.is_goalkeeper && (
            <p className="text-xs font-medium text-theme-green">שוער</p>
          )}
        </div>
      </div>
      {showStats && (
        <div className="flex flex-row-reverse justify-between gap-2 p-2 font-medium text-theme-green">
          <Tooltip content="כמות שערים">
            <div className="flex items-center gap-1 rounded-lg border border-transparent bg-default-100 px-[6px] py-1 hover:border-theme-green md:py-0">
              <GoalIcon className="h-[14px] w-[14px]" />

              <p className="w-3 text-sm leading-[14px]">{player.goals || 0}</p>
            </div>
          </Tooltip>
          {player.is_goalkeeper && (
            <>
              <Tooltip content="הצלות פנדלים">
                <div className="flex items-center gap-1 rounded-lg border border-transparent bg-default-100 px-[6px] py-1 hover:border-theme-green md:py-0">
                  <PenaltyIcon className="h-4 w-4" />

                  <p className="w-3 text-sm leading-4">
                    {player.penalty_saved || 0}
                  </p>
                </div>
              </Tooltip>
              <Tooltip content="רשת נקייה">
                <div className="flex items-center gap-1 rounded-lg border border-transparent bg-default-100 px-[6px] py-1 hover:border-theme-green md:py-0">
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
