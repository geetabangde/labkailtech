// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";
import {
    
    CustomerCell,
    
    TotalCell,
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        label: "Row Selection",
        header: SelectHeader,
        cell: SelectCell,
    }),

    // ✅ S No (index based)
  columnHelper.accessor((_row, index) => index + 1, {
    id: "s_no",
    header: "S No",
    cell: (info) => info.row.index + 1,
  }),
    
    columnHelper.accessor((row) => row.customer.name, {
        id: "customer",
        label: "Customer",
        header: "Name",
        cell: CustomerCell,
    }),
    columnHelper.accessor((row) => row.total, {
        id: "total",
        label: "Total",
        header: "Mobile",
        cell: TotalCell,
        
    }),
    columnHelper.display({
        id: "actions",
        label: "Row Actions",
        header: "Actions",
        cell: RowActions
    }),
]
