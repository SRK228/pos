import { useState, useEffect } from "react";
import { reportHistoryApi, ReportHistory } from "@/services/api";
import { useTenant } from "@/contexts/TenantContext";

export function useReportHistory(reportId?: string) {
  const [reportHistory, setReportHistory] = useState<ReportHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentTenant } = useTenant();

  useEffect(() => {
    const fetchReportHistory = async () => {
      if (!currentTenant) return;

      try {
        setLoading(true);
        let data;
        if (reportId) {
          data = await reportHistoryApi.getByReportId(reportId);
        } else {
          data = await reportHistoryApi.getAll();
        }
        setReportHistory(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch report history"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReportHistory();
  }, [reportId, currentTenant]);

  const createReportHistory = async (
    history: Omit<ReportHistory, "id" | "created_at" | "tenant_id">,
  ) => {
    try {
      const newHistory = await reportHistoryApi.create(history);
      setReportHistory((prev) => [newHistory, ...prev]);
      return newHistory;
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to create report history"),
      );
      throw err;
    }
  };

  const deleteReportHistory = async (id: string) => {
    try {
      await reportHistoryApi.delete(id);
      setReportHistory((prev) => prev.filter((history) => history.id !== id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to delete report history"),
      );
      throw err;
    }
  };

  return {
    reportHistory,
    loading,
    error,
    createReportHistory,
    deleteReportHistory,
  };
}
