import clsx from "clsx";
import React, { useState } from "react";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils/helper";
import TaskDialog from "./task/TaskDialog";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import UserInfo from "./ui/UserInfo";
import { IoMdAdd } from "react-icons/io";
import AddSubTask from "./task/AddSubTask";
import { useNavigate } from "react-router-dom";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task, onTaskUpdated }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubTaskOpen = () => {
    if (user?.isAdmin) setOpen(true);
  };

  const handleOpenTask = () => {
    if (!user?.isAdmin) navigate(`/task/${task._id}`);
  };

  return (
    <>
      <div className="w-full h-fit bg-gray-800 text-white shadow-md p-4 rounded relative group">
        {/* Priority Header */}
        <div className="w-full flex justify-between">
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            <span className="text-lg">{ICONS[task?.priority]}</span>
            <span className="uppercase">{task?.priority} Priority</span>
          </div>

          {user?.isAdmin ? (
            <TaskDialog task={task} onTaskUpdated={onTaskUpdated} />
          ) : (
            <button
              onClick={handleOpenTask}
              className="text-sm text-blue-400 hover:underline"
            >
              Open Task
            </button>
          )}
        </div>

        {/* Title & Stage */}
        <div className="flex items-center gap-2 mt-2">
          <div
            className={clsx(
              "w-4 h-4 rounded-full",
              TASK_TYPE[task.stage?.toLowerCase()] ?? "bg-gray-500"
            )}
          />
          <h4 className="line-clamp-1 text-white font-medium">{task?.title}</h4>
        </div>

        <span className="text-sm text-gray-400">
          {formatDate(new Date(task?.date))}
        </span>

        <div className="w-full border-t border-gray-600 my-2" />

        {/* Stats */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 items-center text-sm text-gray-400">
              <BiMessageAltDetail />
              <span>{task?.activities?.length}</span>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-400">
              <MdAttachFile />
              <span>{task?.assets?.length}</span>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-400">
              <FaList />
              <span>0/{task?.subTasks?.length}</span>
            </div>
          </div>

          <div className="flex flex-row-reverse">
            {task?.team?.map((m, index) => (
              <div
                key={index}
                className={clsx(
                  "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                  BGS[index % BGS.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </div>

        {/* Subtask Info */}
        {task?.subTasks?.length > 0 ? (
          <div className="py-4 border-t border-gray-600">
            <h5 className="text-base line-clamp-1 text-white font-medium">
              {task?.subTasks[0]?.title}
            </h5>
            <div className="p-2 flex justify-between items-center text-sm">
              <span className="text-gray-400">
                {formatDate(new Date(task?.subTasks[0]?.date))}
              </span>
              <span className="bg-blue-600/10 px-3 py-1 rounded-full text-blue-700 font-medium">
                {task?.subTasks[0]?.tag}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-4 border-t border-gray-600">
            <span className="text-gray-500">No Sub Task</span>
          </div>
        )}

        {/* Add Subtask */}
        {user?.isAdmin && (
          <div className="w-full pb-2">
            <button
              onClick={handleSubTaskOpen}
              className="w-full flex gap-4 items-center text-sm text-gray-500 font-semibold hover:text-gray-300"
            >
              <IoMdAdd className="text-lg" />
              <span>ADD SUBTASK</span>
            </button>
          </div>
        )}
      </div>

      {/* Subtask Modal */}
      {user?.isAdmin && (
        <AddSubTask open={open} setOpen={setOpen} id={task._id} />
      )}
    </>
  );
};

export default TaskCard;
