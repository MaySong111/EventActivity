import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
// import useAuthStore from "../store/useAuthStore";

export default function Layout() {
  // const token = useAuthStore((state) => state.token);
  // console.log(
  //   "Layout, 会看到即使存储的有userInfo,token情况, 在没有重新获取local storage存储的值--赋值给zustand状态值的话, 那这个还是null",
  //   token
  // );

  // 方法2: 用persist后,这里就不需要initialize了,因为zustand会自动从local storage恢复状态
  // const token = useAuthStore((state) => state.token);
  // console.log("Layout, token:", token);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
