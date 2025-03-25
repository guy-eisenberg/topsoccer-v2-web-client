"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import CropImageModal from "@/app/components/common/modals/CropImageModal/CropImageModal";
import PlayerCard from "@/app/components/common/PlayerCard";
import { Button } from "@/app/components/core/Button";
import FileUploader from "@/app/components/core/FileUploader";
import Input from "@/app/components/core/Input";
import { createClient } from "@/clients/supabase/client";
import { useRouter } from "@/context/RouterContext";
import type { Topsoccer } from "@/types";
import { getBucketFileFromURL } from "@/utils/getBucketFileFromURL";
import toast from "@/utils/toast";
import Image from "next/image";
import { useMemo, useState } from "react";
import { updateBestPlayers as _updateBestPlayers } from "../actions";
import CommonActionButtons from "../components/CommonActionButtons";

export default function ManageEventBestPlayersTabContent({
  event,
  players,
}: {
  event: Topsoccer.Event.Object;
  players: (Topsoccer.User.UserInterface & {
    goals: number;
    assists: number;
    balls_outside: number;
    self_goal: number;
    penalty_saved: number;
    late: boolean;
    is_goalkeeper: boolean;
    group: Topsoccer.Group.Name | null;
  })[];
}) {
  const router = useRouter();

  const [cropImageModalOpen, setCropImageModalOpen] = useState(false);
  const [cropImagePlayer, setCropImagePlayer] = useState<
    "1" | "2" | undefined
  >();

  const [bestPlayer, setBestPlayer] = useState<{
    title?: string;
    user_id: string | undefined;
    image?: string | File | Blob;
  }>(event.best_player || { title: "", user_id: undefined, image: undefined });
  const [bestPlayer2, setBestPlayer2] = useState<{
    title?: string;
    user_id: string | undefined;
    image?: string | File | Blob;
  }>(
    event.best_player_2 || { title: "", user_id: undefined, image: undefined },
  );

  const player1 = useMemo(() => {
    if (!bestPlayer.user_id) return undefined;

    return players.find((p) => p.id === bestPlayer.user_id);
  }, [players, bestPlayer]);

  const player2 = useMemo(() => {
    if (!bestPlayer2.user_id) return undefined;

    return players.find((p) => p.id === bestPlayer2.user_id);
  }, [players, bestPlayer2]);

  const currentCropImage = (() => {
    if (cropImagePlayer === "1") {
      if (
        bestPlayer.image === undefined ||
        typeof bestPlayer.image === "string"
      )
        return null;
      return URL.createObjectURL(bestPlayer.image);
    } else if (cropImagePlayer === "2") {
      if (
        bestPlayer2.image === undefined ||
        typeof bestPlayer2.image === "string"
      )
        return null;

      return URL.createObjectURL(bestPlayer2.image);
    }

    return null;
  })();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex h-full min-h-0 flex-1 flex-col gap-2 md:flex-row">
        {bestPlayer.user_id && player1 ? (
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex gap-2">
              <PlayerCard
                className="flex-1 cursor-pointer"
                player={player1}
                group={player1.group}
                index={0}
                key={player1.id}
              />
              <Button
                color="danger"
                onPress={() =>
                  setBestPlayer({ ...bestPlayer, user_id: undefined })
                }
              >
                מחק
              </Button>
            </div>
            <Input
              placeholder="תיאור מלך השערים 1"
              value={bestPlayer.title}
              onChange={(e) => {
                const title = e.target.value;

                setBestPlayer({ ...bestPlayer, title });
              }}
            />
            <div className="flex items-center justify-between">
              <p className="text-lg">תמונה:</p>
              <Button
                color="danger"
                onPress={() => {
                  setBestPlayer({ ...bestPlayer, image: undefined });
                }}
                isDisabled={bestPlayer.image === undefined}
              >
                מחק תמונה
              </Button>
            </div>
            <div className="flex flex-1 flex-col">
              {!bestPlayer.image ? (
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
                    className="object-contain"
                    src={
                      bestPlayer.image instanceof File ||
                      bestPlayer.image instanceof Blob
                        ? URL.createObjectURL(bestPlayer.image)
                        : bestPlayer.image
                    }
                    fill
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex-1 overflow-y-auto">
            <p className="text-lg font-medium">בחר שחקן:</p>
            <div className="mt-4 flex flex-col gap-2">
              {players.map((player, i) => (
                <PlayerCard
                  className="cursor-pointer"
                  player={player}
                  group={player.group}
                  index={i}
                  key={player.id}
                  onClick={() => {
                    setBestPlayer({ ...bestPlayer, user_id: player.id });
                  }}
                />
              ))}
            </div>
          </div>
        )}
        {bestPlayer2.user_id && player2 ? (
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex gap-2">
              <PlayerCard
                className="flex-1 cursor-pointer"
                player={player2}
                group={player2.group}
                index={0}
                key={player2.id}
              />
              <Button
                color="danger"
                onPress={() =>
                  setBestPlayer2({ ...bestPlayer2, user_id: undefined })
                }
              >
                מחק
              </Button>
            </div>
            <Input
              placeholder="תיאור מלך השערים 1"
              value={bestPlayer2.title}
              onChange={(e) => {
                const title = e.target.value;

                setBestPlayer2({ ...bestPlayer2, title });
              }}
            />
            <div className="flex items-center justify-between">
              <p className="text-lg">תמונה:</p>
              <Button
                color="danger"
                onPress={() => {
                  setBestPlayer2({ ...bestPlayer2, image: undefined });
                }}
                isDisabled={bestPlayer2.image === undefined}
              >
                מחק תמונה
              </Button>
            </div>
            <div className="flex flex-1 flex-col">
              {!bestPlayer2.image ? (
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
                    className="object-contain"
                    src={
                      bestPlayer2.image instanceof File ||
                      bestPlayer2.image instanceof Blob
                        ? URL.createObjectURL(bestPlayer2.image)
                        : bestPlayer2.image
                    }
                    fill
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex-1 overflow-y-auto">
            <p className="text-lg font-medium">בחר שחקן:</p>
            <div className="mt-4 flex flex-col gap-2">
              {players.map((player, i) => (
                <PlayerCard
                  className="cursor-pointer"
                  player={player}
                  group={player.group}
                  index={i}
                  key={player.id}
                  onClick={() => {
                    setBestPlayer2({ ...bestPlayer2, user_id: player.id });
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <Button color="primary" onClick={updateBestPlayers}>
          שמירת מלכי השערים
        </Button>
        <CommonActionButtons event={event} />
      </div>

      {currentCropImage && (
        <CropImageModal
          aspect={2 / 1}
          src={currentCropImage}
          onSave={onImageCrop}
          isOpen={cropImageModalOpen}
          onOpenChange={setCropImageModalOpen}
        />
      )}
    </div>
  );

  async function updateBestPlayers() {
    toast.loading();
    const hideLoading = showLoading();

    try {
      const { best_player, best_player_2 } = await getObjects();

      await _updateBestPlayers({
        event_id: event.id,
        best_player,
        best_player_2,
      });

      await router.refresh();

      toast.success("מלכי השערים נשמרו בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }

    async function getObjects() {
      const supabase = createClient();

      const best_player: Topsoccer.Event.BestPlayer | null = bestPlayer.user_id
        ? {
            title: bestPlayer.title || undefined,
            user_id: bestPlayer.user_id,
            image: undefined,
          }
        : null;
      const best_player_2: Topsoccer.Event.BestPlayer | null =
        bestPlayer2.user_id
          ? {
              title: bestPlayer2.title || undefined,
              user_id: bestPlayer2.user_id,
              image: undefined,
            }
          : null;

      await Promise.all([
        deleteUneededExistingImages(),
        setNewBestPlayer(),
        setNewBestPlayer2(),
      ]);

      return { best_player, best_player_2 };

      async function deleteUneededExistingImages() {
        const imagesToDelete: string[] = [];

        if (event?.best_player?.image) {
          if (bestPlayer.image instanceof File) {
            imagesToDelete.push(event.best_player.image);
          } else if (bestPlayer.image === undefined) {
            imagesToDelete.push(event.best_player.image);
          }
        }

        if (event?.best_player_2?.image) {
          if (bestPlayer2.image instanceof File) {
            imagesToDelete.push(event.best_player_2.image);
          } else if (bestPlayer2.image === undefined) {
            imagesToDelete.push(event.best_player_2.image);
          }
        }

        if (imagesToDelete.length > 0)
          await supabase.storage
            .from("images")
            .remove(
              imagesToDelete.map((img) => getBucketFileFromURL("images", img)),
            );
      }

      async function setNewBestPlayer() {
        if (bestPlayer.user_id === undefined) return;

        let image: string | undefined;

        if (
          bestPlayer.image instanceof File ||
          bestPlayer.image instanceof Blob
        ) {
          const imageName = crypto.randomUUID();

          await supabase.storage
            .from("images")
            .upload(`events/${event.id}/${imageName}`, bestPlayer.image);

          const {
            data: { publicUrl },
          } = supabase.storage
            .from("images")
            .getPublicUrl(`events/${event.id}/${imageName}`);

          image = publicUrl;
        } else image = bestPlayer.image;

        if (best_player) best_player.image = image;
      }

      async function setNewBestPlayer2() {
        if (bestPlayer2.user_id === undefined) return;

        let image: string | undefined;

        if (
          bestPlayer2.image instanceof File ||
          bestPlayer2.image instanceof Blob
        ) {
          const imageName = crypto.randomUUID();

          await supabase.storage
            .from("images")
            .upload(`events/${event.id}/${imageName}`, bestPlayer2.image);

          const {
            data: { publicUrl },
          } = supabase.storage
            .from("images")
            .getPublicUrl(`events/${event.id}/${imageName}`);

          image = publicUrl;
        } else image = bestPlayer2.image;

        if (best_player_2) best_player_2.image = image;
      }
    }
  }

  function onImageUpload(files: File[], player: "1" | "2") {
    const imageFile = files[0];

    if (player === "1") {
      setBestPlayer({ ...bestPlayer, image: imageFile });
      setCropImagePlayer("1");
    } else if (player === "2") {
      setBestPlayer2({ ...bestPlayer2, image: imageFile });
      setCropImagePlayer("2");
    }

    setCropImageModalOpen(true);
  }

  function onImageCrop(data: { file: Blob; img: string }) {
    const { file } = data;

    if (cropImagePlayer === "1")
      setBestPlayer({ ...bestPlayer, image: file as File });
    else if (cropImagePlayer === "2")
      setBestPlayer2({ ...bestPlayer2, image: file as File });

    setCropImageModalOpen(false);
  }

  function onImageDelete() {}
}
