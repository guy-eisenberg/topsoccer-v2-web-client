import type { Topsoccer } from "@/types";

export function getEventSubTypeLabel(type: Topsoccer.Event.SubType) {
  switch (type) {
    case "Singles":
      return "יחידים";
    case "Teams":
      return "קבוצות";
  }
}
