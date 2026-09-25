import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const medicalIssues = [
  {
    issue_id: "MI1001",
    title: "Fever",
    description: "Customer reported fever and mild body pain.",
    category: "General Health",
    severity: "Low",
    status: "Open",
    customer_id: "HCID1001",
    reported_date: "2026-09-10"
  },
  {
    issue_id: "MI1002",
    title: "Chest Pain",
    description: "Customer reported occasional chest discomfort.",
    category: "Cardiology",
    severity: "High",
    status: "Under Review",
    customer_id: "HCID1002",
    reported_date: "2026-09-12"
  },
  {
    issue_id: "MI1003",
    title: "Headache",
    description: "Customer reported recurring headaches.",
    category: "General Health",
    severity: "Medium",
    status: "Open",
    customer_id: "HCID1003",
    reported_date: "2026-09-14"
  },
  {
    issue_id: "MI1004",
    title: "Back Pain",
    description: "Customer reported lower back pain.",
    category: "Orthopedic",
    severity: "Medium",
    status: "Resolved",
    customer_id: "HCID1004",
    reported_date: "2026-09-05"
  },
  {
    issue_id: "MI1005",
    title: "Diabetes Follow-up",
    description: "Customer requested information regarding diabetes follow-up.",
    category: "Diabetes",
    severity: "Medium",
    status: "Open",
    customer_id: "HCID1005",
    reported_date: "2026-09-15"
  },
  {
    issue_id: "MI1006",
    title: "Stomach Pain",
    description: "Customer reported stomach discomfort after meals.",
    category: "Gastroenterology",
    severity: "Low",
    status: "Open",
    customer_id: "HCID1001",
    reported_date: "2026-09-16"
  },
  {
    issue_id: "MI1007",
    title: "Allergy",
    description: "Customer reported skin irritation and itching.",
    category: "Allergy",
    severity: "Medium",
    status: "Under Review",
    customer_id: "HCID1006",
    reported_date: "2026-09-17"
  },
  {
    issue_id: "MI1008",
    title: "Migraine",
    description: "Customer reported severe recurring migraine symptoms.",
    category: "Neurology",
    severity: "High",
    status: "Open",
    customer_id: "HCID1007",
    reported_date: "2026-09-18"
  }
];

function createServer() {
  const server = new McpServer({
    name: "healthcare-medical-issue",
    version: "1.0.0"
  });

  server.tool(
    "get_medical_issue_details_by_id",
    "Get complete details of a medical issue using its issue ID.",
    {
      issue_id: z.string().describe("Medical issue ID, for example MI1001")
    },
    async ({ issue_id }) => {
      const issue = medicalIssues.find(
        item => item.issue_id === issue_id
      );

      if (!issue) {
        return {
          content: [
            {
              type: "text",
              text: `No medical issue found with ID ${issue_id}.`
            }
          ]
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(issue, null, 2)
          }
        ]
      };
    }
  );

  server.tool(
    "get_medical_issue_by_title",
    "Find medical issues using the medical issue title.",
    {
      title: z.string().describe("Medical issue title, for example Fever")
    },
    async ({ title }) => {
      const issues = medicalIssues.filter(
        item => item.title.toLowerCase() === title.toLowerCase()
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(issues, null, 2)
          }
        ]
      };
    }
  );

  server.tool(
    "get_list_medical_issues",
    "Get the complete list of available medical issues.",
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(medicalIssues, null, 2)
          }
        ]
      };
    }
  );

  server.tool(
    "get_customer_medical_issues",
    "Get all medical issues reported by a specific customer.",
    {
      customer_id: z.string().describe(
        "Customer ID, for example HCID1001"
      )
    },
    async ({ customer_id }) => {
      const issues = medicalIssues.filter(
        item => item.customer_id === customer_id
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(issues, null, 2)
          }
        ]
      };
    }
  );

  return server;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed",
      message: "MCP endpoint requires POST requests."
    });
  }

  try {
    const server = createServer();

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined
    });

    await server.connect(transport);

    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("MCP Error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message
      });
    }
  }
}