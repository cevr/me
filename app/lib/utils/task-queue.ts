export class TaskQueue {
  private queue: Map<string, () => Promise<void>> = new Map();
  private isProcessing: boolean = false;

  async add(id: string, task: () => Promise<void>): Promise<void> {
    if (this.queue.has(id)) {
      console.log(`Task with id "${id}" is already in the queue.`);
      return;
    }
    this.queue.set(id, task);
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;
    while (this.queue.size > 0) {
      const [id, task] = this.queue.entries().next().value;
      await task();
      this.queue.delete(id);
    }
    this.isProcessing = false;
  }
}
