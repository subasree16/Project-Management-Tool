import { Link } from "react-router-dom";

function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <article className="project-card">
      <span className={`status-pill ${project.status.toLowerCase().replace(/\s+/g, "-")}`}>
        {project.status}
      </span>

      <Link to={`/projects/${project._id}`} className="project-link">
        <h3>{project.title}</h3>
        <p>{project.description || "No project description added yet."}</p>
      </Link>

      <div className="progress-block">
        <div className="progress-label">
          <span>Progress</span>
          <strong>{project.metrics.progress}%</strong>
        </div>
        <div className="progress-bar">
          <span style={{ width: `${project.metrics.progress}%` }} />
        </div>
      </div>

      <div className="project-meta">
        <span>{project.metrics.totalTasks} tasks</span>
        <span>Deadline {new Date(project.deadline).toLocaleDateString()}</span>
      </div>

      <div className="card-topline">
        <button className="link-button" onClick={() => onEdit(project)}>
          Edit
        </button>
        <button className="link-button danger" onClick={() => onDelete(project._id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default ProjectCard;
