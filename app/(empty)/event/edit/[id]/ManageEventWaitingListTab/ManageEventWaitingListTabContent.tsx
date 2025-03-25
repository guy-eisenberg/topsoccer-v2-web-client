"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import { createClient } from "@/clients/supabase/client";
import { useRouter } from "@/context/RouterContext";
import type { Topsoccer } from "@/types";
import toast from "@/utils/toast";
import { useState } from "react";
import CommonActionButtons from "../components/CommonActionButtons";
import ManagePlayerWaitingCard from "./ManagePlayerWaitingCard";
import {
  manualEnrollWaitingList as _manualEnrollWaitingList,
  removeWaitingPlayer as _removeWaitingPlayer,
} from "./actions";

export default function ManageEventWaitingListTabContent({
  event,
  players_waiting,
}: {
  event: Topsoccer.Event.Object;
  players_waiting: (Topsoccer.User.UserInterface & {
    phone_number: string | null;
  })[];
}) {
  const router = useRouter();

  const [playerEmailTerm, setPlayerEmailTerm] = useState("");

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <p className="text-lg font-semibold">רשימת המתנה:</p>
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
            onClick={manualEnrollWaitingList}
            isDisabled={playerEmailTerm.length === 0}
          >
            הוסף
          </Button>
        </div>
      </div>
      <div className="grid min-h-0 grid-cols-1 gap-2 overflow-y-auto md:grid-cols-4">
        {players_waiting.map((player) => (
          <ManagePlayerWaitingCard
            player={player}
            removePlayer={() => removePlayer(player.id)}
            key={player.id}
          />
        ))}
      </div>
      <div className="mt-auto flex justify-end">
        <CommonActionButtons event={event} />
      </div>
    </div>
  );

  async function manualEnrollWaitingList() {
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

      if (players_waiting.map((p) => p.id).includes(player.id)) {
        toast.warning("לא ניתן להוסיף שחקן יותר מפעם אחת.");
        return;
      }

      await _manualEnrollWaitingList({
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

  async function removePlayer(playerId: string) {
    toast.loading("מסיר...");
    const hideLoading = showLoading();

    try {
      await _removeWaitingPlayer({ event_id: event.id, player_id: playerId });

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
}
