import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ListPage from "./pages/ListPage.jsx";
import NewPage from "./pages/NewPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import EditPage from "./pages/EditPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <header className="header">
        <div className="container headerRow">
          <Link className="brand" to="/">Tracker</Link>
          <nav className="nav">
            <Link to="/">Items</Link>
            <Link to="/new" className="btn">New Item</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/new" element={<NewPage />} />
          <Route path="/items/:id" element={<DetailPage />} />
          <Route path="/items/:id/edit" element={<EditPage />} />
          <Route path="*" element={<div className="card">Not found.</div>} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container subtle">
          CIT 382 Starter • React + Express
        </div>
      </footer>
    </BrowserRouter>
  );
}
