import type { Topsoccer } from "@/types";

export const EVENT_TYPES: Topsoccer.Event.Type[] = [
  "4X4",
  "5X5",
  "6X6",
  "7X7",
  "8X8",
  "9X9",
  "10X10",
  "11X11",
];

export const EVENT_SUBTYPES: Topsoccer.Event.SubType[] = ["Singles", "Teams"];

export const GROUPS: Topsoccer.Group.Name[] = [
  "Orange",
  "Green",
  "Yellow",
  "Pink",
  "Red",
  "Blue",
  "White",
  "Black",
];

export const COLORS = {
  "theme-green": "#2eac68",
  "theme-warning": "#f5a524",
  "theme-danger": "#f31260",
  "theme-gray": "#888888",
};

export const TIMEZONE = "Asia/Jerusalem";
