import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium tracking-wide transition-colors hover:text-pp-gold ${
    isActive ? 'text-pp-gold' : 'text-slate-200'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-pp-navy-3 bg-pp-navy/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-baseline gap-1">
          <span className="text-xl font-extrabold tracking-tight text-white">Power</span>
          <span className="text-xl font-extrabold tracking-tight text-pp-gold">Palazzo</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/chat" className={navLinkClass}>
            Ask Us
          </NavLink>
          {user ? (
            <>
              <NavLink to="/staff/sales-chat" className={navLinkClass}>
                Sales Assistant
              </NavLink>
              <NavLink to="/staff/stock" className={navLinkClass}>
                Stock Management
              </NavLink>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden text-sm text-slate-300 sm:inline">
                {user.name} <span className="text-pp-gold">({user.role})</span>
              </span>
              <button
                onClick={logout}
                className="rounded-md border border-pp-navy-4 px-3 py-1.5 text-sm text-slate-200 transition-colors hover:border-pp-gold hover:text-pp-gold"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/staff/login"
              className="rounded-md bg-pp-gold px-4 py-1.5 text-sm font-semibold text-pp-navy transition-colors hover:bg-pp-gold-2"
            >
              Staff Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
