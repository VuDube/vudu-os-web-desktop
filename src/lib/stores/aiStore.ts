import { writable, derived } from 'svelte/store';
import { apiClient } from '$lib/utils/api';

interface AIWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: 'file_upload' | 'schedule' | 'manual';
  steps: WorkflowStep[];
  enabled: boolean;
}

interface WorkflowStep {
  id: string;
  type: 'ai_processing' | 'file_operation' | 'notification';
  config: Record<string, any>;
}

interface AIState {
  workflows: AIWorkflow[];
  activeProcesses: string[];
  isProcessing: boolean;
}

const createAIStore = () => {
  const { subscribe, update, set } = writable<AIState>({
    workflows: [],
    activeProcesses: [],
    isProcessing: false
  });

  return {
    subscribe,
    
    // Process file with AI - integrates with your deployed AI Worker
    processFile: async (fileId: string, filePath: string, fileType: string) => {
      update(state => ({ ...state, isProcessing: true }));
      try {
        const result = await apiClient.ai.processFile(fileId, filePath, fileType);
        
        // Auto-tagging workflow: Suggest organization based on AI analysis
        if (result.analysis?.tags) {
          console.log('AI suggested tags:', result.analysis.tags);
          // This could trigger a notification to organize files
        }
        
        return result;
      } catch (error) {
        console.error('AI processing failed:', error);
        throw error;
      } finally {
        update(state => ({ ...state, isProcessing: false }));
      }
    },

    // Execute autonomous workflow
    executeWorkflow: async (workflowId: string, triggerData: any) => {
      try {
        const result = await apiClient.ai.executeWorkflow(workflowId, triggerData);
        
        // Handle multi-step results
        result.results.forEach((stepResult: any) => {
          if (stepResult.result.output) {
            console.log(`Workflow step ${stepResult.step} completed:`, stepResult.result.output);
          }
        });
        
        return result;
      } catch (error) {
        console.error('Workflow execution failed:', error);
        throw error;
      }
    },

    // Contextual app launching based on file content
    suggestAppLaunch: (fileName: string, fileType: string) => {
      const suggestions = [];
      
      if (fileType.includes('spreadsheet') || fileName.includes('budget') || fileName.includes('finance')) {
        suggestions.push({ app: 'vudusheets', reason: 'Open in spreadsheet editor' });
      }
      
      if (fileType.includes('text') || fileName.includes('note') || fileName.includes('meeting')) {
        suggestions.push({ app: 'vuduedit', reason: 'Open in text editor' });
      }
      
      if (fileType.includes('code') || fileName.includes('.js') || fileName.includes('.ts')) {
        suggestions.push({ app: 'vuducode', reason: 'Open in code editor' });
      }
      
      return suggestions;
    }
  };
};

export const aiStore = createAIStore();