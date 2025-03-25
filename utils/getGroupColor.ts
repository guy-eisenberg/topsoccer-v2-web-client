import type { Topsoccer } from "@/types";

export default function getGroupColor(group: Topsoccer.Group.Name) {
  switch (group) {
    case "Black":
      return "#222";
    case "Blue":
      return "#0058DD";
    case "Green":
      return "#00DD16";
    case "Orange":
      return "#DD8500";
    case "Pink":
      return "#DD00D4";
    case "Red":
      return "#DD0000";
    case "White":
      return "#C4C4C4";
    case "Yellow":
      return "#DDC700";
  }
}
