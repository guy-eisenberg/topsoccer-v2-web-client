import type { Topsoccer } from "@/types";
import { cn } from "@heroui/theme";
import TeamAvatar from "./TeamAvatar";

interface TeamCardProps extends React.HTMLAttributes<HTMLDivElement> {
  team: { id: string; name: string; photo_url: string | null } & {
    players: Topsoccer.User.UserInterface[];
  };
  isAdmin?: boolean;
  buttons?: React.ReactNode;
}

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  isAdmin = false,
  buttons,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={cn(
        "col-span-1 flex cursor-pointer items-start gap-4 rounded-xl border border-theme-light-gray bg-theme-foreground p-4 hover:border-theme-green",
        rest.className,
      )}
    >
      <TeamAvatar
        className="h-14 w-14 rounded-xl object-contain"
        src={team.photo_url}
      />
      <div>
        <div className="flex flex-col items-start">
          <p className="mb-1 text-xl font-semibold">{team.name}</p>
          <p className="whitespace-nowrap text-sm">
            {team.players.length} שחקנים
          </p>
          {isAdmin && (
            <p className="mt-1 whitespace-nowrap text-xs text-theme-green">
              אתה מנהל הקבוצה
            </p>
          )}
        </div>
        {buttons && (
          <div
            className="mt-4 flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {buttons}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
