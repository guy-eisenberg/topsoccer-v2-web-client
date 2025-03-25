"use client";

import GroupIcon from "@/app/components/common/GroupIcon";
import { showLoading } from "@/app/components/common/Loader/Loader";
import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import { createClient } from "@/clients/supabase/client";
import { useRouter } from "@/context/RouterContext";
import type { Topsoccer } from "@/types";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { isPast } from "@/utils/isPast";
import toast from "@/utils/toast";
import { useCallback, useMemo, useState } from "react";
import { refundPlayer as _refundPlayer } from "../actions";
import CommonActionButtons from "../components/CommonActionButtons";
import GroupsWhatsappTemplateModal from "../components/modals/GroupsWhatsappTemplateModal";
import GroupWinsModal from "../components/modals/GroupWinsModal";
import PutInGroupModal from "../components/modals/PutInGroupModal";
import ResetGroupsModal from "../components/modals/ResetGroupsModal";
import {
  createCashInvoice as _createCashInvoice,
  manualEnroll as _manualEnroll,
  putPlayersInGroup as _putPlayersInGroup,
  removeOTPlayer as _removeOTPlayer,
  removePlayer as _removePlayer,
  removePlayersFromGroup as _removePlayersFromGroup,
  resetEventGroups as _resetEventGroups,
  revealGroups as _revealGroups,
  setGroupWins as _setGroupWins,
  setStats as _setStats,
} from "./actions";
import ManageOTPlayerCard from "./ManageOTPlayerCard";
import ManagePlayerCard from "./ManagePlayerCard";

export default function ManageEventPlayersTabContent({
  event,
  groups,
  players,
  ot_players,
}: {
  event: Topsoccer.Event.Object;
  groups: (Topsoccer.Group.FullGroup & {
    players: Topsoccer.User.UserInterface[];
  })[];
  players: (Topsoccer.User.UserInterface & {
    phone_number: string | null;
    goals: number;
    assists: number;
    balls_outside: number;
    self_goal: number;
    penalty_saved: number;
    clean_net: number;
    late: boolean;
    is_goalkeeper: boolean;
    group: Topsoccer.Group.Name | null;
    team: Topsoccer.Team.FullTeam | null;
    payment: Topsoccer.Event.Payment;
  })[];
  ot_players: Topsoccer.Event.OTPayment[];
}) {
  const router = useRouter();

  const [selectedGroup, setSelectedGroup] =
    useState<Topsoccer.Group.FullGroup | null>(null);

  const [groupWinsModalOpen, setGroupWinsModalOpen] = useState(false);
  const [putInGroupModalOpen, setPutInGroupModalOpen] = useState(false);
  const [resetGroupsModalOpen, setResetGroupsModalOpen] = useState(false);
  const [groupsWhatsappTemplateModalOpen, setGroupsWhatsappTemplateModalOpen] =
    useState(false);

  const [selectMode, setSelectMode] = useState(false);
  const [selectedPlayersIds, setSelectedPlayersIds] = useState<{
    [key: string]: boolean;
  }>({});

  const [playerEmailTerm, setPlayerEmailTerm] = useState("");

  const sortedPlayers = useMemo(() => {
    if (event.sub_type === "Singles")
      return players.sort((player1, player2) =>
        (player2.group || "").localeCompare(player1.group || ""),
      );
    else if (event.sub_type === "Teams")
      return players.sort((player1, player2) =>
        (player2.team?.name || "").localeCompare(player1.team?.name || ""),
      );

    return players;
  }, [players, event.sub_type]);

  const noGroupsWhatsappTemplate = useMemo(() => {
    let str = "";

    players.forEach((player, i) => {
      if (i > 0) str += "\n";

      str += `${i + 1}. ${player.display_name}`;
    });

    return str;
  }, [players]);

  const groupsWhatsappTemplate = useMemo(() => {
    const dayOfWeek = [
      "ראשון",
      "שני",
      "שלישי",
      "רביעי",
      "חמישי",
      "שישי",
      "שבת",
    ][new Date(event.time).getDay()];
    const { month, day, year, hour, minute } = getFormattedDate(
      new Date(event.time).getTime(),
    );

    let str = `חלוקת כוחות ליום ${dayOfWeek}
תאריך: ${day}.${month}.${year}
שעה: ${hour}:${minute}

`;

    const groupsEmojis: { [key: string]: string } = {
      Orange: "🟠",
      Green: "🟢",
      Yellow: "🟡",
      Pink: "🟣",
      Red: "🔴",
      Blue: "🔵",
      White: "⚪️",
      Black: "⚫️",
    };

    const groupsNames: { [key: string]: string } = {
      Orange: "כתומים",
      Green: "ירוקים",
      Yellow: "צהובים",
      Pink: "סגולים",
      Red: "אדומים",
      Blue: "כחולים",
      White: "לבנים",
      Black: "שחורים",
    };

    groups.map((group, i) => {
      const name = groupsNames[group.name];
      const emoji = groupsEmojis[group.name];

      const players = sortedPlayers.filter(
        (player) => player.group === group.name,
      );

      str += `קבוצה מספר ${i + 1}: ${name} ${emoji}
`;

      players?.map((player, j) => {
        str += `${emoji} ${player.display_name}`;

        if (i < groups.length - 1 || j < players.length - 1)
          str += `
`;
      });

      if (i < groups.length - 1)
        str += `
`;
    });

    return str;
  }, [groups, event.time, sortedPlayers]);

  const putPlayersInGroup = useCallback(
    async (players: string[], group: Topsoccer.Group.Name) => {
      toast.loading("שומר...");
      const hideLoading = showLoading();

      try {
        await _putPlayersInGroup({
          event_id: event.id,
          group: group,
          players,
        });

        await router.refresh();

        toast.success("שינויים נשמרו בהצלחה!");

        setSelectedPlayersIds({});
        setSelectMode(false);
      } catch (err) {
        console.log(err);
        toast.error();

        return Promise.reject(err);
      } finally {
        hideLoading();
      }
    },
    [router, event.id],
  );

  const removePlayersFromGroup = useCallback(
    async (players: string[]) => {
      toast.loading("שומר...");
      const hideLoading = showLoading();

      try {
        await _removePlayersFromGroup({
          event_id: event.id,
          players,
        });

        await router.refresh();

        toast.success("שינויים נשמרו בהצלחה!");

        setSelectedPlayersIds({});
        setSelectMode(false);
      } catch (err) {
        console.log(err);
        toast.error();

        return Promise.reject(err);
      } finally {
        hideLoading();
      }
    },
    [router, event.id],
  );

  const playersList = useMemo(() => {
    return (
      <>
        {sortedPlayers.map((player) => (
          <ManagePlayerCard
            className="col-span-1"
            event={event}
            player={player}
            group={player.group}
            team={player.team}
            playerSelected={selectedPlayersIds[player.id]}
            selectMode={selectMode}
            onPlayerSelectChange={(select) => {
              setSelectedPlayersIds((selectedPlayersIds) => {
                const newSelectedPlayersIds = { ...selectedPlayersIds };

                if (select) newSelectedPlayersIds[player.id] = true;
                else delete newSelectedPlayersIds[player.id];

                return newSelectedPlayersIds;
              });
            }}
            removePlayer={() => removePlayer(player.id)}
            putPlayerInGroup={(group) => putPlayersInGroup([player.id], group)}
            removePlayerFromGroup={() => removePlayersFromGroup([player.id])}
            setStats={(stats) => setStats(player.id, stats)}
            refundPlayer={() => refundPlayer(player.id)}
            createCashInvoice={() => createCashInvoice(player.id)}
            key={player.id}
          />
        ))}
        {ot_players.map((player) => (
          <ManageOTPlayerCard
            payment={player}
            removePlayer={() => removeOTPlayer(player.id)}
            refundPlayer={() => refundPlayer(player.id)}
            key={player.id}
          />
        ))}
      </>
    );

    async function removePlayer(playerId: string) {
      toast.loading("מסיר שחקן...");
      const hideLoading = showLoading();

      try {
        await _removePlayer({ event_id: event.id, player_id: playerId });

        await router.refresh();

        toast.success("שחקן הוסר בהצלחה!");
      } catch (err) {
        console.log(err);
        toast.error();

        return Promise.reject(err);
      } finally {
        hideLoading();
      }
    }

    async function removeOTPlayer(paymentId: string) {
      toast.loading("מבטל הרשמה חד פעמית...");
      const hideLoading = showLoading();

      try {
        await _removeOTPlayer({ event_id: event.id, payment_id: paymentId });

        await router.refresh();

        toast.success("הרשמה חד פעמית בוטלה בהצלחה!");
      } catch (err) {
        console.log(err);
        toast.error();

        return Promise.reject(err);
      } finally {
        hideLoading();
      }
    }

    async function setStats(
      playerId: string,
      {
        goals,
        penalty_saved,
        clean_net,
        is_goalkeeper,
      }: {
        goals: number;
        penalty_saved: number;
        clean_net: number;
        is_goalkeeper: boolean;
      },
    ) {
      toast.loading("שומר...");
      const hideLoading = showLoading();

      try {
        await _setStats({
          event_id: event.id,
          player_id: playerId,
          goals,
          penalty_saved,
          clean_net,
          is_goalkeeper,
        });

        await router.refresh();

        toast.success("סטטיסטיקות נשמרו בהצלחה!");
      } catch (err) {
        console.log(err);
        toast.error();

        return Promise.reject(err);
      } finally {
        hideLoading();
      }
    }

    async function refundPlayer(playerId: string) {
      toast.loading("מבצע החזר...");
      const hideLoading = showLoading();

      try {
        await _refundPlayer({
          event_id: event.id,
          player_id: playerId,
          payment_id: null,
        });

        await router.refresh();

        toast.success("החזר בוצע בהצלחה!");
      } catch (err) {
        console.log(err);
        toast.error();

        return Promise.reject(err);
      } finally {
        hideLoading();
      }
    }

    async function createCashInvoice(playerId: string) {
      toast.loading("יוצר חשבונית...");
      const hideLoading = showLoading();

      try {
        await _createCashInvoice({
          event_id: event.id,
          player_id: playerId,
        });

        await router.refresh();

        toast.success("חשבונית נוצרה בהצלחה!");
      } catch (err) {
        console.log(err);
        toast.error();

        return Promise.reject(err);
      } finally {
        hideLoading();
      }
    }
  }, [
    router,
    event,
    sortedPlayers,
    ot_players,
    selectMode,
    selectedPlayersIds,
    putPlayersInGroup,
    removePlayersFromGroup,
  ]);

  const past = isPast(new Date(event.time).getTime());

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <p className="text-lg font-semibold">משתתפים:</p>
        <div className="flex flex-1 items-center gap-4">
          <Input
            className="flex-1"
            placeholder="הוסף לפי אימייל"
            value={playerEmailTerm}
            onChange={(e) => setPlayerEmailTerm(e.target.value)}
            type="email"
          />
          <Button
            color="primary"
            onPress={manualEnroll}
            isDisabled={playerEmailTerm.length === 0}
          >
            הוסף
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between md:justify-start">
        <div className="flex flex-wrap gap-2">
          <Button
            color="primary"
            onPress={() => setGroupsWhatsappTemplateModalOpen(true)}
          >
            העתק לווטסאפ
          </Button>
          {groups.length > 0 && (
            <Button
              color="warning"
              onPress={() => setResetGroupsModalOpen(true)}
            >
              אפס קבוצות
            </Button>
          )}
          {!past && (
            <Button
              color="primary"
              onPress={() => revealGroups(!event.reveal_groups)}
            >
              {event.reveal_groups ? "הסתר כוחות" : "הצג כוחות"}
            </Button>
          )}
        </div>
        <div className="flex max-w-full gap-3 overflow-x-auto px-2 scrollbar-hide">
          {groups.map((group) => (
            <div className="flex shrink-0 flex-col gap-2" key={group.name}>
              <div className="flex items-center gap-2">
                <GroupIcon className="!h-6 !w-6" color={group.name} />
                <p>{group.players ? group.players.length : 0} שחקנים</p>
              </div>

              {past && (
                <>
                  <p className="text-sm text-theme-gray">
                    {group.wins || 0} נצחונות
                  </p>
                  <Button
                    color="secondary"
                    onPress={() => {
                      setSelectedGroup(group);
                      setGroupWinsModalOpen(true);
                    }}
                  >
                    הכנס נצחונות
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="mr-auto flex gap-4">
          {selectMode && Object.keys(selectedPlayersIds).length > 0 && (
            <Button
              color="primary"
              onPress={() => setPutInGroupModalOpen(true)}
            >
              צרף לקבוצה
            </Button>
          )}

          <Button
            color={selectMode ? "secondary" : "primary"}
            onPress={() => {
              setSelectMode(!selectMode);
              setSelectedPlayersIds({});
            }}
          >
            {selectMode ? "בטל בחירה מרובה" : "בחירה מרובה"}
          </Button>
        </div>
      </div>
      <div className="grid min-h-0 grid-cols-1 gap-2 overflow-y-auto scrollbar-hide md:grid-cols-4">
        {playersList}
      </div>
      <div className="mt-auto flex justify-end">
        <CommonActionButtons event={event} />
      </div>

      {selectedGroup && (
        <GroupWinsModal
          group={selectedGroup}
          setWins={(wins) => setGroupWins(wins)}
          isOpen={groupWinsModalOpen}
          onOpenChange={setGroupWinsModalOpen}
          key={`group-wins-modal-${selectedGroup.id}`}
        />
      )}

      <PutInGroupModal
        putPlayerInGroup={(groupName) =>
          putPlayersInGroup(Object.keys(selectedPlayersIds), groupName)
        }
        removePlayerFromGroup={() =>
          removePlayersFromGroup(Object.keys(selectedPlayersIds))
        }
        isOpen={putInGroupModalOpen}
        onOpenChange={setPutInGroupModalOpen}
      />

      <GroupsWhatsappTemplateModal
        text={
          groups.length > 0 ? groupsWhatsappTemplate : noGroupsWhatsappTemplate
        }
        isOpen={groupsWhatsappTemplateModalOpen}
        onOpenChange={setGroupsWhatsappTemplateModalOpen}
      />

      <ResetGroupsModal
        resetGroups={resetEventGroups}
        isOpen={resetGroupsModalOpen}
        onOpenChange={setResetGroupsModalOpen}
      />
    </div>
  );

  async function manualEnroll() {
    toast.loading("מוסיף שחקן...");
    const hideLoading = showLoading();

    const supabase = createClient();

    try {
      const { data: player, error } = await supabase
        .rpc("z2_get_user_by_email", {
          _email_term: playerEmailTerm,
        })
        .single<{
          id: string;
          created_at: string;
          display_name: string;
          email: string;
          photo_url: string | null;
          last_seen: string | null;
        }>();

      if (error) throw error;

      if (!player) {
        toast.error("משתמש לא נמצא.");
        return;
      }

      if (players.map((p) => p.id).includes(player.id)) {
        toast.warning("לא ניתן להוסיף שחקן יותר מפעם אחת.");
        return;
      }

      await _manualEnroll({
        event_id: event.id,
        player_id: player.id,
      });

      await router.refresh();

      toast.success("שחקן נוסף בהצלחה!");

      setPlayerEmailTerm("");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }

  async function revealGroups(revealGroups: boolean) {
    toast.loading();
    const hideLoading = showLoading();

    try {
      await _revealGroups({ event_id: event.id, reveal_groups: revealGroups });

      await router.refresh();

      toast.success(
        revealGroups ? "הקבוצות כעת מוצגות 🤩" : "הקבוצות כעת מוסתרות 🤫",
      );
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }

  async function setGroupWins(wins: number) {
    if (!selectedGroup) return;

    toast.loading("שומר...");
    const hideLoading = showLoading();

    try {
      await _setGroupWins({
        event_id: event.id,
        group_id: selectedGroup.id,
        wins,
      });

      await router.refresh();

      toast.success("שינויים נשמרו בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }

  async function resetEventGroups() {
    toast.loading("מאפס קבוצות...");
    const hideLoading = showLoading();

    try {
      await _resetEventGroups({
        event_id: event.id,
      });

      await router.refresh();

      toast.success("קבוצות אופסו בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }
}
