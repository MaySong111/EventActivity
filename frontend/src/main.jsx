// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  //</StrictMode>,
);

// 注释严格模式以避免 useEffect 双重调用, // 以防止对后端 API 的重复请求问题
// 但在开发环境中建议启用严格模式以帮助识别潜在问题
// 但是在实际 上线使用的项目(即生产环境)中, 是不会启用严格模式的
