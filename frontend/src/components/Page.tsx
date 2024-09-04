import React from "react";
import { HeaderBar } from "src/components/HeaderBar";
import styles from "src/components/Page.module.css";

export interface PageProps {
  children: React.ReactNode;
}

export const Page = ({ children }: PageProps) => {
  return (
    <div className={styles.page}>
      <HeaderBar />
      <div className={styles.contentWrapper}>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};
