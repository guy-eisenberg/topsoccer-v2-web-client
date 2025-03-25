"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import { useRouter } from "@/context/RouterContext";
import type { Topsoccer } from "@/types";
import toast from "@/utils/toast";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { updateVideos as _updateVideos } from "./actions";
import CommonActionButtons from "./components/CommonActionButtons";

export default function ManageEventVideosTab({
  event,
}: {
  event: Topsoccer.Event.Object;
}) {
  const router = useRouter();

  const [videos, setVideos] = useState(event.videos);
  const [bestMove, setBestMove] = useState(event.best_move || "");

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex flex-col gap-2">
        <p className="text-lg font-semibold">המהלך היפה:</p>
        <Input
          placeholder="קישור ליוטיוב"
          value={bestMove}
          onChange={(e) => setBestMove(e.target.value)}
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <p className="text-lg font-semibold">סרטונים:</p>
        <div className="flex h-full min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          {videos.map((_, i) => (
            <div className="flex flex-col gap-2 md:flex-row" key={i}>
              <Input
                className="flex-1"
                value={videos[i].description}
                placeholder="תיאור סרטון"
                onChange={(e) => {
                  const newVideos = [...videos];

                  newVideos[i].description = e.target.value;

                  setVideos(newVideos);

                  if (setVideos) setVideos(newVideos);
                }}
              />
              <Input
                className="flex-1"
                value={videos[i].url}
                placeholder="לינק לסרטון"
                onChange={(e) => {
                  const newVideos = [...videos];

                  newVideos[i].url = e.target.value;

                  setVideos(newVideos);

                  if (setVideos)
                    setVideos(newVideos.filter((video) => video.url !== ""));
                }}
              />
              <Button
                color="danger"
                onPress={() => {
                  const newVideos = [...videos];

                  newVideos.splice(i, 1);

                  setVideos(newVideos);
                }}
                isIconOnly
              >
                <IconTrash />
              </Button>
            </div>
          ))}
          <Button
            color="primary"
            onClick={() => setVideos([...videos, { url: "", description: "" }])}
            endContent={<IconPlus />}
          >
            <p>הוסף סרטון</p>
          </Button>
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <Button className="shrink-0" color="primary" onClick={updateVideos}>
          שמור סרטונים
        </Button>

        <CommonActionButtons event={event} />
      </div>
    </div>
  );

  async function updateVideos() {
    toast.loading("שומר סרטונים...");
    const hideLoading = showLoading();

    try {
      await _updateVideos({
        event_id: event.id,
        videos,
        best_move: bestMove ? bestMove : null,
      });

      await router.refresh();

      toast.success("סרטונים נשמרו בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }
}
