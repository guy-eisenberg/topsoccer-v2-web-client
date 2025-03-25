import { Contentful } from "@/clients/contentful";
import { cn } from "@heroui/theme";

export default async function AlertChip(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  const alert = await Contentful.getHomepageAlert();

  return (
    <div
      {...props}
      className={cn(
        "border-warning bg-warning-50 border text-center text-sm font-medium",
        props.className,
      )}
    >
      <span>{alert}</span>
    </div>
  );
}
