import PlayerAvatar from "@/app/components/common/PlayerAvatar";
import { Button } from "@/app/components/core/Button";
import type { Topsoccer } from "@/types";
import { COLORS } from "@/utils/constants";
import { memo } from "@/utils/memo";
import { cn } from "@heroui/theme";
import { Tooltip } from "@heroui/tooltip";
import React, { useState } from "react";
import RefundPlayerModal from "../components/modals/RefundPlayerModal";
import RemovePlayerModal from "../components/modals/RemovePlayerModal";

interface ManageOTPlayerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  payment: Topsoccer.Event.OTPayment;
  removePlayer: () => Promise<void>;
  refundPlayer: () => Promise<void>;
}

function ManageOTPlayerCard({
  payment,
  removePlayer,
  refundPlayer,
  ...rest
}: ManageOTPlayerCardProps) {
  const [refundPlayerModalOpen, setRefundPlayerModalOpen] = useState(false);
  const [removePlayerModalOpen, setRemovePlayerModalOpen] = useState(false);

  const paymentStatusText = (() => {
    switch (payment?.status) {
      case "Completed":
        return "שולם";
      case "Waiting":
        return "מחכה לתשלום";
      case "Canceled":
        if (payment.refunded) return "קיבל זיכוי";

        return "בוטל";
    }
  })();

  const paymentStatusColor = (() => {
    switch (payment?.status) {
      case "Completed":
        return COLORS["theme-green"];
      case "Waiting":
        return COLORS["theme-warning"];
      case "Canceled":
        return COLORS["theme-danger"];
    }
  })();

  return (
    <div
      {...rest}
      className={cn(
        "relative flex flex-col items-center gap-1 rounded-xl border border-theme-light-gray bg-theme-card p-2",
        rest.className,
      )}
    >
      <div className="absolute left-2 px-2 py-1 text-left text-sm">
        <p
          style={{
            color: paymentStatusColor,
          }}
        >
          {paymentStatusText}
        </p>
        <p className="text-purple-600">חד פעמי</p>
      </div>

      <PlayerAvatar className="h-10 w-10 rounded-xl" src={undefined} />
      <p>{payment.full_name}</p>
      <div className="flex w-full gap-2 text-center text-xs">
        <Tooltip content={payment.email}>
          <p className="min-w-0 flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-xl border border-theme-light-gray bg-theme-light-gray/50 py-1">
            <span className="px-1">{payment.email}</span>
          </p>
        </Tooltip>
        <Tooltip content={payment.phone}>
          <p className="flex-1 rounded-xl border border-theme-light-gray bg-theme-light-gray/50 py-1">
            {payment.phone}
          </p>
        </Tooltip>
      </div>
      <div className="grid w-full grid-cols-3 gap-2 md:grid-cols-2">
        <Button
          size="sm"
          color="danger"
          onPress={() => setRemovePlayerModalOpen(true)}
        >
          בטל
        </Button>

        {payment?.invoice_url && (
          <Button
            size="sm"
            color="secondary"
            onPress={() => window.open(payment.invoice_url as string)}
          >
            הורד חשבונית
          </Button>
        )}

        {(((payment?.method === "CreditCard" ||
          payment?.method === "Bit" ||
          payment?.method === "Google" ||
          payment?.method === "Apple") &&
          payment.status === "Completed") ||
          (payment.status === "Canceled" && !payment.refunded)) &&
          (payment.grow || payment.verifone) && (
            <Button
              size="sm"
              color="warning"
              onPress={() => setRefundPlayerModalOpen(true)}
            >
              החזר כספי
            </Button>
          )}
      </div>

      <RemovePlayerModal
        player={{
          display_name: payment.full_name,
        }}
        removePlayer={removePlayer}
        isOpen={removePlayerModalOpen}
        onOpenChange={setRemovePlayerModalOpen}
      />

      <RefundPlayerModal
        player={{
          display_name: payment.full_name,
        }}
        refundPlayer={refundPlayer}
        isOpen={refundPlayerModalOpen}
        onOpenChange={setRefundPlayerModalOpen}
      />
    </div>
  );
}

export default memo(ManageOTPlayerCard, ["payment"]);
