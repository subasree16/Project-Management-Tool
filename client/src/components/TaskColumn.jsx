function TaskColumn({ title, status, tasks, onEdit, onDelete, onDropTask }) {
  return (
    <section
      className="task-column"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const taskId = event.dataTransfer.getData("taskId");
        if (taskId) {
          onDropTask(taskId, status);
        }
      }}
    >
      <div className="task-column-header">
        <h3>{title}</h3>
        <span>{tasks.length}</span>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? <div className="task-empty-state">Drop tasks here or add a new task.</div> : null}

        {tasks.map((task) => {
          const isOverdue = task.status !== "Done" && new Date(task.deadline) < new Date();

          return (
            <article
              key={task._id}
              className={`task-card ${isOverdue ? "overdue" : ""}`}
              draggable
              onDragStart={(event) => event.dataTransfer.setData("taskId", task._id)}
            >
              <div className="task-card-header">
                <strong>{task.title}</strong>
                <span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
              </div>
              <p>{task.description || "No task description provided."}</p>
              <div className="task-card-meta">
                <span>Due {new Date(task.deadline).toLocaleDateString()}</span>
                <span>{task.assignedTo?.name || "Self"}</span>
              </div>
              <div className="task-card-footer">
                <div>{isOverdue ? <div className="mini-alert">Overdue</div> : null}</div>
                <div className="task-card-actions">
                  <button className="link-button" onClick={() => onEdit(task)}>
                    Edit
                  </button>
                  <button className="link-button danger" onClick={() => onDelete(task._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default TaskColumn;
