import { useEffect, useState } from "react";
import Modal from "./Modal";

const initialState = {
  title: "",
  description: "",
  startDate: "",
  deadline: "",
  status: "Not Started",
};

function ProjectFormModal({ project, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        startDate: project.startDate?.slice(0, 10) || "",
        deadline: project.deadline?.slice(0, 10) || "",
        status: project.status || "Not Started",
      });
    } else {
      setFormData(initialState);
    }
  }, [project]);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Modal
      title={project ? "Edit Project" : "Create Project"}
      subtitle="Keep delivery scope, timing, and execution status current."
      onClose={onClose}
    >
      <form className="modal-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Title</span>
          <input name="title" value={formData.title} onChange={handleChange} required />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange} />
        </label>

        <div className="grid-two">
          <label className="field">
            <span>Start Date</span>
            <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
          </label>

          <label className="field">
            <span>Deadline</span>
            <input name="deadline" type="date" value={formData.deadline} onChange={handleChange} required />
          </label>
        </div>

        <label className="field">
          <span>Status</span>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </label>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Saving..." : project ? "Update Project" : "Create Project"}
        </button>
      </form>
    </Modal>
  );
}

export default ProjectFormModal;

