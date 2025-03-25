import type { Topsoccer } from "@/types";
import { getEventSubTypeLabel } from "./getEventSubTypeLabel";

export function calculateEventTitle(
  city: string,
  day: number,
  type: Topsoccer.Event.Type,
  subType: Topsoccer.Event.SubType,
  comment?: string,
) {
  return `${city} - יום ${
    ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"][day]
  } ${type} ${getEventSubTypeLabel(subType)} ${comment ? `- ${comment}` : ""}`;
}
