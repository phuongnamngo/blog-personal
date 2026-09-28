import { Route, Routes } from "react-router-dom";
import PostList from "./pages/PostList";
import PostDetail from "./pages/PostDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PostList />} />
      <Route path="/posts/:slug" element={<PostDetail />} />
    </Routes>
  );
}

export default App;
