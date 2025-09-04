import { addToast, closeAll } from "@heroui/react";

const toast = {
  success(title: string) {
    closeAll();

    addToast({
      title,
      timeout: 7500,
      shouldShowTimeoutProgress: true,
      color: "success",
    });
  },
  error(title = "קרתה תקלה") {
    closeAll();

    addToast({
      title,
      timeout: 7500,
      shouldShowTimeoutProgress: true,
      color: "danger",
    });
  },
  warning(title: string) {
    closeAll();

    addToast({
      title,
      timeout: 7500,
      shouldShowTimeoutProgress: true,
      color: "warning",
    });
  },
  loading(title = "טוען...") {
    closeAll();

    addToast({
      title,
      promise: new Promise(() => ({})),
      color: "default",
    });
  },
  dismiss() {
    closeAll();
  },
};

export default toast;
