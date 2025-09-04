import { Contentful } from "@/clients/contentful";
import { cn } from "@heroui/react";

export default async function WelcomeCommentChip(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  const comment = await Contentful.getWelcomeComment();

  return (
    <div
      {...props}
      className={cn(
        "flex items-center border-orange-800 bg-orange-50 text-orange-800",
        props.className,
      )}
    >
      <span>{comment}</span>
    </div>
  );
}
