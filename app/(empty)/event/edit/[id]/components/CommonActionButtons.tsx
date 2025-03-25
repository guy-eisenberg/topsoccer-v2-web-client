"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import { Button } from "@/app/components/core/Button";
import { useRouter } from "@/context/RouterContext";
import type { Topsoccer } from "@/types";
import toast from "@/utils/toast";
import { IconShare3 } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import {
  duplicateEvent as _duplicateEvent,
  setEventCanceled as _setEventCanceled,
  setEventFull as _setEventFull,
} from "../actions";
import GeneratePaymentLinkModal from "./modals/GeneratePaymentLinkModal";

export default function CommonActionButtons({
  event,
}: {
  event: Topsoccer.Event.Object;
}) {
  const router = useRouter();

  const [generatePaymentLinkModalOpen, setGeneratePaymentLinkModalOpen] =
    useState(false);

  return (
    <>
      <div className="flex gap-2">
        <Link href={`/event/${event.id}`}>
          <Button color="secondary" endContent={<IconShare3 />}>
            לדף המשחק
          </Button>
        </Link>
        <Button
          color="primary"
          onPress={() => setGeneratePaymentLinkModalOpen(true)}
        >
          צור לינק לתשלום
        </Button>
        <Button color="warning" onPress={setEventFull}>
          {event.full ? "פתח רשימה" : "סגור רשימה"}
        </Button>
        <Button color="secondary" onPress={duplicateEvent}>
          שכפל משחק
        </Button>
        <Button
          color={event.canceled ? "secondary" : "danger"}
          onPress={setEventCanceled}
        >
          {event.canceled ? "שחזר משחק" : "בטל משחק"}
        </Button>
      </div>
      <GeneratePaymentLinkModal
        event={event}
        isOpen={generatePaymentLinkModalOpen}
        onOpenChange={setGeneratePaymentLinkModalOpen}
      />
    </>
  );

  async function setEventFull() {
    const full = !event.full;

    toast.loading(full ? "סוגר רשימה..." : "פותח רשימה...");
    const hideLoading = showLoading();

    try {
      await _setEventFull({ event_id: event.id, full });

      await router.refresh();

      toast.success(full ? "הרשימה כעת סגורה!" : "הרשימה כעת פתוחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }

  async function duplicateEvent() {
    toast.loading("משכפל משחק...");
    const hideLoading = showLoading();

    try {
      const eventId = await _duplicateEvent({ id: event.id });

      await router.replace(`/event/edit/${eventId}`);

      toast.success("אירוע שוכפל בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }

  async function setEventCanceled() {
    const canceled = !event.canceled;

    toast.loading(canceled ? "מבטל אירוע" : "משחזר אירוע");
    const hideLoading = showLoading();

    try {
      await _setEventCanceled({ event_id: event.id, canceled });

      await router.refresh();

      toast.success(canceled ? "אירוע בוטל בהצלחה!" : "אירוע שוחזר בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }
}
