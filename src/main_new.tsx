import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import { Capacitor } from "@capacitor/core";
import {
  CapacitorSQLite,
  SQLiteConnection,
} from "@capacitor-community/sqlite";
import { JeepSqlite } from "jeep-sqlite/dist/components/jeep-sqlite";

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const platform = Capacitor.getPlatform();

    if (platform === "web") {
      const sqlite = new SQLiteConnection(CapacitorSQLite);

      customElements.define("jeep-sqlite", JeepSqlite);
      const jeepSqliteEl = document.createElement("jeep-sqlite");
      document.body.appendChild(jeepSqliteEl);

      await customElements.whenDefined("jeep-sqlite");
      console.log("Jeep SQLite custom element defined.");

      await sqlite.initWebStore();
      console.log("Web store initialized successfully.");
    } else {
      console.log("Not running on the web platform.");
    }

    const container = document.getElementById("root");
    if (!container) {
      throw new Error("Root container not found");
    }
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Initialization error:", error);
  }
});
