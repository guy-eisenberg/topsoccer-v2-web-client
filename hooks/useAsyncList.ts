import { type SortDescriptor } from "@heroui/table";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

export default function useAsyncList<T>({
  fetch,
  debounce = 0,
}: {
  fetch: (data: {
    filterText: string;
    page: number;
    sort: SortDescriptor | null;
    metadata: { [key: string]: any };
  }) => Promise<T[]>;
  debounce?: number;
}) {
  const res = useRef<(v: unknown) => void | null>(null);

  const [pending, start] = useTransition();
  const [triggered, setTriggered] = useState(false);

  const [filterText, setFilterText] = useState("");
  const [debouncedFilterText, setDebouncedFilterText] = useState("");

  const [sort, setSort] = useState<SortDescriptor | null>(null);
  const [page, setPage] = useState(0);
  const [metadata, setMetadata] = useState<{ [key: string]: any }>({});
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const revalidate = useCallback(
    async (data: {
      filterText: string;
      page: number;
      sort: SortDescriptor | null;
      metadata: { [key: string]: any };
    }) => {
      setLoading(true);
      try {
        const { filterText, page, sort, metadata } = data;

        const items = await fetch({ filterText, page, sort, metadata });

        setTriggered(true);

        return new Promise((newRes) => {
          res.current = newRes;

          start(() => {
            setItems(items);
          });
        });
      } catch {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (!pending && triggered) {
      if (res.current) res.current(null);
      setTriggered(false);
      setLoading(false);
    }
  }, [pending, triggered]);

  useEffect(() => {
    revalidate({ filterText: debouncedFilterText, page, sort, metadata });
  }, [debouncedFilterText, sort, page, metadata, revalidate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(0);
      setDebouncedFilterText(filterText);
    }, debounce);

    return () => {
      clearTimeout(timeout);
    };
  }, [debounce, filterText]);

  return {
    items,
    isLoading: loading || pending,
    filterText,
    setFilterText,
    revalidate: useCallback(
      () => revalidate({ filterText, page, sort, metadata }),
      [filterText, metadata, page, revalidate, sort],
    ),
    sort,
    setSort,
    page,
    setPage,
    metadata,
    setMetadata,
  };
}
