/**
 * Formatea una fecha "YYYY-MM-DD" sin pasar por UTC: `new Date("2025-05-07")`
 * se interpreta como medianoche UTC y en husos negativos muestra el día anterior.
 */
export const formatDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-").map(Number);

  if (!year || !month || !day) return isoDate;

  return new Intl.DateTimeFormat("es-AR", { dateStyle: "long" }).format(
    new Date(year, month - 1, day)
  );
};
