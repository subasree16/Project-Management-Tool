import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchDashboardSummary } from "../services/projectService";

function DashboardPage() {
  const { token, loading } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading || !token) {
      return;
    }

    const loadSummary = async () => {
      try {
        setError("");
        const data = await fetchDashboardSummary();
        setSummary(data);
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Failed to load dashboard");
      }
    };

    loadSummary();
  }, [loading, token]);

  if (loading || !token) {
    return <div className="screen-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="alert error">{error}</div>;
  }

  if (!summary) {
    return <div className="screen-center">Loading dashboard...</div>;
  }

  const stats = [
    {
      label: "Total Projects",
      value: summary.totals.totalProjects,
      detail: "Active portfolio count",
      tone: "neutral",
    },
    {
      label: "Completed Tasks",
      value: summary.totals.completedTasks,
      detail: "Execution closed successfully",
      tone: "positive",
    },
    {
      label: "Pending Tasks",
      value: summary.totals.pendingTasks,
      detail: "Work items still open",
      tone: "attention",
    },
    {
      label: "Overdue Tasks",
      value: summary.totals.overdueTasks,
      detail: "Immediate follow-up required",
      tone: "risk",
    },
  ];

  return (
    <div className="page-content">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">Execution Overview</span>
          <h1>Dashboard</h1>
          <p>Monitor output, project status, and upcoming deadlines without switching context.</p>
        </div>
        <Link className="primary-button inline-button" to="/projects">
          Open Projects
        </Link>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article className={`stat-card stat-card-${stat.tone}`} key={stat.label}>
            <div className="stat-card-top">
              <span>{stat.label}</span>
              <strong>{String(stat.value).padStart(2, "0")}</strong>
            </div>
            <p>{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <div className="surface-card">
          <div className="section-heading">
            <h2>Upcoming Deadlines</h2>
            <p>Tasks that need attention soon.</p>
          </div>

          {summary.upcomingDeadlines.length ? (
            <div className="deadline-list">
              {summary.upcomingDeadlines.map((task) => (
                <div className="deadline-item" key={task._id}>
                  <div>
                    <strong>{task.title}</strong>
                    <p>{new Date(task.deadline).toLocaleDateString()}</p>
                  </div>
                  <span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted-copy">No upcoming deadlines right now.</p>
          )}
        </div>

        <div className="surface-card">
          <div className="section-heading">
            <h2>Recent Projects</h2>
            <p>Quick access to active work.</p>
          </div>

          {summary.recentProjects.length ? (
            <div className="mini-project-list">
              {summary.recentProjects.map((project) => (
                <article className="mini-project-card" key={project._id}>
                  <div>
                    <strong>{project.title}</strong>
                    <p>{project.status}</p>
                  </div>
                  <div className="mini-project-actions">
                    <span>{project.metrics.progress}%</span>
                    <Link className="link-button mini-link" to={`/projects/${project._id}`}>
                      View
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="muted-copy">Create your first project to populate the dashboard.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
