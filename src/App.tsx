import { useState, useEffect, FormEvent, ChangeEvent } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

type Filter = "all" | "active" | "completed";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const itemsLeft = tasks.filter((task) => !task.completed).length;

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedFilter = localStorage.getItem("filter");
    const storedTitle = localStorage.getItem("newTaskTitle");

    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch {
        console.error("Invalid tasks data in localStorage");
      }
    }

    if (
      storedFilter === "all" ||
      storedFilter === "active" ||
      storedFilter === "completed"
    ) {
      setFilter(storedFilter);
    }

    if (storedTitle) {
      setNewTaskTitle(storedTitle);
    }
  }, []);

  useEffect(() => {
    console.log("Saving to localStorage:", { tasks, filter, newTaskTitle });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("filter", filter);
    localStorage.setItem("newTaskTitle", newTaskTitle);
  }, [tasks, filter, newTaskTitle]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-stone-200 px-4">
      <h1 className="mt-10 text-[100px] font-semibold text-yellow-700">
        todos
      </h1>

      <div className="w-full max-w-md">
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="What needs to be done?"
            className="icon w-full border border-stone-400 p-3 px-16 text-lg italic focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            value={newTaskTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewTaskTitle(e.target.value)
            }
          />
        </form>

        <div className="w-full border border-stone-400 bg-zinc-50 shadow-lg">
          {filteredTasks.map((task) => (
            <label
              key={task.id}
              className="checkbox flex items-center gap-2 p-3"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="checkbox__input"
              />
              <span className="checkbox__inner"></span>
              <p
                className={`px-3 break-words ${
                  task.completed ? "text-gray-400 line-through" : ""
                }`}
              >
                {task.title}
              </p>
            </label>
          ))}
          {tasks.length === 0 && (
            <p className="p-3 text-center text-stone-500">No tasks yet!</p>
          )}
        </div>
      </div>

      <div className="flex w-full max-w-md flex-col items-center justify-between border border-stone-400 bg-zinc-50 px-2 py-2 shadow-lg sm:flex-row">
        <p>
          {itemsLeft} {itemsLeft === 1 ? "item" : "items"} left
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`cursor-pointer ${
              filter === "all"
                ? "font-semibold text-yellow-700"
                : "text-stone-500"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`cursor-pointer ${
              filter === "active"
                ? "font-semibold text-yellow-700"
                : "text-stone-500"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`cursor-pointer ${
              filter === "completed"
                ? "font-semibold text-yellow-700"
                : "text-stone-500"
            }`}
          >
            Completed
          </button>
        </div>

        <button
          onClick={clearCompleted}
          className="cursor-pointer text-stone-500"
        >
          Clear completed
        </button>
      </div>
    </main>
  );
}
