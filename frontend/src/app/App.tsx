import { Link, Route, Routes } from "react-router-dom";

import ChipLookupPage from "../pages/ChipLookupPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import PostCreatePage from "../pages/PostCreatePage";
import PostDetailPage from "../pages/PostDetailPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <Link to="/">LostCats</Link>
        </div>
        <nav className="nav">
          <Link to="/">Obiavi</Link>
          <Link to="/chip">Chip</Link>
          <Link to="/posts/new">Nova obqva</Link>
          <Link to="/login">Vhod</Link>
          <Link to="/register">Registraciya</Link>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/new" element={<PostCreatePage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/chip" element={<ChipLookupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}
