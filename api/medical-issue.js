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

module.exports = async (req, res) => {
  const {
    action,
    issue_id,
    title,
    customer_id
  } = req.query;

  try {

    // Get issue by ID
    if (action === "get_medical_issue_details_by_id") {
      const issue = medicalIssues.find(
        item => item.issue_id === issue_id
      );

      if (!issue) {
        return res.status(404).json({
          error: "Medical issue not found"
        });
      }

      return res.status(200).json(issue);
    }

    // Get issue by title
    if (action === "get_medical_issue_by_title") {
      const issues = medicalIssues.filter(
        item => item.title.toLowerCase() === title?.toLowerCase()
      );

      return res.status(200).json(issues);
    }

    // Get all medical issues
    if (action === "get_list_medical_issues") {
      return res.status(200).json(medicalIssues);
    }

    // Get customer's medical issues
    if (action === "get_customer_medical_issues") {
      const issues = medicalIssues.filter(
        item => item.customer_id === customer_id
      );

      return res.status(200).json(issues);
    }

    return res.status(400).json({
      error: "Invalid action"
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};