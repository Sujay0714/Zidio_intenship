const TaskDialog = ({ task, user, onTaskUpdated }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openSubtask, setOpenSubtask] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();
  const [deleteTask] = useTrashTaskMutation();
  const [duplicateTask] = useDuplicateTaskMutation();

  const duplicateHandler = async () => {
    try {
      const res = await duplicateTask(task._id).unwrap();
      toast.success(res?.message);
      setOpenDialog(false);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.message || "Failed to duplicate task");
    }
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteTask({ id: task._id, isTrashed: "trash" }).unwrap();
      toast.success(res?.message);
      setOpenDialog(false);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.message || "Failed to delete task");
    }
  };

  // Task menu items
  const items = [
    {
      label: "Open Task",
      icon: <AiTwotoneFolderOpen className="mr-2 h-5 w-5" />,
      onClick: () => navigate(`/task/${task._id}`),
    },
    ...(user?.isAdmin
      ? [
          {
            label: "Edit",
            icon: <MdOutlineEdit className="mr-2 h-5 w-5" />,
            onClick: () => setOpenEdit(true),
          },
          {
            label: "Add Sub-Task",
            icon: <MdAdd className="mr-2 h-5 w-5" />,
            onClick: () => setOpenSubtask(true),
          },
          {
            label: "Duplicate",
            icon: <HiDuplicate className="mr-2 h-5 w-5" />,
            onClick: duplicateHandler,
          },
        ]
      : []),
  ];

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600">
          <BsThreeDots />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none divide-y divide-gray-100 p-2 space-y-2 z-50">
            <div className="space-y-2">
              {items.map((el) => (
                <Menu.Item key={el.label}>
                  {({ active }) => (
                    <button
                      onClick={el.onClick}
                      className={`${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      {el.icon}
                      {el.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>

            {user?.isAdmin && (
              <div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpenDialog(true)}
                      className={`${
                        active ? "bg-red-500 text-white" : "text-red-600"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <RiDeleteBin6Line className="mr-2 h-5 w-5" />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            )}
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Dialogs & Modals */}
      <AddTask open={openEdit} setOpen={setOpenEdit} task={task} />
      <AddSubTask open={openSubtask} setOpen={setOpenSubtask} id={task?._id} />
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default TaskDialog;
