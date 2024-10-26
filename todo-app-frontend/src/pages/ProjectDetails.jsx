import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { instance } from "../config";

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

  useEffect(() => {
    fetchProjectDetails();
  }, []);
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl h-[700px] mx-auto bg-white shadow-xl rounded-xl p-8">
          <h1 className="text-center text-lg font-bold text-gray-700 pb-6">
            Project Details
          </h1>
          <div className="flex items-center justify-start mb-8">
            <h2 className="text-md font-semibold text-blue-800 flex items-center space-x-2">
              <span className=" text-blue-700  rounded-md">Project Name:</span>
              <span className="bg-blue-100 font-bold text-lg px-2 py-0.5 text-blue-900">
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
          <div className="mt-20">
            <div className="flex justify-between py-5">
              <h1 className="text-lg bg-blue-50 py-2 px-3 font-bold text-gray-700 mb-6">
                Todos
                <span>:{filteredTodos.length}</span>
              </h1>
              <div className="">
                <button
                  onClick={() => setFilter("all")}
                  className={`text-sm outline font-semibold  py-1 px-2 rounded-[5px] ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "text-blue-700"
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
                  Add New Task
                </button>
              </div>
            </div>

            <div className="overflow-y-scroll scrollbar-hide h-[350px]">
              {filteredTodos.length > 0 && (
                <ul className="space-y-6">
                  {filteredTodos?.map((todo) => (
                    <li
                      key={todo.id}
                      className={`bg-gray-100 px-4 py-2 rounded-lg shadow-md flex items-center justify-between ${
                        todo.completed
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => handleToggleCompletion(todo.id)}
                          className="mr-4 transform scale-125 cursor-pointer"
                        />
                        <span className="text-sm font-semibold">
                          {todo.description}
                        </span>
                      </div>
                      <button className="text-red-500 hover:text-red-700 transition duration-300">
                        Delete
                      </button>
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
            </div>
          </div>
        </div>
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
    </>
  );
};

export default ProjectDetils;
