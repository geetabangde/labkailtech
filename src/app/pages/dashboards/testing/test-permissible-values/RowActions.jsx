// Import Dependencies
import { useCallback, useState } from "react";
import PropTypes from "prop-types";

// Local Imports
import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";
import axios from "utils/axios";
import { toast } from "sonner";
import { Link } from "react-router";

// ----------------------------------------------------------------------

const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to delete this permissible value? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Permissible Value Deleted",
  },
};

export function RowActions({ row, table }) {
  const id = row.original.id;
  const editPath = `/dashboards/testing/test-permissible-values/edit/${id}`;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const closeModal = () => {
    setDeleteModalOpen(false);
  };

  const openModal = () => {
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const handleDeleteRows = useCallback(async () => {
    const id = row.original.id;
    setConfirmDeleteLoading(true);

    try {
      await axios.delete(`/testing/delete-permissible-value?id=${id}`);

      // Remove row from UI
      table.options.meta?.deleteRow(row);

      setDeleteSuccess(true);
      toast.success("Permissible Value deleted successfully ✅", {
        duration: 1000,
        icon: "🗑️",
      });

      // Close modal after success
      setTimeout(() => {
        setDeleteModalOpen(false);
      }, 1000);
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteError(true);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete permissible value";

      toast.error(`${errorMessage} ❌`, {
        duration: 2000,
      });
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, [row, table]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  return (
    <>
      <div className="flex items-center justify-center space-x-2">
        {/* Edit Button */}
        <Button
          size="sm"
          variant="flat"
          component={Link}
          to={editPath}
          className="bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:hover:bg-primary-500/20 rounded-md px-3 py-1 text-xs font-semibold"
        >
          Edit
        </Button>

        {/* Delete Button */}
        <Button
          size="sm"
          variant="flat"
          onClick={openModal}
          className="rounded-md bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
        >
          Delete
        </Button>
      </div>

      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleDeleteRows}
        confirmLoading={confirmDeleteLoading}
        state={state}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};
