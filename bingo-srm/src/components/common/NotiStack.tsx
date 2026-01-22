"use client";

import { useNotiStackStore } from "@/src/store/notiStack/notiStackStore";
import { useSnackbar } from "notistack";
import { useEffect } from "react";

export default function NotiStack() {
  const { open, variant, message, setCloseNotiStack } = useNotiStackStore();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!message || !open) return;

    enqueueSnackbar(message, {
      variant,
      key: new Date().getTime(),
      preventDuplicate: false,
      anchorOrigin: { vertical: "top", horizontal: "center" },
      autoHideDuration: 2000,
    });

    setCloseNotiStack();
  }, [open, enqueueSnackbar, message, variant, setCloseNotiStack]);

  return null;
}
