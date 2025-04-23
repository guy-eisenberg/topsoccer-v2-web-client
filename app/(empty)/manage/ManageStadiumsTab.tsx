"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import StadiumCard from "@/app/components/common/StadiumCard/StadiumCard";
import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import { useRouter } from "@/context/RouterContext";
import type { Topsoccer } from "@/types";
import toast from "@/utils/toast";
import Link from "next/link";
import { useMemo, useState } from "react";
import { deleteStadium as _deleteStadium } from "./actions";

export default function ManageStadiumsTab({
  stadiums,
}: {
  stadiums: Topsoccer.Stadium.FullStadium[];
}) {
  const router = useRouter();

  const [term, setTerm] = useState("");

  const filteredStadiums = useMemo(() => {
    return stadiums.filter((stadium) => stadium.name.match(term));
  }, [stadiums, term]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          className="flex-1"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="חפש לפי שם מגרש"
        />
        <Link href="/stadium/edit/new">
          <Button color="primary" className="whitespace-nowrap">
            צור מגרש
          </Button>
        </Link>
      </div>
      <div className="mt-2 grid min-h-0 gap-2 overflow-y-auto md:grid-cols-2">
        {filteredStadiums.map((stadium) => (
          <StadiumCard
            className="h-72"
            stadium={stadium}
            onStadiumDelete={() => deleteStadium(stadium.id)}
            key={stadium.id}
          />
        ))}
      </div>
    </>
  );

  async function deleteStadium(id: string) {
    toast.loading("מוחק מגרש...");
    const hideLoading = showLoading();

    try {
      await _deleteStadium({ stadium_id: id });

      await router.refresh();

      toast.success("מגרש נמחק בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }
}
