"use client";

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 } from "uuid";
import { Animation } from "../../core/Animation";
import animation from "./animation.json";

type Loaders = { [key: string]: boolean };

export default function Loader() {
  const [loaders, setLoaders] = useState<Loaders>({});

  const shown = useMemo(() => {
    return Object.values(loaders).reduce((flag, value) => flag || value, false);
  }, [loaders]);

  useEffect(() => {
    LoaderState.subscribe(setLoaders);
  }, []);

  return (
    <div
      className={`inset-0 z-[90] flex items-center justify-center bg-black/50 ${shown ? "fixed" : "hidden"}`}
    >
      <Animation animationData={animation} className="h-48 w-48" loop />
    </div>
  );
}

class LoaderState {
  private static setter: Dispatch<SetStateAction<Loaders>>;

  static subscribe(setter: Dispatch<SetStateAction<Loaders>>) {
    this.setter = setter;
  }

  static showLoading() {
    const uuid = v4();

    this.setter((loaders) => {
      return { ...loaders, [uuid]: true };
    });

    return () => {
      this.setter((loaders) => {
        const newLoaders = { ...loaders };
        delete newLoaders[uuid];

        return newLoaders;
      });
    };
  }

  static hideAllLoading() {
    this.setter({});
  }
}

export function showLoading() {
  return LoaderState.showLoading();
}

export function hideAllLoading() {
  return LoaderState.hideAllLoading();
}
