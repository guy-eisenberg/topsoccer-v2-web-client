"use client";

import ApplePayIcon from "@/app/components/common/icons/ApplePayIcon";
import BitIcon from "@/app/components/common/icons/BitIcon";
import CreditCardIcon from "@/app/components/common/icons/CreditCardIcon";
import GooglePayIcon from "@/app/components/common/icons/GooglePayIcon";
import { showLoading } from "@/app/components/common/Loader/Loader";
import PlayerAvatar from "@/app/components/common/PlayerAvatar";
import { Button } from "@/app/components/core/Button";
import { createClient } from "@/clients/supabase/client";
import useAsyncList from "@/hooks/useAsyncList";
import { useMounted } from "@/hooks/useMounted";
import type { Topsoccer } from "@/types";
import { prefix } from "@/utils/prefix";
import { splitDate } from "@/utils/splitDate";
import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { useEffect, useState } from "react";

interface TicketPaymentResult {
  id: string;
  display_name: string;
  photo_url: string | null;
  created_at: string;
  title: string;
  amount: number;
  price: number;
  method: Omit<Topsoccer.PaymentMethod, "Cash" | "Manual" | "Team" | "Wallet">;
  invoice_url: string;
  pool_size: number;
}

const PAGE_SIZE = 50;

const supabase = createClient();

export default function ManageTicketsPaymentsTab() {
  const mounted = useMounted();

  const [poolSize, setPoolSize] = useState(0);

  const {
    items: ticketsPayments,
    isLoading: loading,
    page,
    setPage,
  } = useAsyncList({
    async fetch({ page }) {
      const { data: tickets_payments } = (await supabase.rpc(
        "z2_get_tickets_payments",
        { _page: page, _page_size: PAGE_SIZE },
      )) as { data: TicketPaymentResult[] };

      return tickets_payments;
    },
  });

  useEffect(() => {
    if (mounted && loading) {
      const hideLoading = showLoading();

      return () => {
        hideLoading();
      };
    }
  }, [mounted, loading]);

  useEffect(() => {
    if (ticketsPayments.length > 0 && !loading) {
      setPoolSize(ticketsPayments[0].pool_size);
    } else {
      setPoolSize(0);
    }
  }, [ticketsPayments, loading]);

  const pageCount = Math.ceil(poolSize / PAGE_SIZE);

  return (
    <Table
      aria-label="Manage Tickets Payments Table"
      className="flex-1 !border-none"
      classNames={{
        base: "min-h-0",
        wrapper: "flex-1",
      }}
      bottomContent={
        pageCount > 1 && (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              color="primary"
              total={pageCount}
              page={page + 1}
              onChange={(page) => setPage(page - 1)}
            />
          </div>
        )
      }
      isStriped
      isHeaderSticky
    >
      <TableHeader>
        <TableColumn key="display_name" align="center">
          רוכש
        </TableColumn>
        <TableColumn key="created_at" align="center">
          תאריך רכישה
        </TableColumn>
        <TableColumn key="title" align="center">
          שם כרטיסייה
        </TableColumn>
        <TableColumn key="amount" align="center">
          ניקובים
        </TableColumn>
        <TableColumn key="price" align="center">
          מחיר
        </TableColumn>
        <TableColumn key="method" align="center">
          צורת תשלום
        </TableColumn>
        <TableColumn key="invoice_url" align="center">
          חשבונית
        </TableColumn>
      </TableHeader>
      <TableBody items={ticketsPayments}>
        {(ticket) => {
          const {
            day: create_day,
            month: create_month,
            year: create_year,
          } = splitDate(new Date(ticket.created_at));

          const paymentMethodIcon = (() => {
            switch (ticket.method) {
              case "Apple":
                return <ApplePayIcon />;
              case "Bit":
                return <BitIcon />;
              case "CreditCard":
                return <CreditCardIcon />;
              case "Google":
                return <GooglePayIcon />;
            }
          })();

          return (
            <TableRow key={ticket.id}>
              <TableCell textValue={ticket.display_name}>
                <div className="inline-flex items-center gap-2">
                  <PlayerAvatar
                    className="h-7 w-7 rounded-xl"
                    src={ticket.photo_url}
                  />
                  <p className="w-36">{ticket.display_name}</p>
                </div>
              </TableCell>
              <TableCell>
                {prefix(create_day)}.{prefix(create_month)}.{create_year - 2000}
              </TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>
                <div className="mx-auto h-8 w-8 rounded-xl border border-theme-green bg-theme-green/10 leading-[30px] text-theme-green">
                  <span>{ticket.amount}</span>
                </div>
              </TableCell>
              <TableCell>{ticket.price}₪</TableCell>
              <TableCell>{paymentMethodIcon}</TableCell>
              <TableCell>
                <a href={ticket.invoice_url} target="_blank">
                  <Button color="secondary" size="sm">
                    להורדת החשבונית
                  </Button>
                </a>
              </TableCell>
            </TableRow>
          );
        }}
      </TableBody>
    </Table>
  );
}
