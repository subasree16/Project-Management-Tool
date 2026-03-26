import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import ProjectFormModal from "../components/ProjectFormModal";
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from "../services/projectService";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects({ search, status });
      setProjects(data);
      setError("");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [search, status]);

  const handleSaveProject = async (payload) => {
    try {
      setSaving(true);

      if (selectedProject) {
        await updateProject(selectedProject._id, payload);
      } else {
        await createProject(payload);
      }

      setShowModal(false);
      setSelectedProject(null);
      await loadProjects();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm("Delete this project and all its tasks?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteProject(projectId);
      await loadProjects();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to delete project");
    }
  };

  return (
    <div className="page-content">
      <section className="page-toolbar">
        <div>
          <h1>Projects</h1>
          <p>Plan, track, and update delivery timelines across all active work.</p>
        </div>
        <button
          className="primary-button inline-button"
          onClick={() => {
            setSelectedProject(null);
            setShowModal(true);
          }}
        >
          New Project
        </button>
      </section>

      <section className="filter-bar">
        <input
          type="text"
          placeholder="Search projects"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>All</option>
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </section>

      {error ? <div className="alert error">{error}</div> : null}

      {loading ? (
        <div className="screen-center">Loading projects...</div>
      ) : projects.length ? (
        <section className="project-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={(item) => {
                setSelectedProject(item);
                setShowModal(true);
              }}
              onDelete={handleDeleteProject}
            />
          ))}
        </section>
      ) : (
        <div className="empty-state">No projects match the current filters.</div>
      )}

      {showModal ? (
        <ProjectFormModal
          project={selectedProject}
          onClose={() => {
            setShowModal(false);
            setSelectedProject(null);
          }}
          onSubmit={handleSaveProject}
          loading={saving}
        />
      ) : null}
    </div>
  );
}

export default ProjectsPage;

