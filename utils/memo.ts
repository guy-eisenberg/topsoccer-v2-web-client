import React, { FunctionComponent } from "react";

export function memo<Props>(
  Component: FunctionComponent<Props>,
  deps?: (keyof Props)[],
) {
  return React.memo(Component, (prevProps, nextProps) => {
    if (!deps) {
      let t: keyof Props;
      for (t in nextProps) {
        if (prevProps[t] !== nextProps[t]) return false;
      }
    } else {
      for (const dep of deps) {
        if (prevProps[dep] !== nextProps[dep]) return false;
      }
    }

    return true;
  });
}
