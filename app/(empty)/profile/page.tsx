import { fetchAuth } from "@/utils/server/fetchAuth";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const user = await fetchAuth();
  if (!user) redirect("/");

  return <ProfileForm user={user} />;
}
