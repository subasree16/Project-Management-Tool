import { useEffect, useState } from "react";
import Modal from "./Modal";

const initialState = {
  title: "",
  description: "",
  priority: "Medium",
  deadline: "",
  status: "Pending",
};

function TaskFormModal({ task, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Medium",
        deadline: task.deadline?.slice(0, 10) || "",
        status: task.status || "Pending",
      });
    } else {
      setFormData(initialState);
    }
  }, [task]);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Modal
      title={task ? "Edit Task" : "Add Task"}
      subtitle="Capture execution detail, urgency, and delivery status."
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
            <span>Priority</span>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>

          <label className="field">
            <span>Status</span>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </label>
        </div>

        <label className="field">
          <span>Deadline</span>
          <input name="deadline" type="date" value={formData.deadline} onChange={handleChange} required />
        </label>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Saving..." : task ? "Update Task" : "Add Task"}
        </button>
      </form>
    </Modal>
  );
}

export default TaskFormModal;

