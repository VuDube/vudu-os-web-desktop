const getWorkerBaseUrl = (): string => {
  // This will be set as an environment variable in Cloudflare Pages
  const envUrl = import.meta.env.VITE_WORKER_URL;
  if (envUrl) return envUrl;
  
  // Fallback for development - replace with your actual Worker URL
  return 'https://vudu-api.your-subdomain.workers.dev';
};

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const baseUrl = getWorkerBaseUrl();
    const url = `${baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  // File operations - connect to your deployed /api/storage Worker
  files: {
    list: (path: string = '/') => 
      apiClient.request(`/files?path=${encodeURIComponent(path)}`),
    
    upload: (formData: FormData) => 
      fetch(`${getWorkerBaseUrl()}/files/upload`, {
        method: 'POST',
        body: formData,
      }),
    
    createFolder: (name: string, path: string = '/') =>
      apiClient.request('/files/folder', {
        method: 'POST',
        body: JSON.stringify({ name, path }),
      }),
  },

  // AI operations - connect to your deployed /api/ai Worker
  ai: {
    processFile: (fileId: string, filePath: string, fileType: string) =>
      apiClient.request('/ai/process-file', {
        method: 'POST',
        body: JSON.stringify({ file_id: fileId, file_path: filePath, file_type: fileType }),
      }),
    
    executeWorkflow: (workflowId: string, triggerData: any) =>
      apiClient.request('/ai/workflow/execute', {
        method: 'POST',
        body: JSON.stringify({ workflow_id: workflowId, trigger_data: triggerData }),
      }),
  },

  // Auth operations - connect to your deployed /api/auth Worker
  auth: {
    login: (email: string, password: string) =>
      apiClient.request('/auth/session', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    register: (email: string, password: string, userMetadata?: any) =>
      apiClient.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, user_metadata: userMetadata }),
      }),
  }
};