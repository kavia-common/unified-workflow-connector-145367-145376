"use client";
import React, { useState } from "react";
import { apiRequest, ApiError } from "@/utils/api";
import { Card, Button, Input, StatusBanner } from "@/components/common/UI";
import Link from "next/link";

type JiraProject = {
  id: string;
  key: string;
  name: string;
};

type ConnectResponse = {
  status: "connected" | "verified" | "ok";
  message?: string;
};

export default function JiraConnectPage() {
  const [baseUrl, setBaseUrl] = useState("");
  const [email, setEmail] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [projects, setProjects] = useState<JiraProject[] | null>(null);
  const [verified, setVerified] = useState(false);

  const validate = () => {
    if (!baseUrl || !email || !apiToken) {
      setErrorMsg("Please provide Base URL, User Email, and API Token.");
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const onConnect = async () => {
    if (!validate()) return;
    setLoading(true);
    setStatusMsg(null);
    setProjects(null);
    try {
      const res = await apiRequest<ConnectResponse>("/api/v1/connect/jira", {
        method: "POST",
        body: { base_url: baseUrl, email, api_token: apiToken },
      });
      setVerified(true);
      setStatusMsg(res?.message || "JIRA credentials verified successfully.");
      // Fetch projects upon success
      const proj = await apiRequest<JiraProject[]>("/api/v1/projects/jira", { method: "GET" });
      setProjects(proj);
    } catch (e) {
      const err = e as ApiError;
      setVerified(false);
      setErrorMsg(err.message || "Failed to connect to JIRA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Connect to JIRA</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter your JIRA credentials to verify the connection and view available projects.
        </p>
      </div>

      <Card title="JIRA Credentials" subtitle="We only use these to authenticate with your JIRA instance.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Base URL" placeholder="https://your-domain.atlassian.net" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
          <Input label="User Email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="API Token" type="password" placeholder="••••••••" value={apiToken} onChange={(e) => setApiToken(e.target.value)} />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={onConnect} loading={loading}>Connect & Verify</Button>
          <Link href="/connect/confluence" className="text-sm text-blue-700 hover:underline">Connect Confluence instead</Link>
        </div>
        <div className="mt-4 space-y-3">
          {statusMsg && <StatusBanner type="success" title="Verified" message={statusMsg} onClose={() => setStatusMsg(null)} />}
          {errorMsg && <StatusBanner type="error" title="Connection Error" message={errorMsg} onClose={() => setErrorMsg(null)} />}
        </div>
      </Card>

      <div className="mt-8">
        <Card title="JIRA Projects" subtitle={verified ? "Select from your available projects." : "Projects will appear after a successful connection."}>
          {!verified && <p className="text-sm text-gray-500">No projects to display yet.</p>}
          {verified && projects === null && (
            <p className="text-sm text-gray-500">Loading projects...</p>
          )}
          {verified && projects && projects.length === 0 && (
            <p className="text-sm text-gray-500">No projects found.</p>
          )}
          {verified && projects && projects.length > 0 && (
            <ul className="divide-y divide-gray-100">
              {projects.map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">Key: {p.key}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">ID: {p.id}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
