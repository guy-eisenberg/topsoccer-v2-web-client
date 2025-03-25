import type { Topsoccer } from "@/types";
import { Radio, type RadioProps } from "@heroui/radio";
import { useMemo } from "react";
import ApplePayIcon from "./icons/ApplePayIcon";
import BitIcon from "./icons/BitIcon";
import CashIcon from "./icons/CashIcon";
import CreditCardIcon from "./icons/CreditCardIcon";
import GooglePayIcon from "./icons/GooglePayIcon";
import TicketIcon from "./icons/TicketIcon";

export default function PaymentMethodRadio({
  method,
  user,
  ...rest
}: RadioProps & {
  method: Topsoccer.PaymentMethod;
  user?: Topsoccer.User.Auth;
}) {
  const { label, description, icon } = useMemo(() => {
    switch (method) {
      case "Apple":
        return {
          label: "אפל פיי",
          description: `שלם במהירות עם אפל פיי.`,
          icon: <ApplePayIcon />,
        };
      case "Bit":
        return {
          label: "ביט",
          description: `שלם במהירות עם ביט.`,
          icon: <BitIcon />,
        };
      case "Cash":
        return {
          label: "במזומן באירוע",
          description: "שלם במזומן באירוע.",
          icon: <CashIcon />,
        };
      case "CreditCard":
        return {
          label: "כרטיס אשראי",
          description: `שלם באמצעות כרטיס אשראי.`,
          icon: <CreditCardIcon />,
        };
      case "Google":
        return {
          label: "גוגל פיי",
          description: `שלם במהירות עם גוגל פיי.`,
          icon: <GooglePayIcon />,
        };
      case "Wallet":
        return {
          label: (
            <span className="flex gap-2">
              <span>ניקוב</span>
              {user && (
                <span className="rounded-lg bg-theme-green/10 px-2 text-[10px] text-theme-green">
                  {user.wallet} בחשבון
                </span>
              )}
            </span>
          ),
          description: "שלם באמצעות ניקוב אחד.",
          icon: <TicketIcon />,
        };
      default:
        return {
          label: "",
          description: "",
        };
    }
  }, [method, user]);

  return (
    <Radio
      {...rest}
      classNames={{
        base: "flex-row-reverse justify-between bg-theme-card max-w-[unset] border border-theme-light-gray rounded-xl m-0 data-[selected=true]:border-theme-green data-[selected=true]:bg-theme-green/5",
      }}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p>{label}</p>
          <p className="text-xs text-[#808080]">{description}</p>
        </div>
      </div>
    </Radio>
  );
}
