export default function Navbar({ setView }) {
  return (
    <header>
      <nav className="container navbar">
        <img
          src="./images/svg/logo.svg"
          className="logo"
          onClick={() => setView("portfolio")}
        />

        <ul className="nav-links">
          <li onClick={() => setView("portfolio")}>Home</li>
          <li onClick={() => setView("blog")}>Blog</li>
          <li onClick={() => setView("admin")} style={{ opacity: 0.3 }}>
            Admin
          </li>
        </ul>
      </nav>
    </header>
  );
}