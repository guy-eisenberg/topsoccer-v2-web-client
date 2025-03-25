"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import { Button } from "@/app/components/core/Button";
import FileUploader from "@/app/components/core/FileUploader";
import Input from "@/app/components/core/Input";
import { createClient } from "@/clients/supabase/client";
import { useRouter } from "@/context/RouterContext";
import type { Topsoccer } from "@/types";
import { getBucketFileFromURL } from "@/utils/getBucketFileFromURL";
import toast from "@/utils/toast";
import Image from "next/image";
import { useState } from "react";
import { updateWinningTeams as _updateWinningTeams } from "./actions";
import CommonActionButtons from "./components/CommonActionButtons";

export default function ManageEventWinningTeamsTab({
  event,
}: {
  event: Topsoccer.Event.Object;
}) {
  const router = useRouter();

  const [winningTeam, setWinningTeam] = useState<{
    title: string;
    image: File | string | undefined;
  }>(event.winning_team || { title: "", image: undefined });
  const [winningTeam2, setWinningTeam2] = useState<{
    title: string;
    image: File | string | undefined;
  }>(event.winning_team_2 || { title: "", image: undefined });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex flex-1 flex-col gap-2 md:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          <Input
            placeholder="תיאור קבוצה מנצחת 1"
            value={winningTeam.title}
            onChange={(e) => {
              const title = e.target.value;

              setWinningTeam({ ...winningTeam, title });
            }}
          />
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">תמונה:</p>
            <Button
              color="danger"
              onPress={() => {
                setWinningTeam({ ...winningTeam, image: undefined });
              }}
              isDisabled={winningTeam.image === undefined}
            >
              מחק תמונה
            </Button>
          </div>
          <div className="flex flex-1 flex-col">
            {!winningTeam.image ? (
              <FileUploader
                className="flex-1"
                files={[]}
                onAdd={(files) => onImageUpload(files, "1")}
                onDelete={onImageDelete}
                label="העלה או זרוק תמונה"
              />
            ) : (
              <div className="relative flex-1 overflow-hidden rounded-xl">
                <Image
                  alt="Image Preview"
                  className="object-cover"
                  src={
                    winningTeam.image instanceof File
                      ? URL.createObjectURL(winningTeam.image)
                      : winningTeam.image
                  }
                  fill
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Input
            placeholder="תיאור קבוצה מנצחת 2"
            value={winningTeam2.title}
            onChange={(e) => {
              const title = e.target.value;

              setWinningTeam2({ ...winningTeam2, title });
            }}
          />
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">תמונה:</p>
            <Button
              color="danger"
              onPress={() => {
                setWinningTeam2({ ...winningTeam2, image: undefined });
              }}
              isDisabled={winningTeam2.image === undefined}
            >
              מחק תמונה
            </Button>
          </div>
          <div className="flex flex-1 flex-col">
            {!winningTeam2.image ? (
              <FileUploader
                className="flex-1"
                files={[]}
                onAdd={(files) => onImageUpload(files, "2")}
                onDelete={onImageDelete}
                label="העלה או זרוק תמונה"
              />
            ) : (
              <div className="relative flex-1 overflow-hidden rounded-xl">
                <Image
                  alt="Image Preview"
                  className="object-cover"
                  src={
                    winningTeam2.image instanceof File
                      ? URL.createObjectURL(winningTeam2.image)
                      : winningTeam2.image
                  }
                  fill
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <Button color="primary" onPress={updateWinningTeams}>
          שמור קבוצות מנצחות
        </Button>

        <CommonActionButtons event={event} />
      </div>
    </div>
  );

  async function updateWinningTeams() {
    toast.loading();
    const hideLoading = showLoading();

    try {
      const { winning_team, winning_team_2 } = await getObjects();

      await _updateWinningTeams({
        event_id: event.id,
        winning_team,
        winning_team_2,
      });

      await router.refresh();

      toast.success("קבוצות מנצחות נשמרו בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }

    async function getObjects() {
      const supabase = createClient();

      let winning_team: Topsoccer.Event.WinningTeam | null = null;
      let winning_team_2: Topsoccer.Event.WinningTeam | null = null;

      await Promise.all([
        deleteUneededExistingImages(),
        setNewWinningTeam(),
        setNewWinningTeam2(),
      ]);

      return { winning_team, winning_team_2 };

      async function deleteUneededExistingImages() {
        const imagesToDelete: string[] = [];

        if (event?.winning_team) {
          // If winning team image is being replaced by a new file:
          if (winningTeam.image instanceof File) {
            imagesToDelete.push(event.winning_team.image);
          }
          // If winning team exists but image deleted:
          else if (winningTeam.image === undefined) {
            imagesToDelete.push(event.winning_team.image);
          }
        }

        if (event?.winning_team_2) {
          if (winningTeam2.image instanceof File) {
            imagesToDelete.push(event.winning_team_2.image);
          } else if (winningTeam2.image === undefined) {
            imagesToDelete.push(event.winning_team_2.image);
          }
        }

        if (imagesToDelete.length > 0)
          await supabase.storage
            .from("images")
            .remove(
              imagesToDelete.map((img) => getBucketFileFromURL("images", img)),
            );
      }

      async function setNewWinningTeam() {
        if (winningTeam.image === undefined) return;

        let image: string;

        if (winningTeam.image instanceof File) {
          const imageName = crypto.randomUUID();

          await supabase.storage
            .from("images")
            .upload(`events/${event.id}/${imageName}`, winningTeam.image);

          const {
            data: { publicUrl },
          } = supabase.storage
            .from("images")
            .getPublicUrl(`events/${event.id}/${imageName}`);

          image = publicUrl;
        } else image = winningTeam.image;

        winning_team = { title: winningTeam.title, image };
      }

      async function setNewWinningTeam2() {
        if (winningTeam2.image === undefined) return;

        let image: string;

        if (winningTeam2.image instanceof File) {
          const imageName = crypto.randomUUID();

          await supabase.storage
            .from("images")
            .upload(
              `events/${event.fb_uid || event.id}/${imageName}`,
              winningTeam2.image,
            );

          const {
            data: { publicUrl },
          } = supabase.storage
            .from("images")
            .getPublicUrl(`events/${event.fb_uid || event.id}/${imageName}`);

          image = publicUrl;
        } else image = winningTeam2.image;

        winning_team_2 = { title: winningTeam2.title, image };
      }
    }
  }

  function onImageUpload(files: File[], team: "1" | "2") {
    const imageFile = files[0];

    if (team === "1") setWinningTeam({ ...winningTeam, image: imageFile });
    else if (team === "2")
      setWinningTeam2({ ...winningTeam2, image: imageFile });
  }

  function onImageDelete() {}
}
