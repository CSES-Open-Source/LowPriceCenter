import { useState } from "react";
import { createTask } from "src/api/tasks";
import { Button, TextField } from "src/components";
import styles from "src/components/TaskForm.module.css";

import type { Task } from "src/api/tasks";

export interface TaskFormProps {
  mode: "create" | "edit";
  task?: Task;
  onSubmit?: (task: Task) => void;
}

/**
 * A simple way to handle error states in the form. We'll keep a
 * `TaskFormErrors` object in the form's state, initially empty. Before we
 * submit a request, we'll check each field for problems. For each invalid
 * field, we set the corresponding field in the errors object to true, and the
 * corresponding input component will show its error state if the field is true.
 * Look at where the `errors` object appears below for demonstration.
 *
 * In the MVP, the only possible error in this form is that the title is blank,
 * so this is slightly overengineered. However, a more complex form would need
 * a similar system.
 */
interface TaskFormErrors {
  title?: boolean;
}

/**
 * The form that creates or edits a Task object. In the MVP, this is only
 * capable of creating Tasks.
 *
 * @param props.mode Controls how the form renders and submits
 * @param props.task Optional initial data to populate the form with (such as
 * when we're editing an existing task)
 * @param props.onSubmit Optional callback to run after the user submits the
 * form and the request succeeds
 */
export function TaskForm({ mode, task, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState<string>(task?.title || "");
  const [description, setDescription] = useState<string>(task?.description || "");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<TaskFormErrors>({});

  const handleSubmit = () => {
    // first, do any validation that we can on the frontend
    setErrors({});
    if (title.length === 0) {
      setErrors({ title: true });
      return;
    }
    setLoading(true);
    createTask({ title, description })
      .then((result) => {
        if (result.success) {
          // clear the form
          setTitle("");
          setDescription("");
          // only call onSubmit if it's NOT undefined
          if (onSubmit) onSubmit(result.data);
        } else {
          // You should always clearly inform the user when something goes wrong.
          // In this case, we're just doing an `alert()` for brevity, but you'd
          // generally want to show some kind of error state or notification
          // within your UI. If the problem is with the user's input, then use
          // the error states of your smaller components (like the `TextField`s).
          // If the problem is something we don't really control, such as network
          // issues or an unexpected exception on the server side, then use a
          // banner, modal, popup, or similar.
          alert(result.error);
        }
        setLoading(false);
      })
      .catch((reason) => alert(reason));
  };

  const formTitle = mode === "create" ? "New task" : "Edit task";

  return (
    <form className={styles.form}>
      {/* we could just use a `<div>` element because we don't need the special
      functionality that browsers give to `<form>` elements, but using `<form>`
      is better for accessibility because it's more accurate for this purpose--
      we are making a form, so we should use `<form>` */}
      <span className={styles.formTitle}>{formTitle}</span>
      <div className={styles.formRow}>
        {/* `data-testid` is used by React Testing Library--see the tests in
        `TaskForm.test.tsx` */}
        <TextField
          className={styles.textField}
          data-testid="task-title-input"
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={errors.title}
        />
        <TextField
          className={`${styles.textField} ${styles.stretch}`}
          data-testid="task-description-input"
          label="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        {/* set `type="primary"` on the button so the browser doesn't try to
        handle it specially (because it's inside a `<form>`) */}
        <Button
          kind="primary"
          type="button"
          data-testid="task-save-button"
          label="Save"
          disabled={isLoading}
          onClick={handleSubmit}
        />
      </div>
    </form>
  );
}
