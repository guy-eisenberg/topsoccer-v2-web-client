import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import { fetchAuth } from "@/utils/server/fetchAuth";
import edjsHTML from "editorjs-html";
import InsuranceStatementForm from "./InsuranceStatementForm";

export default async function InsuranceStatementPage() {
  const {
    html: insuranceStatementHTML,
    user,
    insurance_statement,
  } = await getInsuranceStatement();

  return (
    <main>
      <div dangerouslySetInnerHTML={{ __html: insuranceStatementHTML }} />
      {user && (
        <InsuranceStatementForm insurance_statement={insurance_statement} />
      )}
    </main>
  );
}

async function getInsuranceStatement() {
  const supabase = await createClient();

  const { data: fileContent } = await supabase.storage
    .from("files")
    .download(`insurance-statement.json?t=${new Date().toISOString()}`);

  if (!fileContent) throw new Error("File insurance-statement.json not found.");

  const buffer = await fileContent.text();
  const data = JSON.parse(buffer);
  const html = edjsHTML().parse(data) as string;

  const user = await fetchAuth();

  let insurance_statement: Topsoccer.User.InsuranceStatement | null = null;
  if (user) {
    const { data } = await supabase
      .from("users_private_data")
      .select("insurance_statement")
      .eq("id", user.id)
      .single();

    insurance_statement = data?.insurance_statement;
  }

  return { html, user, insurance_statement };
}
