import React from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaNewspaper, FaUsers } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import { summary } from "../assets/data";
import clsx from "clsx";
import { Chart } from "../components/Chart";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils/helper";
import UserInfo from "../components/ui/UserInfo";
import { useGetDashboardStatusQuery } from "../redux/slice/app/taskApiSlice";
import Loading from "../components/Loader";
import Calender from "../components/Calender";

const TaskTable = ({ tasks }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />, 
    medium: <MdKeyboardArrowUp />, 
    low: <MdKeyboardArrowDown />,
  };

  return (
    <div className='w-full md:w-2/3 bg-gray-800 px-2 md:px-4 pt-4 pb-4 shadow-md rounded'>
      <table className='w-full'>
        <thead className='border-b border-gray-700'>
          <tr className='text-white text-left'>
            <th className='py-2'>Task Title</th>
            <th className='py-2'>Priority</th>
            <th className='py-2'>Team</th>
            <th className='py-2 hidden md:block'>Created At</th>
          </tr>
        </thead>
        <tbody>
          {tasks?.map((task, id) => (
            <tr key={id} className='border-b border-gray-700 text-gray-400 hover:bg-gray-700'>
              <td className='py-2'>
                <div className='flex items-center gap-2'>
                  <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])} />
                  <p className='text-base text-white'>{task.title}</p>
                </div>
              </td>
              <td className='py-2'>
                <div className='flex gap-1 items-center'>
                  <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
                    {ICONS[task.priority] || null}
                  </span>
                  <span className='capitalize'>{task.priority}</span>
                </div>
              </td>
              <td className='py-2'>
                <div className='flex'>
                  {task.team.map((m, index) => (
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
              </td>
              <td className='py-2 hidden md:block'>
                <span className='text-base text-gray-400'>
                  {moment(task?.date).fromNow()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const { data, isLoading } = useGetDashboardStatusQuery();

  if (isLoading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );
  }

  const totals = data?.tasks || {};
  const stats = [
    { _id: "1", label: "TOTAL TASK", total: data?.totalTasks || 0, icon: <FaNewspaper />, bg: "bg-[#1d4ed8]" },
    { _id: "2", label: "COMPLETED TASK", total: totals["completed"] || 0, icon: <MdAdminPanelSettings />, bg: "bg-[#0f766e]" },
    { _id: "3", label: "TASK IN PROGRESS", total: totals["in progress"] || 0, icon: <MdEdit />, bg: "bg-[#f59e0b]" },
    { _id: "4", label: "TODOS", total: totals["todo"] || 0, icon: <FaArrowsToDot />, bg: "bg-[#be185d]" },
  ];

  return (
    <div className='h-full py-4 bg-gray-900'>
      {/* responsive stats grid  */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
        {stats.map(({ icon, bg, label, total }, index) => (
          <div
            key={index}
            className='w-full h-32 bg-gray-800 p-5 shadow-md rounded-md flex items-center justify-between'
          >
            <div className='h-full flex flex-1 flex-col justify-between'>
              <p className='text-base text-gray-300'>{label}</p>
              <span className='text-2xl font-semibold text-white'>{total}</span>
              <span className='text-sm text-gray-500'>110 last month</span>
            </div>
            <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white", bg)}>
              {icon}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;
