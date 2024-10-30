import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { instance } from "../config";
import { format } from "date-fns";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { saveAs } from "file-saver";
import ConfirmationModal from "../components/ConformationModal";

const ProjectDetils = () => {
  const { title } = useParams();
  const [project, setProject] = useState(null);
  const [filter, setFilter] = useState("all");
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [editProjectNameModalIsOpen, setEditProjectNameModalIsOpen] =
    useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [addnewTaskModalIsOpen, setAddnewTaskModalIsOpen] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [todoListForUpdation, setTodoListForUpdation] = useState([]);
  const [deleteTodoModalIsOpen, setDeleteTodoModalIsOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [editTodoModalIsOpen, setEditTodoModalIsOpen] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [exportModalIsOpen, setExportModalIsOpen] = useState(false);
  const [gitHubUrl, setGitHubUrl] = useState("");

  useEffect(() => {
    fetchProjectDetails();
  }, [title]);
  const fetchProjectDetails = async () => {
    try {
      const response = await instance.get(`/projects/${title}`);
      setProject(response.data);
      setEditProjectNameModalIsOpen(false);
      if (response.data.todos) setFilteredTodos(response.data.todos);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (project && project.todos) {
      console.log("Todos:", project.todos);
      if (filter === "all") {
        setFilteredTodos(project.todos);
      } else if (filter === "pending") {
        setFilteredTodos(
          project.todos.filter((todo) => todo.status === "PENDING")
        );
      } else if (filter === "completed") {
        setFilteredTodos(
          project.todos.filter((todo) => todo.status === "COMPLETED")
        );
      }
    }
  }, [filter, project]);

  const handleSaveProjectName = async () => {
    if (newProjectName.trim()) {
      try {
        const response = await instance.put(
          `/projects/${project.title}`,
          null,
          {
            params: {
              newTitle: newProjectName,
            },
          }
        );
        console.log(response.data);
        setEditProjectNameModalIsOpen(false);
        setProject({ ...project, title: newProjectName });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleAddTodoForCompletion = (id) => {
    console.log(id, "{} todo id from the function ");

    setTodoListForUpdation((prevList) => {
      if (prevList.includes(id)) {
        return prevList.filter((todoId) => todoId !== id);
      } else {
        return [...prevList, id];
      }
    });
  };

  const handleAddNewTask = async () => {
    if (newTaskDescription.trim()) {
      try {
        const newTask = { description: newTaskDescription };
        const response = await instance.post("/todos", newTask, {
          params: {
            projectId: project.id,
          },
        });
        setProject((prevProject) => ({
          ...prevProject,
          todos: [...prevProject.todos, response.data],
        }));
        setAddnewTaskModalIsOpen(false);
        setNewTaskDescription("");
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleTodoUpdation = async () => {
    try {
      const response = await instance.put("/todos", todoListForUpdation);
      const updatedTodos = response.data;
      setProject((prevProject) => ({
        ...prevProject,
        todos: prevProject.todos.map(
          (todo) =>
            updatedTodos.find((updatedTodo) => updatedTodo.id === todo.id) ||
            todo
        ),
      }));
      setTodoListForUpdation([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteButtonClicked = (todo) => {
    setSelectedTodo(todo);
    setDeleteTodoModalIsOpen(true);
  };
  const handleConfirmDelete = async () => {
    try {
      console.log(selectedTodo, "selected todo");
      const response = await instance.delete(`/todos/${selectedTodo.id}`);
      console.log(response);
      setProject((prevProject) => ({
        ...prevProject,
        todos: prevProject.todos.filter((todo) => todo.id !== selectedTodo.id),
      }));
      setSelectedTodo(null);
      setDeleteTodoModalIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditTodoButtonClicked = (todo) => {
    setSelectedTodo(todo);
    setEditTodoModalIsOpen(true);
  };

  const handleConfirmTodoEdit = async () => {
    try {
      const response = await instance.put(`/todos/${selectedTodo.id}`, null, {
        params: {
          newDescription: editedDescription,
        },
      });
      const updatedTodo = response.data;
      setProject((prevProject) => ({
        ...prevProject,
        todos: prevProject.todos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        ),
      }));
      setSelectedTodo(null);
      setEditTodoModalIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const generateGistContent = (project) => {
    const completedTodos = project.todos.filter(
      (todo) => todo.status === "COMPLETED"
    );
    const pendingTodos = project.todos.filter(
      (todo) => todo.status !== "COMPLETED"
    );

    let content = `# ${project.title}\n\n`;
    content += `**Summary:** ${completedTodos.length} / ${project.todos.length} completed.\n\n`;

    content += "## Pending Tasks\n";
    pendingTodos.forEach((todo) => {
      content += `- [ ] ${todo.description} \n`;
    });

    content += "\n## Completed Tasks\n";
    completedTodos.forEach((todo) => {
      content += `- [x] ${todo.description}\n`;
    });

    return content;
  };

  const exportGist = async (project) => {
    const token = gitHubUrl;
    const gistContent = generateGistContent(project);

    const gistData = {
      description: `Project summary for ${project.title}`,
      public: false,
      files: {
        [`${project.title}.md`]: {
          content: gistContent,
        },
      },
    };

    try {
      const response = await fetch("https://api.github.com/gists", {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify(gistData),
      });

      const result = await response.json();
      console.log("Gist created:", result);
      return result.html_url;
    } catch (error) {
      console.error("Error creating gist:", error);
    }
  };

  const saveMarkdownLocally = (project) => {
    const gistContent = generateGistContent(project);
    const blob = new Blob([gistContent], {
      type: "text/markdown;charset=utf-8",
    });
    saveAs(blob, `${project.title}.md`);
  };

  const handleExportGist = async () => {
    const gistUrl = await exportGist(project);
    console.log("Gist URL:", gistUrl);
    saveMarkdownLocally(project);
  };

  return (
    <>
      <Navbar />
      <div className="  mx-auto bg-white   px-24 py-10">
        <div className="flex justify-end">
          <button
            onClick={() => setExportModalIsOpen(true)}
            className="ml-8 px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-300"
          >
            Export As Gist
          </button>
        </div>
        <h1 className="text-center text-lg font-bold text-gray-700 pb-16">
          Project Details
        </h1>
        <div className="flex items-center justify-start mb-8">
          <h2 className="text-md font-semibold text-blue-800 flex items-center space-x-2">
            <span className=" text-blue-700  rounded-md">Project Name:</span>
            <span className="bg-blue-100 rounded-lg font-bold text-lg px-2 py-2 text-blue-900">
              {project?.title}
            </span>
          </h2>

          <button
            onClick={() => setEditProjectNameModalIsOpen(true)}
            className="ml-4 text-blue-600 hover:text-blue-800 transition-all duration-300 ease-in-out"
            title="Edit Project Name"
          >
            ✏️
          </button>
        </div>
        <div className="mt-11">
          <div className="flex justify-between py-5">
            <h1 className="text-lg bg-blue-100 py-2 rounded-lg px-3 font-bold text-gray-700 mb-6">
              Todos
              <span>:{filteredTodos.length}</span>
            </h1>
            <div className="">
              <button
                onClick={() => setFilter("all")}
                className={`text-sm outline font-semibold  py-1 px-2 rounded-[5px] ${
                  filter === "all" ? "bg-blue-600 text-white" : "text-blue-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`text-sm outline font-semibold ms-2  py-1 px-2 rounded-[5px] ${
                  filter === "pending"
                    ? "bg-blue-600 text-white"
                    : "text-blue-700"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`text-sm outline ms-2 font-semibold  py-1 px-2 rounded-[5px] ${
                  filter === "completed"
                    ? "bg-blue-600 text-white"
                    : "text-blue-700"
                }`}
              >
                Completed
              </button>
            </div>
            <div>
              <button
                onClick={() => setAddnewTaskModalIsOpen(true)}
                className="ml-8 px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-300"
              >
                Add New Todo
              </button>
            </div>
          </div>

          <div className="">
            {filteredTodos.length > 0 && (
              <ul className="space-y-6">
                {filteredTodos?.map((todo) => (
                  <li
                    key={todo.id}
                    className={`bg-gray-100 px-5 py-5 rounded-lg shadow-md flex items-center justify-between ${
                      todo.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    <div>
                      <div className="flex items-center">
                        {todo.status === "COMPLETED" && (
                          <>
                            <input
                              type="checkbox"
                              checked
                              hidden
                              onChange={() => {}}
                              disabled
                              className="mr-4 transform scale-125 cursor-pointer"
                            />
                            <span
                              className={`w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center bg-green-500 border-green-500`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            <span
                              className={`text-xl ps-2 font-semibold text-blue-500`}
                            >
                              {todo.description}
                            </span>
                          </>
                        )}
                        {todo.status === "PENDING" && (
                          <>
                            <input
                              type="checkbox"
                              onChange={() =>
                                handleAddTodoForCompletion(todo.id)
                              }
                              className="mr-4 transform scale-150 cursor-pointer"
                            />
                            <span
                              className={`text-xl font-semibold text-blue-500`}
                            >
                              {todo.description}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex gap-10">
                        <p className="pt-5  text-sm font-medium text-gray-600">
                          <span className="font-bold text-gray-800">
                            Created At:
                          </span>
                          <span className="bg-gray-200 ms-2 rounded-md px-2 py-1 inline-block">
                            {format(new Date(todo.createdAt), "PPP p")}
                          </span>
                        </p>
                        {todo.status === "COMPLETED" && (
                          <p className="pt-5  text-sm font-medium text-gray-600">
                            <span className="font-bold text-gray-800">
                              Updated At:
                            </span>
                            <span className="bg-gray-200 ms-2 rounded-md px-2 py-1 inline-block">
                              {format(new Date(todo.updatedAt), "PPP p")}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <button
                        onClick={() => handleEditTodoButtonClicked(todo)}
                        className="text-blue-500 hover:text-blue-700 transition duration-300"
                      >
                        <i class="fa fa-pencil-alt" aria-hidden="true"></i>
                      </button>

                      <button
                        onClick={() => handleDeleteButtonClicked(todo)}
                        className="text-red-500 hover:text-red-700 transition duration-300"
                      >
                        <i class="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {filteredTodos.length === 0 && filter !== "all" && (
              <div className="mt-32 text-center px-10">
                <div className="bg-gray-100 rounded-lg p-6 shadow-md animate-bounce">
                  <p className="text-xl font-semibold text-gray-700">
                    You don't have any
                    <span className="text-blue-600 capitalize">
                      {filter}
                    </span>{" "}
                    tasks for this project.
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Try changing the filter or adding new tasks!
                  </p>
                </div>
              </div>
            )}
            {filteredTodos.length === 0 && filter === "all" && (
              <div className="mt-32 text-center px-10">
                <div className="bg-gray-100 rounded-lg p-6 shadow-md animate-bounce">
                  <p className="text-xl font-semibold text-gray-700">
                    You don't have any tasks for this project.
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Try adding some tasks!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {todoListForUpdation.length > 0 && (
          <div className="flex justify-end p-3 mt-6">
            <button
              onClick={handleTodoUpdation}
              className="bg-blue-500 rounded-lg py-2 px-2 text-sm text-white font-semibold"
            >
              Save tasks as Completed
            </button>
          </div>
        )}
      </div>

      {editProjectNameModalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Edit Project Name
            </h3>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setEditProjectNameModalIsOpen(false)}
                className="mr-4 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProjectName}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {addnewTaskModalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add New Task
            </h3>
            <input
              type="text"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md mb-4"
              placeholder="Task Description"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setAddnewTaskModalIsOpen(false)}
                className="mr-4 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewTask}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteTodoModalIsOpen && (
        <ConfirmationModal
          onClose={() => setDeleteTodoModalIsOpen(false)}
          onConfirm={handleConfirmDelete}
          message={" Are you sure you want to delete this task?"}
        />
      )}
      {editTodoModalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 space-y-10">
          <div className="bg-white rounded-lg shadow-lg p-10 w-[400px]">
            <h2 className="text-lg font-semibold mb-4">
              Edit Todo Description
            </h2>
            <div className="mb-6">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="todoDescription"
              >
                Description
              </label>
              <input
                type="text"
                id="todoDescription"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setEditTodoModalIsOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTodoEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      {exportModalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 space-y-10">
          <div className="bg-white rounded-lg shadow-lg p-10 w-[400px]">
            <h2 className="text-lg font-semibold mb-4">
              Add GitHub Secret key here
            </h2>
            <div className="mb-6">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="todoDescription"
              >
                Secret Key
              </label>
              <input
                type="text"
                id="todoDescription"
                value={gitHubUrl}
                onChange={(e) => setGitHubUrl(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setExportModalIsOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExportGist}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetils;
