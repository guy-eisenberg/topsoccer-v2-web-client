import { Suspense } from "react";
import ProfileForm from "./ProfileForm";

export default function ProfilePageLoading() {
  return (
    <Suspense>
      <ProfileForm user={{} as any} loading={true} />
    </Suspense>
  );
}
