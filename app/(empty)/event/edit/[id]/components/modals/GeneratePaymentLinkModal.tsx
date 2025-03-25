import { showLoading } from "@/app/components/common/Loader/Loader";
import PaymentMethodRadio from "@/app/components/common/PaymentMethodRadio";
import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import Textarea from "@/app/components/core/Textarea";
import type { Topsoccer } from "@/types";
import toast from "@/utils/toast";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  type ModalProps,
} from "@heroui/modal";
import { RadioGroup } from "@heroui/radio";
import Link from "next/link";
import { useState } from "react";
import { generatePaymentLink as _generatePaymentLink } from "../../actions";

export default function GeneratePaymentLinkModal({
  event,
  ...rest
}: Omit<ModalProps, "children"> & {
  event: Topsoccer.Event.Object;
}) {
  const [step, setStep] = useState(0);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [selectedMethod, setSelectedMethod] =
    useState<Topsoccer.PaymentMethod | null>(null);

  const [saleUrl, setSaleUrl] = useState("");

  const fullNameValid =
    fullName.split(" ").length >= 2 &&
    fullName.split(" ")[0].length >= 2 &&
    fullName.split(" ")[1].length >= 2;
  const phoneValid = phone.length === 10;
  const emailValid = email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

  const messageContents = `הלינק לתשלום לטופסוקר:\n ${saleUrl}`;

  const title = (() => {
    switch (step) {
      case 0:
        return "מלא את פרטי המשתמש";
      case 1:
        return "בחר צורת תשלום";
      case 2:
        return "העתק לינק לתשלום";
    }
  })();

  const methods: Topsoccer.PaymentMethod[] = [
    "CreditCard",
    "Bit",
    "Apple",
    "Google",
  ];

  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        <>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              {step === 0 && (
                <>
                  <Input
                    placeholder="שם מלא"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <Input
                    placeholder="מספר פלאפון"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Input
                    placeholder="אימייל"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    color="primary"
                    onPress={() => setStep(1)}
                    isDisabled={!fullNameValid || !phoneValid || !emailValid}
                  >
                    הבא
                  </Button>
                </>
              )}
              {step === 1 && (
                <>
                  <RadioGroup
                    value={selectedMethod}
                    onValueChange={(key) =>
                      setSelectedMethod(key as Topsoccer.PaymentMethod)
                    }
                  >
                    {methods.map((method) => (
                      <PaymentMethodRadio
                        value={method}
                        method={method}
                        key={method}
                      />
                    ))}
                  </RadioGroup>
                  <Button
                    color="primary"
                    onPress={() => {
                      if (!selectedMethod) return;

                      generatePaymentLink(selectedMethod);
                    }}
                    isDisabled={selectedMethod === null}
                  >
                    הבא
                  </Button>
                </>
              )}
              {step === 2 && (
                <>
                  <Textarea className="h-48" value={saleUrl} />
                  <Link
                    className="w-full"
                    href={`https://wa.me/972${phone}?text=${encodeURIComponent(messageContents)}`}
                  >
                    <Button color="primary" className="w-full">
                      שלח לווטסאפ
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );

  async function generatePaymentLink(paymentMethod: Topsoccer.PaymentMethod) {
    toast.loading("יוצר לינק לתשלום...");
    const hideLoading = showLoading();

    try {
      const saleUrl = await _generatePaymentLink({
        event_id: event.id,
        user_name: fullName,
        user_phone: phone,
        user_email: email,
        payment_method: paymentMethod,
      });

      setSaleUrl(saleUrl);
      setStep(2);

      toast.dismiss();
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }
}
