import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  CalendarIcon,
  DocumentTextIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";
import axios from "utils/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to delete this Manage Lab? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Manage Lab Deleted",
  },
};

export function RowActions({ row, table }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    const id = row.original.id;
    navigate(`/dashboards/master-data/manage-labs/edit/${id}`);
  };

  const handleSchedule = () => {
    const id = row.original.id;
    navigate(`/dashboards/master-data/manage-labs/schedule/${id}`);
  };

  const handleEnvRecord = () => {
    const id = row.original.id;
    navigate(`/dashboards/master-data/manage-labs/environmental-record/${id}`);
  };
   const handleMangEnvRang = () => {
    const id = row.original.id;
    navigate(`/dashboards/master-data/manage-labs/manage-enviornmental-range/${id}`);
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const closeModal = () => setDeleteModalOpen(false);
  const openModal = () => {
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const handleDeleteRows = useCallback(async () => {
    const id = row.original.id;
    setConfirmDeleteLoading(true);
    try {
      await axios.delete(`/master/delete-lab/${id}`);
      table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
      toast.success("Manage Labs deleted successfully ✅", { duration: 1000, icon: "🗑️" });
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteError(true);
      toast.error("Failed to delete unit type ❌", { duration: 2000 });
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, [row, table]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  return (
    <>
      <div className="flex justify-center space-x-1.5">
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton as={Button} isIcon className="size-8 rounded-full">
            <EllipsisHorizontalIcon className="size-4.5" />
          </MenuButton>

          <Transition
            as={Fragment}
            enter="transition ease-out"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
          >
            <MenuItems
              anchor={{ to: "bottom end", gap: 12 }}
              className="absolute z-100 w-[14rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg outline-hidden ltr:right-0 rtl:left-0"
            >
              {/* Edit */}
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={handleEdit}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide transition-colors",
                      focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                    )}
                  >
                    <PencilIcon className="size-4.5 stroke-1" />
                    <span>Edit</span>
                  </button>
                )}
              </MenuItem>

              {/* Schedule */}
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={handleSchedule}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide transition-colors",
                      focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                    )}
                  >
                    <CalendarIcon className="size-4.5 stroke-1" />
                    <span>+ Schedule</span>
                  </button>
                )}
              </MenuItem>

              {/* Environmental Record */}
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={handleEnvRecord}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide transition-colors",
                      focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                    )}
                  >
                    <DocumentTextIcon className="size-4.5 stroke-1" />
                    <span>Environmental Record</span>
                  </button>
                )}
              </MenuItem>
               <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={handleMangEnvRang}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide transition-colors",
                      focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                    )}
                  >
                    <DocumentTextIcon className="size-4.5 stroke-1" />
                    <span>Manage Enviornmental Range</span>
                  </button>
                )}
              </MenuItem>

              {/* Delete */}
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={openModal}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-red-600 transition-colors dark:text-red-400",
                      focus && "bg-red-100 dark:bg-red-600/20"
                    )}
                  >
                    <TrashIcon className="size-4.5 stroke-1" />
                    <span>Delete</span>
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
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
