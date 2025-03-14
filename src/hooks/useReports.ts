import { useState, useEffect } from "react";
import { reportsApi, Report } from "@/services/api";
import { useTenant } from "@/contexts/TenantContext";

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [favoriteReports, setFavoriteReports] = useState<Report[]>([]);
  const [customReports, setCustomReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentTenant } = useTenant();

  useEffect(() => {
    const fetchReports = async () => {
      if (!currentTenant) return;

      try {
        setLoading(true);
        const allReports = await reportsApi.getAll();
        setReports(allReports);
        setFavoriteReports(allReports.filter((report) => report.is_favorite));
        setCustomReports(allReports.filter((report) => report.is_custom));
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch reports"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [currentTenant]);

  const toggleFavorite = async (reportId: string, isFavorite: boolean) => {
    try {
      await reportsApi.toggleFavorite(reportId, isFavorite);

      // Update local state
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId
            ? { ...report, is_favorite: isFavorite }
            : report,
        ),
      );

      if (isFavorite) {
        const report = reports.find((r) => r.id === reportId);
        if (report) {
          setFavoriteReports((prev) => [
            ...prev,
            { ...report, is_favorite: true },
          ]);
        }
      } else {
        setFavoriteReports((prev) =>
          prev.filter((report) => report.id !== reportId),
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to update favorite status"),
      );
    }
  };

  const createCustomReport = async (
    report: Omit<Report, "id" | "created_at" | "updated_at" | "tenant_id">,
  ) => {
    try {
      const newReport = await reportsApi.create({
        ...report,
        is_custom: true,
      });

      // Update local state
      setReports((prev) => [...prev, newReport]);
      setCustomReports((prev) => [...prev, newReport]);

      return newReport;
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to create custom report"),
      );
      throw err;
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      await reportsApi.delete(reportId);

      // Update local state
      setReports((prev) => prev.filter((report) => report.id !== reportId));
      setFavoriteReports((prev) =>
        prev.filter((report) => report.id !== reportId),
      );
      setCustomReports((prev) =>
        prev.filter((report) => report.id !== reportId),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete report"),
      );
      throw err;
    }
  };

  return {
    reports,
    favoriteReports,
    customReports,
    loading,
    error,
    toggleFavorite,
    createCustomReport,
    deleteReport,
  };
}
