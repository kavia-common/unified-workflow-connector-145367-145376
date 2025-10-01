"use client";
import Link from "next/link";
import { Card } from "@/components/common/UI";

export default function ConnectIndexPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Connect Your Tools</h1>
        <p className="text-sm text-gray-500 mt-1">
          Use the options below to connect to JIRA or Confluence and begin exploring projects and spaces.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="JIRA" subtitle="Verify credentials and view projects.">
          <Link className="text-blue-700 hover:underline" href="/connect/jira">
            Go to JIRA connection →
          </Link>
        </Card>
        <Card title="Confluence" subtitle="Verify credentials and view spaces.">
          <Link className="text-blue-700 hover:underline" href="/connect/confluence">
            Go to Confluence connection →
          </Link>
        </Card>
      </div>
    </div>
  );
}
