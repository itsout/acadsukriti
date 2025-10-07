"use client";
import React, { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { useOptionalClasses } from "@/hooks/zustand";

const Page = () => {
  return (
    <div className="w-full h-full  max-w-3xl px-4 mx-auto flex flex-col p-8  ">
      <div className="border-l-2 border-white/50 pl-5 ">
        <h2 className="text-lg text-white/70 mb-3">Optional Classes</h2>
        <p className="text-sm text-white/50 mb-4">
          Export your optional classes configuration to save it, or import a
          previously saved configuration.
        </p>
        <p className="text-sm text-red-300 mb-4">
          Note: Importing a configuration will overwrite your current
          configuration.
        </p>
        <OptionalClassesConfig />
      </div>
    </div>
  );
};

export default Page;

const OptionalClassesConfig = () => {
  const { exportConfig, importConfig } = useOptionalClasses();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    exportConfig();
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importConfig(content);
        setImportStatus(success ? "Import successful" : "Import failed");
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleExport}
          className="flex flex-1 bg-white/5 px-4 py-2 rounded-lg text-sm apply-border-sm items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-colors"
          title="Export optional classes configuration"
        >
          <Download className="w-5 h-5 text-blue-400" />
          <span className="text-white/70">Export</span>
        </button>
        <button
          onClick={handleImportClick}
          className="flex flex-1 bg-white/5 px-4 py-2 rounded-lg text-sm apply-border-sm items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-colors"
          title="Import optional classes configuration"
        >
          <Upload className="w-5 h-5 text-blue-400" />
          <span className="text-white/70">Import</span>
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      {importStatus && (
        <div
          className={`text-sm p-2 rounded-lg apply-border-sm text-center ${
            importStatus.includes("successful")
              ? "text-green-400 bg-green-500/10"
              : "text-red-400 bg-red-500/10"
          }`}
        >
          {importStatus}
        </div>
      )}
    </div>
  );
};
