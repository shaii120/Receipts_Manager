"use client";

import { useState } from "react";
import ReceiptsTable from "@/components/ReceiptsTable/ReceiptsTable";
import AddReceiptForm from "@/components/ReceiptsTable/AddReceiptForm";
import { useProject } from "@/context/ProjectContext";

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { selectedProject } = useProject()
  const header = selectedProject ? ` (${selectedProject.name})` : ''

  function handleAdded() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1>{`Receipts List${header}`}</h1>
      <AddReceiptForm onAdded={handleAdded} />
      <ReceiptsTable key={refreshKey} />
    </main>
  );
}
