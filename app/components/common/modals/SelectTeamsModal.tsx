import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/modal";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import type { Topsoccer } from "../../../../types";
import { Button } from "../../core/Button";
import TeamAvatar from "../TeamAvatar";

interface SelectTeamsModalProps extends Omit<ModalProps, "children"> {
  amount: number;
  exact?: boolean;
  teams: Topsoccer.Team.FullTeam[];
  onTeamsSubmit?: (selectedTeams: Topsoccer.Team.FullTeam[]) => void;
}

const SelectTeamsModal: React.FC<SelectTeamsModalProps> = ({
  amount,
  teams,
  exact = true,
  onTeamsSubmit,
  ...rest
}) => {
  const [selectedTeams, setSelectedTeams] = useState<Topsoccer.Team.FullTeam[]>(
    [],
  );

  return (
    <Modal placement="center" scrollBehavior="inside" {...rest}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>בחר קבוצה:</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-2">
                {teams.map((team) => (
                  <button
                    className="flex items-center justify-between gap-4 rounded-xl border border-theme-light-gray px-4 py-2 transition hover:border-theme-green"
                    onClick={() => {
                      if (
                        selectedTeams.length < amount &&
                        !selectedTeams.includes(team)
                      )
                        setSelectedTeams([...selectedTeams, team]);
                      else if (selectedTeams.includes(team)) {
                        const index = selectedTeams.indexOf(team);

                        const newSelectedTeams = [...selectedTeams];

                        newSelectedTeams.splice(index, 1);

                        setSelectedTeams(newSelectedTeams);
                      }
                    }}
                    key={team.id}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-12 w-12 overflow-hidden rounded-xl">
                        <TeamAvatar
                          className="h-12 w-12 object-contain"
                          src={team.photo_url}
                        />
                      </div>
                      <p>{team.name}</p>
                    </div>
                    <IconCheck
                      className="transition"
                      style={{
                        opacity: selectedTeams.includes(team) ? 1 : 0,
                      }}
                    />
                  </button>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onPress={onClose}>
                חזור
              </Button>
              <Button
                color="primary"
                isDisabled={
                  (exact && selectedTeams.length < amount) ||
                  (!exact && selectedTeams.length === 0)
                }
                onPress={() => {
                  if (onTeamsSubmit) {
                    onTeamsSubmit(selectedTeams);
                  }
                }}
              >
                שמור
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SelectTeamsModal;
