import type { Topsoccer } from "@/types";

export function getRoleLabel(role: Topsoccer.User.Role) {
  switch (role) {
    case "admin":
      return "אדמין";
    case "user":
      return "משתמש";
    case "worker":
      return "עובד";
  }
}
