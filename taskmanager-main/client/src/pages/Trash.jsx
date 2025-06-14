import clsx from "clsx";
import React, { useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import { tasks } from "../assets/data";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils/helper";
import { useDeleteRestoreTaskMutation, useGetAllTaskQuery } from "../redux/slice/app/taskApiSlice";
import Loading from "../components/Loader";
import ConfirmatioDialog from "../components/Dialogs";
import { toast } from "react-toastify";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");

  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: "",
    isTrashed: "true",
    search: "",
  });

  const [deleteRestoreTask] = useDeleteRestoreTaskMutation();

  const deleteRestoreHandler = async () => {
    try {
      let result;
      switch (type) {
        case "delete":
          result = await deleteRestoreTask({ id: selected, actionType: "delete" }).unwrap();
          break;
        case "deleteAll":
          result = await deleteRestoreTask({ id: selected, actionType: "deleteAll" }).unwrap();
          break;
        case "restore":
          result = await deleteRestoreTask({ id: selected, actionType: "restore" }).unwrap();
          break;
        case "restoreAll":
          result = await deleteRestoreTask({ id: selected, actionType: "restoreAll" }).unwrap();
          break;
        default:
          throw new Error("Invalid action type");
      }
      toast.success(result?.message);
      setTimeout(() => {
        setOpenDialog(false);
        refetch();
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permanently delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setMsg("Do you want to permanently delete the selected item?");
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setSelected(id);
    setType("restore");
    setMsg("Do you want to restore the selected item?");
    setOpenDialog(true);
  };

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  const TableHeader = () => (
    <thead className="border-b border-blue-900">
      <tr className="text-blue-100 text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2">Stage</th>
        <th className="py-2 line-clamp-1">Modified On</th>
        <th className="py-2 text-right">Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className="border-b border-blue-900 text-blue-200 hover:bg-blue-900 transition-colors duration-200">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[item.stage])} />
          <p className="w-full line-clamp-2 text-base">{item?.title}</p>
        </div>
      </td>

      <td className="py-2 capitalize">
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span>{item?.priority}</span>
        </div>
      </td>

      <td className="py-2 capitalize text-center md:text-start">{item?.stage}</td>
      <td className="py-2 text-sm">{new Date(item?.date).toDateString()}</td>

      <td className="py-2 flex gap-1 justify-end">
        <Button
          icon={<MdOutlineRestore className="text-xl text-blue-400 hover:text-blue-200 transition" />}
          onClick={() => restoreClick(item._id)}
          aria-label="Restore task"
        />
        <Button
          icon={<MdDelete className="text-xl text-blue-600 hover:text-blue-800 transition" />}
          onClick={() => deleteClick(item._id)}
          aria-label="Delete task"
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Trashed Tasks" />

          <div className="flex gap-2 md:gap-4 items-center">
            <Button
              label="Restore All"
              icon={<MdOutlineRestore className="text-lg hidden md:flex" />}
              className="flex flex-row-reverse gap-1 items-center text-white text-sm md:text-base rounded-md 2xl:py-2.5 bg-blue-600 hover:bg-blue-500 transition"
              onClick={restoreAllClick}
            />
            <Button
              label="Delete All"
              icon={<MdDelete className="text-lg hidden md:flex" />}
              className="flex flex-row-reverse gap-1 items-center text-blue-600 hover:text-blue-800 text-sm md:text-base rounded-md 2xl:py-2.5 transition"
              onClick={deleteAllClick}
            />
          </div>
        </div>

        <div className="bg-slate-700 text-blue-100 px-2 md:px-6 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {data?.tasks?.map((tk, id) => (
                  <TableRow key={tk._id || id} item={tk} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={deleteRestoreHandler}
      />
    </>
  );
};

export default Trash;
