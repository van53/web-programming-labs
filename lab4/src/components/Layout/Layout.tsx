import { NavLink, Outlet } from "react-router-dom";
// @ts-ignore
import styles from "./Layout.module.css";

export default function Layout() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.logo}>📋 Task Manager</span>
        <nav className={styles.nav}>
          <NavLink to="/tasks" end className={navLinkClass}>
            Всі задачі
          </NavLink>
          <NavLink to="/tasks/new" className={navLinkClass}>
            + Нова задача
          </NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}