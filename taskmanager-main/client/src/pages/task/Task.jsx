import React, { useState } from "react";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loader";
import Title from "../../components/Title";
import Button from "../../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../../components/Tabs";
import TaskTitle from "../../components/TaskTitle";
import BoardView from "../../components/Board";
import AddTask from "../../components/task/AddTask";
import { useGetAllTaskQuery } from "../../redux/slice/app/taskApiSlice";

const TABS = [{ title: "Board View", icon: <MdGridView /> }];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const params = useParams();
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false); 

  const status = params?.status || "";

  const { data, isLoading, isError, error } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: "",
  });
  
  // console.log("API Data:", data);  // Check if tasks are coming through
  // console.log("Error:", error); 

  const tasks = data?.tasks ?? [];

  console.log("Tasks Data:", tasks); // Debugging tasks data

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-600 min-h-screen p-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
          <TaskTitle label="To Do" className={TASK_TYPE.todo} />
          <TaskTitle label="In Progress" className={TASK_TYPE["in progress"]} />
          <TaskTitle label="Completed" className={TASK_TYPE.completed} />
        </div>

        {/* Board View */}
        <BoardView tasks={tasks} />
      </Tabs>

      {/* Add Task Modal */}
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
