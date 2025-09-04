import { Contentful } from "@/clients/contentful";
import Image from "next/image";
import { Suspense } from "react";
import Skeleton from "../../core/Skeleton";
import WhatsappIcon from "../icons/WhatsappIcon";

export default function WhatsappGroupsCardSSR(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      className="flex flex-col gap-1 border-theme-light-gray bg-theme-green/10 p-2 pt-1 md:rounded-xl md:border"
    >
      <div className="flex items-center justify-center gap-1">
        <p className="text-sm font-semibold text-theme-green">קבוצות ווטסאפ</p>
        <WhatsappIcon className="h-3 w-3" />
      </div>
      <div className="flex w-full justify-between gap-2 overflow-x-auto scrollbar-hide md:bg-transparent md:px-0">
        <Suspense fallback={<_WhatsappGroupsCardLoading />}>
          <_WhatsappGroupsCardSSR />
        </Suspense>
      </div>
    </div>
  );
}

async function _WhatsappGroupsCardSSR() {
  const links = await fetchLinks();

  return (
    <>
      {links.map((link, i) => (
        <a
          className="relative flex min-w-[106px] flex-1 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl border border-transparent p-2 py-2 text-white hover:border-theme-green"
          href={link.url}
          key={i}
        >
          <div className="absolute h-full w-full brightness-50">
            <Image src="/images/soccer-field.jpeg" alt="whatsapp icon" fill />
          </div>
          <p className="relative whitespace-nowrap text-sm">{link.label}</p>
        </a>
      ))}
    </>
  );
}

async function _WhatsappGroupsCardLoading() {
  return (
    <>
      {new Array(6).fill(null).map((link, i) => (
        <Skeleton className="shrink-0 rounded-xl" key={i}>
          <div className="relative min-w-[106px] flex-1 shrink-0 overflow-hidden rounded-xl py-2">
            <p className="relative whitespace-nowrap text-sm">PLACEHOLDER</p>
          </div>
        </Skeleton>
      ))}
    </>
  );
}

async function fetchLinks() {
  const links = await Contentful.getWhatsappGroupLinks();

  return links;
}
