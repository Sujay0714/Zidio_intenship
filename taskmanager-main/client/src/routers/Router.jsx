import { Navigate, Route, Routes } from "react-router-dom";
import Task from "../pages/task/Task";
import Login from "../pages/authantication/Login"; //
import TaskDetails from "../pages/task/TaskDetails";
import Team from "../pages/Team";
import Trash from "../pages/Trash";
import { Toaster } from "sonner"; 
import Layout from "../components/lib/Layout";
import Dashboard from "../pages/DashBoard";
import SignUp from "../pages/authantication/Signup";
import EmailVerify from "../pages/authantication/EmailVerify";
import Tasks from "../pages/task/Task";
import JoinMeeting from "../pages/Connection/JoinMeeting";
import Chat from "../pages/Connection/Chat";
import Meet from "../pages/Connection/Meet";
import JoinChat from "../pages/Connection/JoinChat";
import ForgetPass from "../pages/authantication/ForgetPass";

const Router = () => {
  return (
    <main  className='w-full min-h-screen bg-[#f3f4f6] '>

<Routes>
        <Route element={<Layout />}>
          <Route index path='/' element={<Navigate to='/dashboard' />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/tasks' element={<Tasks />} />
          <Route path='/completed/:status' element={<Tasks />} />
          <Route path='/in-progress/:status' element={<Tasks />} />
          <Route path='/todo/:status' element={<Tasks />} />
          <Route path='/team' element={<Team />} />
          <Route path='/trashed' element={<Trash />} />
          <Route path='/task/:id' element={<TaskDetails />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/chat/:roomId' element={<JoinChat />} />
          <Route path='/meet' element={<Meet />} />
          <Route path='/meet/:roomId' element={<JoinMeeting />} />
        </Route>

        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/verify-email' element={<EmailVerify />} />
        <Route path='/forget-pass' element={<ForgetPass />} />
      </Routes>

      <Toaster richColors />

    </main>
  );
};

export default Router;
