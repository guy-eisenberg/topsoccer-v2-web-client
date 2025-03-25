import { createClient } from "@/clients/supabase/server";
import ManageTermsOfUseTabContent from "./ManageTermsOfUseTabContent";

export default async function ManageTermsOfUseTab() {
  const json = await getJson();

  return <ManageTermsOfUseTabContent json={json} />;
}

async function getJson() {
  const supabase = await createClient();

  const { data: fileContent } = await supabase.storage
    .from("files")
    .download(`terms-of-use.json?t=${new Date().toISOString()}`);

  if (!fileContent) throw new Error("File terms-of-use.json not found.");

  const buffer = await fileContent.text();
  const json = JSON.parse(buffer);

  return json;
}
