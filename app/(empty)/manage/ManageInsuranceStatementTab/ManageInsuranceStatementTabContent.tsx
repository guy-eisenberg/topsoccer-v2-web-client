"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import { Button } from "@/app/components/core/Button";
import { createClient } from "@/clients/supabase/client";
import { useRouter } from "@/context/RouterContext";
import toast from "@/utils/toast";
import EditorJS from "@editorjs/editorjs";
import dynamic from "next/dynamic";
import { useState } from "react";

const Editor = dynamic(() => import("@/app/components/core/Editor"), {
  ssr: false,
});

export default function ManageInsuranceStatementTabContent({
  json,
}: {
  json: any;
}) {
  const router = useRouter();

  const [editor, setEditor] = useState<EditorJS | undefined>(undefined);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <Editor className="flex-1" onReady={setEditor} json={json} />
      <div className="sticky bottom-0 flex justify-center gap-2 pt-2">
        <Button
          color="secondary"
          onPress={() => {
            if (editor) editor.render(json);
          }}
        >
          שחזר
        </Button>
        <Button color="primary" onPress={saveInsuranceStatement}>
          שמור שינויים
        </Button>
      </div>
    </div>
  );

  async function saveInsuranceStatement() {
    if (!editor) return;

    toast.loading("שומר שינויים...");
    const hideLoading = showLoading();

    const supabase = createClient();

    try {
      const data = await editor.save();

      const json = JSON.stringify(data);
      const blob = new Blob([json], { type: "application/json" });

      await supabase.storage
        .from("files")
        .update("insurance-statement.json", blob);

      await router.refresh();

      toast.success("שינויים נשמרו בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }
}
