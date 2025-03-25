import { Button } from "@/app/components/core/Button";
import type { Topsoccer } from "@/types";
import isChromeAndroid from "@/utils/isChromeAndroid";
import isSafariAgent from "@/utils/isSafariAgent";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/modal";
import { RadioGroup } from "@heroui/radio";
import { useEffect, useMemo, useState } from "react";
import PaymentMethodRadio from "../PaymentMethodRadio";

export interface PaymentMethodModalProps extends Omit<ModalProps, "children"> {
  user: Topsoccer.User.Auth;
  enableCash?: boolean;
  enableWallet?: boolean;
  onMethodSelect: (method: Topsoccer.PaymentMethod) => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  user,
  enableCash = user.can_pay_cash,
  enableWallet = false,
  onMethodSelect,
  ...rest
}) => {
  const [selectedMethod, setSelectedMethod] =
    useState<Topsoccer.PaymentMethod | null>(null);

  const paymentMethods = useMemo(() => {
    const methods: Topsoccer.PaymentMethod[] = [];

    if (isSafariAgent()) {
      methods.push("Apple");
    }

    if (isChromeAndroid()) {
      methods.push("Google");
    }

    methods.push("Bit", "CreditCard");

    if (enableCash) methods.push("Cash");

    if (enableWallet) methods.push("Wallet");
    return methods;
  }, [enableCash, enableWallet]);

  useEffect(() => {
    setSelectedMethod(null);
  }, [rest.isOpen]);

  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        {(onClose) =>
          user.blocked ? (
            <ModalBody>
              <p className="text-danger">
                המשתמש שלך חסום, פנה למנהל לקבלת עזרה.
              </p>
            </ModalBody>
          ) : (
            <>
              <ModalHeader>בחר אמצעי תשלום</ModalHeader>
              <ModalBody>
                <RadioGroup
                  value={selectedMethod}
                  onValueChange={(key) =>
                    setSelectedMethod(key as Topsoccer.PaymentMethod)
                  }
                >
                  {paymentMethods.map((method) => (
                    <PaymentMethodRadio
                      value={method}
                      method={method}
                      key={method}
                    />
                  ))}
                </RadioGroup>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" type="button" onPress={onClose}>
                  סגור
                </Button>
                <Button
                  color="primary"
                  isDisabled={selectedMethod === null}
                  onPress={() => onMethodSelect(selectedMethod!)}
                >
                  המשך
                </Button>
              </ModalFooter>
            </>
          )
        }
      </ModalContent>
    </Modal>
  );
};

export default PaymentMethodModal;
