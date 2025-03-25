import { createClient } from "@/clients/supabase/server";
import edjsHTML from "editorjs-html";

export default async function TermsOfUsePage() {
  const termsOfUseHTML = await getTermsOfUseHTML();

  return <main dangerouslySetInnerHTML={{ __html: termsOfUseHTML }} />;
}

async function getTermsOfUseHTML() {
  const supabase = await createClient();

  const { data: fileContent } = await supabase.storage
    .from("files")
    .download(`terms-of-use.json?t=${new Date().toISOString()}`);

  if (fileContent === null)
    throw new Error('File "terms-of-use.json" not found.');

  const buffer = await fileContent.text();
  const data = JSON.parse(buffer);
  const html = edjsHTML().parse(data) as string;

  return html;
}
