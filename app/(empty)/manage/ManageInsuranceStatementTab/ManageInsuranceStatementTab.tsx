import { createClient } from "@/clients/supabase/server";
import ManageInsuranceStatementTabContent from "./ManageInsuranceStatementTabContent";

export default async function ManageInsuranceStatementTab() {
  const json = await getJson();

  return <ManageInsuranceStatementTabContent json={json} />;
}

async function getJson() {
  const supabase = await createClient();

  const { data: fileContent } = await supabase.storage
    .from("files")
    .download(`insurance-statement.json?t=${new Date().toISOString()}`);

  if (!fileContent) throw new Error("File insurance-statement.json not found.");

  const buffer = await fileContent.text();
  const json = JSON.parse(buffer);

  return json;
}
