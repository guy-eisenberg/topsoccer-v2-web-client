import {
  cn,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  type ModalProps,
} from "@heroui/react";
import type { Topsoccer } from "../../../../types";
import TeamCard from "../TeamCard";

interface TeamEnrollModalProps extends Omit<ModalProps, "children"> {
  event: Topsoccer.Event.Object & {
    teams: Topsoccer.Team.FullTeam[];
  };
  userTeams: (Topsoccer.Team.FullTeam & {
    players: Topsoccer.User.UserInterface[];
  })[];
  enroll: (team_id: string) => void;
}

const TeamEnrollModal: React.FC<TeamEnrollModalProps> = ({
  event,
  userTeams,
  enroll,
  ...rest
}) => {
  return (
    <Modal placement="center" scrollBehavior="inside" {...rest}>
      <ModalContent>
        <ModalHeader>בחר קבוצה:</ModalHeader>
        <ModalBody>
          <ul
            className={cn(
              "mt-2 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto scrollbar-hide",
            )}
          >
            {userTeams
              .filter(
                (team) =>
                  !event.teams?.map((team) => team.id).includes(team.id),
              )
              .map((team) => (
                <button key={team.id} onClick={() => enroll(team.id)}>
                  <TeamCard team={team} />
                </button>
              ))}
          </ul>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TeamEnrollModal;
