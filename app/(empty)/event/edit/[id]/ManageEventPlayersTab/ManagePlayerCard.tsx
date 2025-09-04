"use client";

import GroupIcon from "@/app/components/common/GroupIcon";
import CleanNetIcon from "@/app/components/common/icons/CleanNetIcon";
import GoalIcon from "@/app/components/common/icons/GoalIcon";
import PenaltyIcon from "@/app/components/common/icons/PenaltyIcon";
import PlayerAvatar from "@/app/components/common/PlayerAvatar";
import TeamAvatar from "@/app/components/common/TeamAvatar";
import { Button } from "@/app/components/core/Button";
import Checkbox from "@/app/components/core/Checkbox";
import type { Topsoccer } from "@/types";
import { COLORS } from "@/utils/constants";
import { isPast } from "@/utils/isPast";
import { memo } from "@/utils/memo";
import { cn, Tooltip } from "@heroui/react";
import React, { useState } from "react";
import CreateCashInvoiceModal from "../components/modals/CreateCashInvoiceModal";
import PlayerStatsModal from "../components/modals/PlayerStatsModal";
import PutInGroupModal from "../components/modals/PutInGroupModal";
import RefundPlayerModal from "../components/modals/RefundPlayerModal";
import RemovePlayerModal from "../components/modals/RemovePlayerModal";

interface ManagePlayerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  event: Topsoccer.Event.Object;
  player: Topsoccer.User.UserInterface & {
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
  };
  group: Topsoccer.Group.Name | null;
  team: Topsoccer.Team.FullTeam | null;
  selectMode: boolean;
  playerSelected: boolean;
  onPlayerSelectChange: (select: boolean) => void;
  removePlayer: () => Promise<void>;
  putPlayerInGroup: (group: Topsoccer.Group.Name) => Promise<void>;
  removePlayerFromGroup: () => Promise<void>;
  setStats: (stats: {
    goals: number;
    penalty_saved: number;
    clean_net: number;
    is_goalkeeper: boolean;
  }) => Promise<void>;
  refundPlayer: () => Promise<void>;
  createCashInvoice: () => Promise<void>;
}

function ManagePlayerCard({
  event,
  player: { payment, ...player },
  group,
  team,
  selectMode,
  playerSelected,
  onPlayerSelectChange,
  removePlayer,
  putPlayerInGroup,
  removePlayerFromGroup,
  setStats,
  refundPlayer,
  createCashInvoice,
  ...rest
}: ManagePlayerCardProps) {
  const [playerStatsModalOpen, setPlayerStatsModalOpen] = useState(false);
  const [putInGroupModalOpen, setPutInGroupModalOpen] = useState(false);
  const [createCashInvoiceModalOpen, setCreateCashInvoiceModalOpen] =
    useState(false);
  const [refundPlayerModalOpen, setRefundPlayerModalOpen] = useState(false);
  const [removePlayerModalOpen, setRemovePlayerModalOpen] = useState(false);

  const paymentStatusText = (() => {
    switch (payment.status) {
      case "Completed":
        if (payment.method === "Manual") return "תשלום ידני";
        if (payment.method === "Cash") return "תשלום מזומן";
        if (payment.method === "Wallet") return "תשלום בניקוב";
        if (
          payment.method === "Bit" ||
          payment.method === "CreditCard" ||
          payment.method === "Google" ||
          payment.method === "Apple"
        )
          return "שולם";
      case "Waiting":
        return "מחכה לתשלום";
      case "Canceled":
        if (payment.method === "Manual" || payment.method === "Cash")
          return "בוטל";
        if (
          payment.method === "Bit" ||
          payment.method === "CreditCard" ||
          payment.method === "Google" ||
          payment.method === "Apple"
        )
          return "קיבל זיכוי";
    }
  })();

  const paymentStatusColor = (() => {
    switch (payment.status) {
      case "Completed":
        if (payment.method === "Manual" || payment.method === "Cash")
          return COLORS["theme-gray"];

        if (
          payment.method === "Bit" ||
          payment.method === "CreditCard" ||
          payment.method === "Google" ||
          payment.method === "Apple" ||
          payment.method === "Wallet"
        )
          return COLORS["theme-green"];
      case "Waiting":
        return COLORS["theme-warning"];
      case "Canceled":
        if (payment.method === "Manual" || payment.method === "Cash")
          return COLORS["theme-gray"];
        if (
          payment.method === "Bit" ||
          payment.method === "CreditCard" ||
          payment.method === "Google" ||
          payment.method === "Apple"
        )
          return COLORS["theme-danger"];
    }
  })();

  const past = isPast(new Date(event.time).getTime());

  return (
    <div
      {...rest}
      className={cn(
        "relative flex flex-col items-center gap-1 rounded-xl border border-theme-light-gray bg-theme-card p-2",
        selectMode ? "cursor-pointer hover:border-theme-green" : "",
        playerSelected ? "!border-theme-green" : "",
        rest.className,
      )}
      onClick={() => {
        if (!selectMode) return;

        onPlayerSelectChange(!playerSelected);
      }}
    >
      {selectMode ? (
        <div className="absolute left-2 h-6 w-6">
          <Checkbox isSelected={playerSelected} />
        </div>
      ) : (
        <p
          className="absolute left-2 px-2 py-1 text-sm"
          style={{
            color: paymentStatusColor,
          }}
        >
          {paymentStatusText}
        </p>
      )}
      <div className="absolute right-3 flex flex-col items-start gap-1">
        <div className="flex gap-2">
          {group && <GroupIcon className="!h-7 !w-7" color={group} />}
          {team && (
            <TeamAvatar className="h-7 w-7 rounded-xl" src={team.photo_url} />
          )}
        </div>

        <div className="flex gap-2 font-medium text-theme-green">
          <div className="flex items-center gap-[3px]">
            <GoalIcon className="h-3 w-3" />
            <p className="text-xs leading-3">{player.goals}</p>
          </div>

          {player.is_goalkeeper && (
            <>
              <div className="flex items-center gap-[3px]">
                <PenaltyIcon className="h-3 w-3" />
                <p className="text-xs leading-3">{player.penalty_saved}</p>
              </div>
              <div className="flex items-center gap-[3px]">
                <CleanNetIcon className="h-3 w-3" />
                <p className="text-xs leading-3">{player.clean_net}</p>
              </div>
            </>
          )}
        </div>
      </div>
      <PlayerAvatar className="h-10 w-10 rounded-xl" src={player.photo_url} />
      <p>{player.display_name}</p>
      <div className="flex w-full gap-2 text-center text-xs">
        <Tooltip content={player.email} delay={500}>
          <p className="min-w-0 flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-xl border border-theme-light-gray bg-theme-light-gray/50 py-1">
            <span className="px-1">{player.email}</span>
          </p>
        </Tooltip>
        {player.phone_number && (
          <Tooltip content={player.phone_number} delay={500}>
            <p className="flex-1 rounded-xl border border-theme-light-gray bg-theme-light-gray/50 py-1">
              {player.phone_number}
            </p>
          </Tooltip>
        )}
      </div>

      {!selectMode && (
        <div className="grid w-full grid-cols-3 gap-2 md:grid-cols-2">
          {past && (
            <Button
              size="sm"
              color="secondary"
              onPress={() => setPlayerStatsModalOpen(true)}
            >
              סטטיסטיקות
            </Button>
          )}
          {payment.invoice_url ? (
            <Button
              size="sm"
              color="secondary"
              onPress={() => window.open(payment.invoice_url as string)}
            >
              הורד חשבונית
            </Button>
          ) : (
            payment.method === "Cash" && (
              <Button
                size="sm"
                color="secondary"
                onPress={() => setCreateCashInvoiceModalOpen(true)}
              >
                צור חשבונית
              </Button>
            )
          )}
          {event.sub_type === "Singles" && (
            <Button
              size="sm"
              color="secondary"
              onPress={() => setPutInGroupModalOpen(true)}
            >
              צרף לקבוצה
            </Button>
          )}
          {(((payment.method === "CreditCard" ||
            payment.method === "Bit" ||
            payment.method === "Google" ||
            payment.method === "Apple") &&
            (payment.grow || payment.payme || payment.verifone)) ||
            (payment.method === "Wallet" && payment.status === "Completed")) &&
            payment.status === "Completed" && (
              <Button
                size="sm"
                color="warning"
                onPress={() => setRefundPlayerModalOpen(true)}
              >
                {payment.method === "Wallet" ? "החזר ניקוב" : "החזר כספי"}
              </Button>
            )}
          <Button
            size="sm"
            color="danger"
            onPress={() => setRemovePlayerModalOpen(true)}
          >
            מחק
          </Button>
        </div>
      )}

      <RemovePlayerModal
        player={player}
        removePlayer={removePlayer}
        isOpen={removePlayerModalOpen}
        onOpenChange={setRemovePlayerModalOpen}
      />

      <PutInGroupModal
        putPlayerInGroup={putPlayerInGroup}
        removePlayerFromGroup={removePlayerFromGroup}
        isOpen={putInGroupModalOpen}
        onOpenChange={setPutInGroupModalOpen}
      />

      <PlayerStatsModal
        player={player}
        setStats={setStats}
        isOpen={playerStatsModalOpen}
        onOpenChange={setPlayerStatsModalOpen}
      />

      <RefundPlayerModal
        player={player}
        refundPlayer={refundPlayer}
        isOpen={refundPlayerModalOpen}
        onOpenChange={setRefundPlayerModalOpen}
      />

      <CreateCashInvoiceModal
        createCashInvoice={createCashInvoice}
        isOpen={createCashInvoiceModalOpen}
        onOpenChange={setCreateCashInvoiceModalOpen}
      />
    </div>
  );
}

export default memo(ManagePlayerCard, [
  "selectMode",
  "playerSelected",
  "player",
  "group",
  "team",
]);
