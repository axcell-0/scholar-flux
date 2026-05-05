import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDashboardSummary() {
  const { data, error, mutate } = useSWR("/api/dashboard/summary", fetcher);

    return {
    summary: data,
    isLoading: !error && !data,
    isError: error,
    refresh: () => mutate(),
  };
}