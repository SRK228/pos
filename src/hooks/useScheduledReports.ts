import { useState, useEffect } from "react";
import { scheduledReportsApi, ScheduledReport } from "@/services/api";
import { useTenant } from "@/contexts/TenantContext";

export function useScheduledReports() {
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentTenant } = useTenant();

  useEffect(() => {
    const fetchScheduledReports = async () => {
      if (!currentTenant) return;

      try {
        setLoading(true);
        const data = await scheduledReportsApi.getAll();
        setScheduledReports(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch scheduled reports"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledReports();
  }, [currentTenant]);

  const createScheduledReport = async (
    scheduledReport: Omit<
      ScheduledReport,
      "id" | "created_at" | "updated_at" | "tenant_id"
    >,
  ) => {
    try {
      const newScheduledReport =
        await scheduledReportsApi.create(scheduledReport);
      setScheduledReports((prev) => [...prev, newScheduledReport]);
      return newScheduledReport;
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to create scheduled report"),
      );
      throw err;
    }
  };

  const updateScheduledReport = async (
    id: string,
    scheduledReport: Partial<ScheduledReport>,
  ) => {
    try {
      const updatedScheduledReport = await scheduledReportsApi.update(
        id,
        scheduledReport,
      );
      setScheduledReports((prev) =>
        prev.map((report) =>
          report.id === id ? updatedScheduledReport : report,
        ),
      );
      return updatedScheduledReport;
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to update scheduled report"),
      );
      throw err;
    }
  };

  const deleteScheduledReport = async (id: string) => {
    try {
      await scheduledReportsApi.delete(id);
      setScheduledReports((prev) => prev.filter((report) => report.id !== id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to delete scheduled report"),
      );
      throw err;
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const updatedReport = await scheduledReportsApi.toggleActive(
        id,
        isActive,
      );
      setScheduledReports((prev) =>
        prev.map((report) => (report.id === id ? updatedReport : report)),
      );
      return updatedReport;
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to toggle scheduled report status"),
      );
      throw err;
    }
  };

  return {
    scheduledReports,
    loading,
    error,
    createScheduledReport,
    updateScheduledReport,
    deleteScheduledReport,
    toggleActive,
  };
}
