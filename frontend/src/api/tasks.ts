import { get, handleAPIError, post } from "src/api/requests";

import type { APIResult } from "src/api/requests";

/**
 * Defines the "shape" of a Task object (what fields are present and their types) for
 * frontend components to use. This will be the return type of most functions in this
 * file.
 */
export interface Task {
  _id: string;
  title: string;
  description?: string;
  isChecked: boolean;
  dateCreated: Date;
}

/**
 * Defines the shape of JSON that we'll receive from the backend when we ask the API
 * for a Task object. That is, when the backend sends us a JSON object representing a
 * Task, we expect it to match these fields and types.
 *
 * The difference between this type and `Task` above is that `dateCreated` is a string
 * instead of a Date object. This is because JSON doesn't support Dates, so we use a
 * date-formatted string in requests and responses.
 */
interface TaskJSON {
  _id: string;
  title: string;
  description?: string;
  isChecked: boolean;
  dateCreated: string;
}

/**
 * Converts a Task from JSON that only contains primitive types to our custom
 * Task interface.
 *
 * @param task The JSON representation of the task
 * @returns The parsed Task object
 */
function parseTask(task: TaskJSON): Task {
  return {
    _id: task._id,
    title: task.title,
    description: task.description,
    isChecked: task.isChecked,
    dateCreated: new Date(task.dateCreated),
  };
}

/**
 * The expected inputs when we want to create a new Task object. In the MVP, we only
 * need to provide the title and optionally the description, but in the course of
 * this tutorial you'll likely want to add more fields here.
 */
export interface CreateTaskRequest {
  title: string;
  description?: string;
}

/**
 * The expected inputs when we want to update an existing Task object. Similar to
 * `CreateTaskRequest`.
 */
export interface UpdateTaskRequest {
  _id: string;
  title: string;
  description?: string;
  isChecked: boolean;
  dateCreated: Date;
}

/**
 * The implementations of these API client functions are provided as part of the
 * MVP. You can use them as a guide for writing the other client functions.
 */
export async function createTask(task: CreateTaskRequest): Promise<APIResult<Task>> {
  try {
    const response = await post("/api/task", task);
    const json = (await response.json()) as TaskJSON;
    return { success: true, data: parseTask(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getTask(id: string): Promise<APIResult<Task>> {
  try {
    const response = await get(`/api/task/${id}`);
    const json = (await response.json()) as TaskJSON;
    return { success: true, data: parseTask(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}
