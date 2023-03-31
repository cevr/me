export async function allLimited<T>(tasks: (() => Promise<T>)[], concurrency: number): Promise<T[]> {
  if (concurrency <= 0) {
    throw new Error("Concurrency must be greater than 0.");
  }

  const results: T[] = [];
  let currentIndex = 0;

  const executeTask = async (): Promise<void> => {
    while (currentIndex < tasks.length) {
      const taskIndex = currentIndex;
      currentIndex++;

      try {
        results[taskIndex] = await tasks[taskIndex]();
      } catch (error) {
        console.error(`Error in task ${taskIndex}:`, error);
      }
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => executeTask());
  await Promise.all(workers);

  return results;
}
