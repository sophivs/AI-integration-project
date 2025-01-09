interface Task {
    id: number;
    text: string;
    summary: string | null;
    lang: string;
  }
  
  export class TasksRepository {
    private tasks: Task[] = [];
    private currentId: number = 1;
  
    createTask(task: { text: string; lang: string }): Task {
      const newTask: Task = {
        id: this.currentId++,
        text: task.text,
        lang: task.lang,
        summary: null,
      };
      this.tasks.push(newTask);
      return newTask;
    }
  
    updateTask(id: number, updates: Partial<Task>): Task | null {
      const task = this.tasks.find((t) => t.id === id);
      if (task) {
        Object.assign(task, updates);
        return task;
      }
      return null;
    }
  
    getTaskById(id: number): Task | null {
      return this.tasks.find((t) => t.id === id) || null;
    }
  
    getAllTasks(): Task[] {
      return this.tasks;
    }
  
    deleteTask(id: number): boolean {
      const initialLength = this.tasks.length;
      this.tasks = this.tasks.filter((t) => t.id !== id);
      return this.tasks.length < initialLength;
    }
  }
  