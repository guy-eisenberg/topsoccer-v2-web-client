import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import { Select } from "@/app/components/core/Select";
import { SelectItem } from "@/app/components/core/SelectItem";
import type { Topsoccer } from "@/types";
import {
  cn,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/react";
import { useEffect, useState } from "react";

interface PlayerStatsModalProps extends Omit<ModalProps, "children"> {
  player: Topsoccer.User.UserInterface & Topsoccer.Event.Stats;
  setStats: (data: {
    goals: number;
    penalty_saved: number;
    clean_net: number;
    is_goalkeeper: boolean;
  }) => Promise<void>;
}

const PlayerStatsModal: React.FC<PlayerStatsModalProps> = ({
  player,
  setStats,
  ...rest
}) => {
  const [goals, setGoals] = useState(player.goals);
  const [penaltySaved, setPenaltySaved] = useState(player.penalty_saved);
  const [cleanNet, setCleanNet] = useState(player.clean_net);
  const [isGoalkeeper, setIsGoalkeeper] = useState(player.is_goalkeeper);

  useEffect(() => {
    if (!isGoalkeeper) {
      setPenaltySaved(0);
      setCleanNet(0);
    }
  }, [isGoalkeeper]);

  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>סטטיסטיקות</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <p>גולים:</p>
                  <Input
                    className="w-24"
                    type="number"
                    min={0}
                    value={goals === 0 ? "" : goals.toString()}
                    onChange={(e) => setGoals(parseInt(e.target.value))}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-1 items-center gap-2">
                    <p className="whitespace-nowrap">האם שוער:</p>
                    <Select
                      selectedKeys={[isGoalkeeper ? "yes" : "no"]}
                      onChange={(e) => {
                        const option = e.target.value;

                        if (option === "yes") setIsGoalkeeper(true);
                        else setIsGoalkeeper(false);
                      }}
                    >
                      <SelectItem key="yes">כן</SelectItem>
                      <SelectItem key="no">לא</SelectItem>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <div
                      className={cn(
                        "flex flex-1 items-center gap-2",
                        !isGoalkeeper && "opacity-20",
                      )}
                    >
                      <p>הציל פנדלים:</p>
                      <Input
                        className="flex-1"
                        type="number"
                        min={0}
                        value={
                          penaltySaved === 0 ? "" : penaltySaved.toString()
                        }
                        disabled={!isGoalkeeper}
                        onChange={(e) =>
                          setPenaltySaved(parseInt(e.target.value))
                        }
                      />
                    </div>
                    <div
                      className={cn(
                        "flex flex-1 items-center gap-2",
                        !isGoalkeeper && "opacity-20",
                      )}
                    >
                      <p>רשת נקייה:</p>
                      <Input
                        className="flex-1"
                        type="number"
                        min={0}
                        value={cleanNet === 0 ? "" : cleanNet.toString()}
                        disabled={!isGoalkeeper}
                        onChange={(e) => setCleanNet(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onPress={onClose}>
                ביטול
              </Button>
              <Button
                color="primary"
                isDisabled={goals < 0}
                onPress={async () => {
                  await setStats({
                    goals,
                    penalty_saved: penaltySaved,
                    is_goalkeeper: isGoalkeeper,
                    clean_net: cleanNet,
                  });

                  onClose();
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

export default PlayerStatsModal;
