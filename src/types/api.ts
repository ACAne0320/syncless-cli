// === Content blocks ===

export interface TextContentBlock {
  type: "text";
  text: string;
}

export interface ToolUseContentBlock {
  type: "tool_use";
  name: string;
  input: unknown;
}

export interface ToolResultContentBlock {
  type: "tool_result";
  content: unknown;
}

export type ContentBlock =
  | TextContentBlock
  | ToolUseContentBlock
  | ToolResultContentBlock;

// === Pagination ===

export interface PaginationParams {
  index?: number;
  pageSize?: number;
}

// === Projects ===

export interface Project {
  projectId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListProjectsResponse {
  projects: Project[];
}

// === Tasks ===

export interface Task {
  id: string;
  title: string;
}

export interface ListTasksResponse {
  tasks: Task[];
}

export interface GetTaskResponse {
  task: Task;
}

export interface TaskMessage {
  role: string;
  content: string | ContentBlock[];
}

export interface ListTaskMessagesResponse {
  ok: boolean;
  taskId: string;
  messages: TaskMessage[];
}

export interface SendPromptResponse {
  ok: boolean;
}

// === Personal Tasks ===

export interface CreatePersonalTaskResponse {
  ok: boolean;
  task: Task;
}

// === Templates ===

export interface Template {
  id: string;
  workspaceId: string;
  createdByUserId: string;
  name: string;
  graph: unknown;
}

export interface ListTemplatesResponse {
  templates: Template[];
}

export interface CreateProjectFromTemplateRequest {
  name: string;
  nodes: Record<string, string>;
}

export interface CreateProjectFromTemplateResponse {
  ok: boolean;
  pipelineId: string;
  tasks: unknown[];
  taskDependencies: unknown[];
}

// === Create Project Task ===

export interface CreateProjectTaskRequest {
  blocks: ContentBlock[];
  upstream_task_id?: string;
}

export interface CreateProjectTaskResponse {
  ok: boolean;
  task: Task & { upstreamTaskId?: string };
}

// === Users ===

export interface User {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
}

export interface ListUsersResponse {
  users: User[];
}

// === Errors ===

export interface ApiError {
  error: string;
  details?: {
    code?: string;
  };
}
