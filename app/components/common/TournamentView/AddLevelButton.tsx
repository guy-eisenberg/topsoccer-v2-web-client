import { IconPlus } from "@tabler/icons-react";
import React, { useMemo, useState } from "react";
import type { Topsoccer } from "../../../../types";
import { Button } from "../../core/Button";
import SelectTeamsModal from "../modals/SelectTeamsModal";

interface AddLevelButtonProps {
  exclude?: Topsoccer.Team.FullTeam[];
  levelType: Topsoccer.Level.Type;
  teams: Topsoccer.Team.FullTeam[];
  onLevelSubmit?: (house: Topsoccer.Level.LevelCreateData) => void;
}

const AddLevelButton: React.FC<
  React.ComponentProps<typeof Button> & AddLevelButtonProps
> = ({ teams, exclude, levelType, onLevelSubmit, ...rest }) => {
  const [selectTeamsModalOpen, setSelectTeamsModalOpen] = useState(false);

  const filteredTeams = useMemo(
    () =>
      exclude
        ? teams.filter(
            (team) => !exclude.map((team) => team.id).includes(team?.id),
          )
        : teams,
    [teams, exclude],
  );

  const levelLabel = (() => {
    switch (levelType) {
      case "House":
        return "בית";
      case "Quarters":
        return "רבע גמר";
      case "Semi":
        return "חצי גמר";
      case "Final":
        return "גמר";
    }
  })();

  return (
    <>
      <Button
        {...rest}
        color="primary"
        onPress={() => setSelectTeamsModalOpen(true)}
        endContent={<IconPlus />}
      >
        <p>צור {levelLabel} חדש</p>
        <SelectTeamsModal
          amount={levelType === "House" ? 5 : 2}
          exact={!(levelType === "House")}
          teams={filteredTeams}
          onTeamsSubmit={levelSubmit}
          isOpen={selectTeamsModalOpen}
          onOpenChange={setSelectTeamsModalOpen}
        />
      </Button>
    </>
  );

  function levelSubmit(selectedTeams: Topsoccer.Team.FullTeam[]) {
    const newLevel: Topsoccer.Level.LevelCreateData = {
      type: levelType,
      teams: selectedTeams,
    };

    if (onLevelSubmit) onLevelSubmit(newLevel);
  }
};

export default AddLevelButton;
