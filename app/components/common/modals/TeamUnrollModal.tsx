import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  type ModalProps,
} from "@heroui/modal";
import type { Topsoccer } from "../../../../types";
import TeamCard from "../TeamCard";

interface TeamUnrollModalProps extends Omit<ModalProps, "children"> {
  userTeams: (Topsoccer.Team.FullTeam & {
    players: Topsoccer.User.UserInterface[];
  })[];
  unroll: (team_id: string) => void;
}

const TeamUnrollModal: React.FC<TeamUnrollModalProps> = ({
  userTeams,
  unroll,
  ...rest
}) => {
  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        <ModalHeader>בחר קבוצה:</ModalHeader>
        <ModalBody>
          <ul className="mt-2 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
            {userTeams.map((team) => (
              <button key={team.id} onClick={() => unroll(team.id)}>
                <TeamCard team={team} />
              </button>
            ))}
          </ul>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TeamUnrollModal;
