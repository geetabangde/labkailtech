// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

export const columns = [
  // 1. ID
  columnHelper.accessor("id", {
    id: "id",
    header: "ID",
    cell: (info) => info.getValue(),
  }),

  // 2. Product
  columnHelper.accessor("product_name", {
    id: "product_name",
    header: "Product",
    cell: (info) => {
      const val =
        info.getValue() || info.row.original.name || info.row.original.desci;
      return val && val !== "-" && val !== "NA" ? val : "N/A";
    },
  }),

  // 3. Parameter
  columnHelper.accessor("parameter_name", {
    id: "parameter_name",
    header: "Parameter",
    cell: (info) => {
      const val =
        info.getValue() ||
        info.row.original.parametername ||
        info.row.original.parameter;
      if (Array.isArray(val)) {
        return (
          val.filter((v) => v && v !== "-" && v !== "NA").join(", ") || "N/A"
        );
      }
      return val && val !== "-" && val !== "NA" ? val : "N/A";
    },
  }),

  // 4. Standard
  columnHelper.accessor("standard_name", {
    id: "standard_name",
    header: "Standard",
    cell: (info) => {
      const val =
        info.getValue() ||
        info.row.original.standardname ||
        info.row.original.standard;
      return val && val !== "-" && val !== "NA" ? val : "N/A";
    },
  }),

  // 5. Range
  columnHelper.display({
    id: "range",
    header: "Range",
    cell: (info) => {
      const { pvaluemin, pvaluemax } = info.row.original;
      if (Array.isArray(pvaluemin) && Array.isArray(pvaluemax)) {
        return pvaluemin
          .map((min, i) => `${min ?? ""} - ${pvaluemax[i] ?? ""}`)
          .join(", ");
      }

      const isValid = (val) =>
        val !== null && val !== undefined && val !== "" && val !== "NA";
      const hasMin = isValid(pvaluemin);
      const hasMax = isValid(pvaluemax);

      if (hasMin || hasMax) {
        return `${hasMin ? pvaluemin : ""} - ${hasMax ? pvaluemax : ""}`;
      }
      return "N/A";
    },
  }),

  // 6. Grade/Size
  columnHelper.display({
    id: "grade_size",
    header: "Grade/Size",
    cell: (info) => {
      const { grade_name, size_name, grade, size } = info.row.original;

      const isValid = (val) =>
        val && val !== "NA" && val !== "N/A" && val !== "-";

      const g = isValid(grade_name)
        ? grade_name
        : isValid(grade)
          ? grade
          : null;
      const s = isValid(size_name) ? size_name : isValid(size) ? size : null;

      return [g, s].filter(Boolean).join(" / ") || "N/A";
    },
  }),

  // 7. Specification
  columnHelper.accessor("specification", {
    id: "specification",
    header: "Specification",
    cell: (info) => {
      const val = info.getValue();
      if (Array.isArray(val)) {
        return val.filter((v) => v && v !== "-").join(", ") || "N/A";
      }
      return val && val !== "-" ? val : "N/A";
    },
  }),

  // 8. Actions
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: RowActions,
  }),
];
