import PlayerAvatar from "@/app/components/common/PlayerAvatar";
import { Button } from "@/app/components/core/Button";
import type { Topsoccer } from "@/types";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { cn, Tooltip } from "@heroui/react";
import { useState } from "react";
import RefundPlayerModal from "../components/modals/RefundPlayerModal";

interface ManageCancelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  player: Topsoccer.User.UserInterface & {
    time: string;
    phone_number: string | null;
    payment: Topsoccer.Event.Payment;
  };
  refundPlayer: () => Promise<void>;
}

const ManageCancelCard: React.FC<ManageCancelCardProps> = ({
  player: { payment, ...player },
  refundPlayer,
  ...rest
}) => {
  const [refundPlayerModalOpen, setRefundPlayerModalOpen] = useState(false);

  const cancelDate = getFormattedDate(new Date(player.time).getTime() || 0);

  return (
    <div
      {...rest}
      className={cn(
        "relative flex flex-col items-center gap-1 rounded-xl border border-theme-light-gray bg-theme-card p-2",
        rest.className,
      )}
    >
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
      <p className="text-sm font-semibold">
        {cancelDate.hour}:{cancelDate.minute} {cancelDate.day}-
        {cancelDate.month}-{cancelDate.year}
      </p>
      <div className="flex gap-2">
        {(((payment?.method === "CreditCard" ||
          payment?.method === "Bit" ||
          payment?.method === "Google" ||
          payment?.method === "Apple") &&
          (payment.grow || payment.payme || payment.verifone)) ||
          (payment?.method === "Wallet" && payment.status === "Completed")) &&
          payment.status === "Completed" && (
            <Button
              size="sm"
              className="mt-2"
              color="warning"
              onPress={() => setRefundPlayerModalOpen(true)}
            >
              {payment.method === "Wallet" ? "החזר ניקוב" : "החזר כספי"}
            </Button>
          )}
        {payment?.invoice_url && (
          <Button
            size="sm"
            className="mt-2"
            color="secondary"
            onPress={() => window.open(payment.invoice_url as string)}
          >
            הורד קבלה
          </Button>
        )}
      </div>

      <RefundPlayerModal
        player={player}
        refundPlayer={refundPlayer}
        isOpen={refundPlayerModalOpen}
        onOpenChange={setRefundPlayerModalOpen}
      />
    </div>
  );
};

export default ManageCancelCard;
