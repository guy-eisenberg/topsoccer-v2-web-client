"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import { useRouter } from "@/context/RouterContext";
import type { Topsoccer } from "@/types";
import toast from "@/utils/toast";
import { refundPlayer as _refundPlayer } from "../actions";
import CommonActionButtons from "../components/CommonActionButtons";
import ManageCancelCard from "./ManageCancelCard";

export default function ManageEventCancelsTabContent({
  event,
  players_cancels,
}: {
  event: Topsoccer.Event.Object;
  players_cancels: (Topsoccer.User.UserInterface & {
    time: string;
    phone_number: string | null;
    payment: Topsoccer.Event.Payment;
  })[];
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="grid min-h-0 grid-cols-1 gap-2 overflow-y-auto md:grid-cols-4">
        {players_cancels.map((player) => (
          <ManageCancelCard
            player={player}
            key={player.id}
            refundPlayer={() => refundPlayer(player.id)}
          />
        ))}
      </div>
      <div className="mt-auto flex justify-end">
        <CommonActionButtons event={event} />
      </div>
    </div>
  );

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
}
