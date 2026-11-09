"use client";

import React, { useState, useEffect } from "react";
import { Header, TabType } from "@/components/Header";
import { ProposalTab } from "@/components/ProposalTab";
import { AuditTab } from "@/components/AuditTab";
import { DocumentTab } from "@/components/DocumentTab";
import { DashboardTab } from "@/components/DashboardTab";
import { Disclosure } from "@/components/Disclosure";
import { Footer } from "@/components/Footer";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Toast, ToastMessage } from "@/components/Toast";
import { api } from "@/lib/api";
import { ApiStatus } from "@/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("proposal");
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  // Global Loading & Toast State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingKind, setLoadingKind] = useState<
    "proposal" | "audit" | "document" | null
  >(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "info") => {
    setToast({ id: Date.now(), text, type });
  };

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const res = await api.checkStatus();
        setStatus(res);
      } catch {
        setStatus({ ai_configured: false, model: "Tidak Terhubung" });
      } finally {
        setStatusLoading(false);
      }
    };
    checkServerStatus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        status={status}
        statusLoading={statusLoading}
      />

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {activeTab === "proposal" && (
          <ProposalTab
            onGenerate={async (data) => {
              setIsLoading(true);
              setLoadingKind("proposal");
              try {
                const res = await api.generateProposal(data);
                return res.record;
              } finally {
                setIsLoading(false);
                setLoadingKind(null);
              }
            }}
            onSuccess={(msg) => showToast(msg, "success")}
            onError={(msg) => showToast(msg, "error")}
          />
        )}

        {activeTab === "audit" && (
          <AuditTab
            onAudit={async (data) => {
              setIsLoading(true);
              setLoadingKind("audit");
              try {
                const res = await api.auditBudget(data);
                return res.record;
              } finally {
                setIsLoading(false);
                setLoadingKind(null);
              }
            }}
            onSuccess={(msg) => showToast(msg, "success")}
            onError={(msg) => showToast(msg, "error")}
          />
        )}

        {activeTab === "document" && (
          <DocumentTab
            onGenerate={async (data) => {
              setIsLoading(true);
              setLoadingKind("document");
              try {
                const res = await api.generateDoc(data);
                return res.record;
              } finally {
                setIsLoading(false);
                setLoadingKind(null);
              }
            }}
            onSuccess={(msg) => showToast(msg, "success")}
            onError={(msg) => showToast(msg, "error")}
          />
        )}

        {activeTab === "dashboard" && (
          <DashboardTab
            onLoadHistory={async () => {
              return await api.getHistory();
            }}
            onGetDetail={async (type, id) => {
              const res = await api.getHistoryItem(type, id);
              return res.record;
            }}
            onDeleteItem={async (type, id) => {
              await api.deleteHistoryItem(type, id);
            }}
            onSuccess={(msg) => showToast(msg, "success")}
            onError={(msg) => showToast(msg, "error")}
          />
        )}
      </main>

      {/* AI & Tech Disclosure */}
      <Disclosure />

      {/* Footer */}
      <Footer />

      {/* Loading Overlay */}
      <LoadingOverlay isLoading={isLoading} kind={loadingKind} />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
