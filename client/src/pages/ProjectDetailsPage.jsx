import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TaskColumn from "../components/TaskColumn";
import TaskFormModal from "../components/TaskFormModal";
import { fetchProject } from "../services/projectService";
import { createTask, deleteTask, updateTask } from "../services/taskService";

function ProjectDetailsPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProject = async () => {
    try {
      const data = await fetchProject(projectId);
      setProject(data);
      setError("");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to load project");
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const groupedTasks = useMemo(() => {
    const tasks = project?.tasks || [];

    return {
      Pending: tasks.filter((task) => task.status === "Pending"),
      "In Progress": tasks.filter((task) => task.status === "In Progress"),
      Done: tasks.filter((task) => task.status === "Done"),
    };
  }, [project]);

  const handleSaveTask = async (payload) => {
    try {
      setSaving(true);

      if (selectedTask) {
        await updateTask(selectedTask._id, payload);
      } else {
        await createTask(projectId, payload);
      }

      setShowTaskModal(false);
      setSelectedTask(null);
      await loadProject();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to save task");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm("Delete this task?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(taskId);
      await loadProject();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to delete task");
    }
  };

  const handleDropTask = async (taskId, status) => {
    const task = project.tasks.find((item) => item._id === taskId);
    if (!task || task.status === status) {
      return;
    }

    try {
      await updateTask(taskId, { status });
      await loadProject();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to update task status");
    }
  };

  if (error && !project) {
    return <div className="alert error">{error}</div>;
  }

  if (!project) {
    return <div className="screen-center">Loading project...</div>;
  }

  const overdueTasks = project.tasks.filter(
    (task) => task.status !== "Done" && new Date(task.deadline) < new Date()
  );

  return (
    <div className="page-content">
      <Link className="back-link" to="/projects">
        Back to Projects
      </Link>

      <section className="details-hero">
        <div>
          <span className={`status-pill ${project.status.toLowerCase().replace(/\s+/g, "-")}`}>
            {project.status}
          </span>
          <h1>{project.title}</h1>
          <p>{project.description || "No description added for this project yet."}</p>
        </div>

        <div className="hero-actions">
          <button
            className="primary-button inline-button"
            onClick={() => {
              setSelectedTask(null);
              setShowTaskModal(true);
            }}
          >
            Add Task
          </button>
        </div>
      </section>

      {error ? <div className="alert error">{error}</div> : null}

      <section className="detail-stats">
        <article className="surface-card detail-card">
          <div className="detail-card-top">
            <span>Project Progress</span>
            <strong>{project.metrics.progress}%</strong>
          </div>
          <p className="muted-copy">Completion based on finished tasks in this project.</p>
          <div className="progress-bar large">
            <span style={{ width: `${project.metrics.progress}%` }} />
          </div>
        </article>

        <article className="surface-card detail-card">
          <div className="detail-card-top">
            <span>Total Tasks</span>
            <strong>{project.metrics.totalTasks}</strong>
          </div>
          <p className="muted-copy">
            {project.metrics.completedTasks} completed / {project.metrics.pendingTasks} pending
          </p>
        </article>

        <article className="surface-card detail-card">
          <div className="detail-card-top">
            <span>Schedule</span>
            <strong>{new Date(project.deadline).toLocaleDateString()}</strong>
          </div>
          <p className="muted-copy">Started {new Date(project.startDate).toLocaleDateString()}</p>
        </article>
      </section>

      {overdueTasks.length ? (
        <div className="alert warning">{overdueTasks.length} overdue tasks need attention.</div>
      ) : null}

      <section className="kanban-grid">
        <TaskColumn
          title="Pending"
          status="Pending"
          tasks={groupedTasks.Pending}
          onEdit={(task) => {
            setSelectedTask(task);
            setShowTaskModal(true);
          }}
          onDelete={handleDeleteTask}
          onDropTask={handleDropTask}
        />
        <TaskColumn
          title="In Progress"
          status="In Progress"
          tasks={groupedTasks["In Progress"]}
          onEdit={(task) => {
            setSelectedTask(task);
            setShowTaskModal(true);
          }}
          onDelete={handleDeleteTask}
          onDropTask={handleDropTask}
        />
        <TaskColumn
          title="Done"
          status="Done"
          tasks={groupedTasks.Done}
          onEdit={(task) => {
            setSelectedTask(task);
            setShowTaskModal(true);
          }}
          onDelete={handleDeleteTask}
          onDropTask={handleDropTask}
        />
      </section>

      {showTaskModal ? (
        <TaskFormModal
          task={selectedTask}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onSubmit={handleSaveTask}
          loading={saving}
        />
      ) : null}
    </div>
  );
}

export default ProjectDetailsPage;
