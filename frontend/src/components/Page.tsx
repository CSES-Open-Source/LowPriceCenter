import React from "react";
import { Outlet } from "react-router-dom";
import { HeaderBar } from "src/components/HeaderBar";
import styles from "src/components/Page.module.css";

export interface PageProps {
  children: React.ReactNode;
}

export const Page = () => {
  return (
    <div className={styles.page}>
      <HeaderBar />
      <div className={styles.contentWrapper}>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
