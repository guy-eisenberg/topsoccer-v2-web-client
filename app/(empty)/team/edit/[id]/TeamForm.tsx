"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import CropImageModal from "@/app/components/common/modals/CropImageModal/CropImageModal";
import PlayerCard from "@/app/components/common/PlayerCard";
import TeamAvatar from "@/app/components/common/TeamAvatar";
import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import { createClient } from "@/clients/supabase/client";
import type { Topsoccer } from "@/types";
import toast from "@/utils/toast";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useReducer, useRef, useState } from "react";
import {
  deletePhoto as _deletePhoto,
  upsertTeam as _upsertTeam,
} from "./actions";

interface Team {
  id: string;
  name: string;
  photo_url: string | null;
  players: Topsoccer.User.UserInterface[];
  admins: Topsoccer.User.UserInterface[];
}

export default function TeamForm({
  user,
  team,
}: {
  user: Topsoccer.User.Auth;
  team: Team | null;
}) {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentFile = useRef<File | Blob | undefined>(undefined);

  const [cropImageModalOpen, setCropImageModalOpen] = useState(false);

  const [name, setName] = useState(team?.name || "");
  const [photoURL, setPhotoURL] = useState<string | null>(
    team?.photo_url || null,
  );
  const [playerEmailTerm, setPlayerEmailTerm] = useState("");
  const [adminEmailTerm, setAdminEmailTerm] = useState("");

  const [players, setPlayers] = useReducer(
    (_, payload: Topsoccer.User.UserInterface[]) => {
      if (payload.length === 0 || payload[0].id === user.id) return payload;

      return payload.sort((a, b) =>
        a.id === user.id ? -1 : b.id === user.id ? 1 : 0,
      );
    },
    team ? team.players : [],
  );
  const [admins, setAdmins] = useState(team ? team.admins : []);

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={(e) => {
        e.preventDefault();

        upsertTeam();
      }}
    >
      <div className="mb-6 space-y-2">
        {team ? (
          <p className="text-2xl font-semibold">{team.name}</p>
        ) : (
          <>
            <p className="text-2xl font-semibold">צור קבוצה חדשה</p>
            <p className="text-theme-gray">
              על מנת ליצור קבוצה, עלייך למלא את כלל הפרטים הבאים:
            </p>
          </>
        )}
      </div>
      <div className="mb-6 flex items-center gap-4">
        <TeamAvatar
          className="h-24 w-24 rounded-xl object-contain"
          src={photoURL}
        />

        <div className="flex flex-col space-y-2">
          <input
            accept="image/*"
            type="file"
            name="avatar"
            id="avatar-input"
            onChange={onImageUpload}
            ref={fileInputRef}
            hidden
          />
          <Button
            color="primary"
            type="button"
            onPress={() => {
              if (fileInputRef.current) fileInputRef.current.click();
            }}
          >
            שנה תמונה
          </Button>
          <Button
            color="secondary"
            type="button"
            isDisabled={photoURL === null}
            onPress={() => {
              deletePhoto();
            }}
          >
            מחק תמונה
          </Button>
        </div>
      </div>
      <div className="mb-6 w-full">
        <Input
          className="w-full"
          placeholder="שם קבוצה"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-6 flex min-h-0 flex-col rounded-xl border border-theme-light-gray bg-theme-card px-6 py-4 scrollbar-hide">
        <p className="mb-4 text-theme-gray">שחקנים</p>
        <div className="mb-3 flex items-center gap-2">
          <Input
            className="min-w-0 flex-1"
            placeholder="הוסף לפי אימייל"
            value={playerEmailTerm}
            onChange={(e) => setPlayerEmailTerm(e.target.value)}
            type="email"
          />
          <Button
            color="primary"
            onPress={addPlayer}
            isDisabled={
              !playerEmailTerm
                .toLocaleLowerCase()
                .match(
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                )
            }
            type="button"
          >
            <IconPlus />
          </Button>
        </div>
        <ul className="flex flex-col gap-2 overflow-y-auto scrollbar-hide">
          {players.map(
            (player, i) =>
              player && (
                <li key={player.id}>
                  <PlayerCard
                    player={player}
                    index={i}
                    onDelete={(index) => {
                      const playersCopy = [...players];

                      playersCopy.splice(index, 1);

                      setPlayers(playersCopy);
                    }}
                    showStats={false}
                  />
                </li>
              ),
          )}
        </ul>
      </div>
      <div className="mb-6 flex flex-col rounded-xl border border-theme-light-gray bg-theme-card px-6 py-4">
        <p className="mb-4 text-theme-gray">מנהלי קבוצה</p>
        <div className="mb-3 flex items-center gap-2">
          <Input
            className="min-w-0 flex-1"
            placeholder="הוסף לפי אימייל"
            value={adminEmailTerm}
            onChange={(e) => setAdminEmailTerm(e.target.value)}
            type="email"
          />
          <Button
            color="primary"
            onPress={addAdmin}
            isDisabled={
              !adminEmailTerm
                .toLocaleLowerCase()
                .match(
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                )
            }
            type="button"
          >
            <IconPlus />
          </Button>
        </div>
        <ul className="flex flex-col gap-2 overflow-y-auto scrollbar-hide">
          {admins.map(
            (admin, i) =>
              admin && (
                <li key={admin.id}>
                  <PlayerCard
                    player={admin}
                    index={i}
                    onDelete={(index) => {
                      const adminsCopy = [...admins];

                      adminsCopy.splice(index, 1);

                      setAdmins(adminsCopy);
                    }}
                  />
                </li>
              ),
          )}
        </ul>
      </div>
      <div className="flex gap-2">
        <Button color="secondary" onPress={() => router.back()} type="button">
          ביטול
        </Button>
        <Button
          color="primary"
          isDisabled={name.length < 3 || players.length < 5}
          type="submit"
        >
          {team ? "שמור שינויים" : "צור קבוצה"}
        </Button>
      </div>

      {photoURL && (
        <CropImageModal
          src={photoURL}
          onSave={onImageCrop}
          isOpen={cropImageModalOpen}
          onOpenChange={setCropImageModalOpen}
        />
      )}
    </form>
  );

  async function upsertTeam() {
    toast.loading(team ? "שומר שינויים..." : "יוצר קבוצה...");
    const hideLoading = showLoading();

    try {
      const newTeamId = await _upsertTeam({
        id: team ? team.id : null,
        name,
        players: players.map((p) => p.id),
        admins: admins.map((a) => a.id),
      });

      if (currentFile.current) {
        const supabase = createClient();

        await supabase.storage
          .from("images")
          .upload(`team-avatars/${newTeamId}`, currentFile.current);

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("images")
          .getPublicUrl(`team-avatars/${newTeamId}`);

        await supabase
          .from("teams")
          .update({ photo_url: publicUrl })
          .eq("id", newTeamId);
      }

      toast.success(team ? "שינויים נשמרו בהצלחה!" : "קבוצה נוצרה בהצלחה!");

      router.replace(`/team/edit/${newTeamId}`);
    } catch (err: any) {
      if ((err as Error).message === "TEAM_ALREADY_EXISTS") {
        toast.error("קבוצה עם שם זהה כבר קיימת");
        return;
      }

      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }

  async function addAdmin() {
    toast.loading("מוצא שחקן...");
    const hideLoading = showLoading();

    const supabase = createClient();

    try {
      const { data: admin, error } = await supabase
        .rpc("z2_get_user_by_email", {
          _email_term: adminEmailTerm,
        })
        .single<{
          id: string;
          created_at: string;
          display_name: string;
          email: string;
          photo_url: string | null;
          last_seen: string | null;
        }>();

      if (error) throw error;

      if (!admin) {
        toast.error("משתמש לא נמצא.");
        return;
      }

      if (admin.id === user.id) {
        toast.warning("אתה כבר מנהל.");
        return;
      }

      if (admins.map((admin) => admin.id).includes(admin.id)) {
        toast.warning("לא ניתן להוסיף מנהל יותר מפעם אחת.");
        return;
      }

      toast.success("מנהל נוסף בהצלחה!");
      setAdminEmailTerm("");
      setAdmins([...admins, admin]);
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }

  async function addPlayer() {
    toast.loading("מוצא שחקן...");
    const hideLoading = showLoading();

    const supabase = createClient();

    try {
      const { data: player, error } = await supabase
        .rpc("z2_get_user_by_email", {
          _email_term: playerEmailTerm,
        })
        .single<Topsoccer.User.UserInterface>();

      if (error) throw error;

      if (!player) {
        toast.error("משתמש לא נמצא.");
        return;
      }

      if (player.id === user.id) {
        toast.warning("לא ניתן להוסיף את עצמך.");
        return;
      }

      if (players.map((player) => player.id).includes(player.id)) {
        toast.warning("לא ניתן להוסיף שחקן יותר מפעם אחת.");
        return;
      }

      toast.success("שחקן נוסף בהצלחה!");
      setPlayerEmailTerm("");
      setPlayers([...players, player]);
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }

  async function deletePhoto() {
    if (team && photoURL === team.photo_url) {
      toast.loading("מוחק...");
      const hideLoading = showLoading();

      try {
        await _deletePhoto({ team_id: team.id });

        toast.success("תמונה נמחקה בהצלחה!");
      } catch (err) {
        console.log(err);
        toast.error();

        return Promise.reject(err);
      } finally {
        hideLoading();
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (currentFile.current) currentFile.current = undefined;

    setPhotoURL(null);
  }

  function onImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      currentFile.current = e.target.files[0];

      const imageUrl = URL.createObjectURL(currentFile.current);

      e.target.value = "";

      setPhotoURL(imageUrl);
      setCropImageModalOpen(true);
    }
  }

  function onImageCrop(data: { file: Blob; img: string }) {
    const { file, img } = data;

    currentFile.current = file;

    setCropImageModalOpen(false);
    setPhotoURL(img);
  }
}
