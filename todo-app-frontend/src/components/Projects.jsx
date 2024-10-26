import React, { useEffect, useState } from "react";
import { instance } from "../config";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);
  const fetchProjects = async () => {
    try {
      const response = await instance.get("/projects");
      if (response.data) {
        setProjects(response.data);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTask = () => {
    if (taskDescription.trim()) {
      setTasks([...tasks, taskDescription]);
      setTaskDescription("");
    }
  };
  const handleSave = async () => {
    if (projectName.trim()) {
      const data = {
        title: projectName,
        todos: tasks.map((task) => ({ description: task })),
      };
      console.log(data);
      try {
        console.log();
        const response = await instance.post("/projects", data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setProjects([...projects, response.data]);
        setAddProductModalOpen(false);
      } catch (error) {
        console.log(error);
      }
      setProjectName("");
      setTasks([]);
    }
  };
  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <>
      <div className="flex flex-col justify-start pt-5 h-screen items-center bg-gray-100">
        <div className="bg-white flex flex-col items-center p-8 rounded-lg shadow-md w-full max-w-6xl h-[600px] mt-10">
          <p className="text-center font-bold text-3xl underline mb-8 text-indigo-700">
            Projects
          </p>
          <div className="w-3/4 h-3/4 flex flex-col items-center">
            <ul className="w-full pt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {projects.length > 0 &&
                projects.map((project) => (
                  <li
                    onClick={() => navigate(`/projectDetials/${project.title}`)}
                    key={project.id}
                    className="bg-indigo-100 hover:bg-indigo-200 transition duration-300 ease-in-out rounded-lg p-5 shadow-lg"
                  >
                    <p className="font-semibold text-xl text-gray-800">
                      {project.title}
                    </p>
                    {/* <p className="text-gray-600 mt-2">
                      Description of Project 5
                    </p> */}
                  </li>
                ))}
            </ul>
            <div className="p-32">
              <p className="text-lg text-gray-500 font-bold">
                No projects created yet
              </p>
            </div>
          </div>
          <button
            onClick={() => setAddProductModalOpen(true)}
            className="mt-8 bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Create Project
          </button>
        </div>
      </div>
      {addProductModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl p-8 md:p-10 h-[700px]">
            <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
              Add New Project
            </h2>
            <div className="mb-8">
              <label
                htmlFor="projectName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="mt-11">
              <h2 className="text-xl font-bold mb-4 text-center text-indigo-800">
                Add Tasks
              </h2>

              <div className="flex gap-4">
                <input
                  type="text"
                  id="taskDescription"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Enter task description"
                  className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  onClick={handleAddTask}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                >
                  Add Task
                </button>
              </div>
            </div>

            <div className="mb-6 w-full mt-5">
              <h3 className="text-lg font-semibold mb-4">
                Tasks Added: {tasks.length > 0 && <span>{tasks.length}</span>}
              </h3>
              <div className="h-[250px] overflow-y-auto border rounded-md p-4 bg-gray-50">
                <ul className="space-y-3">
                  {tasks.length === 0 && (
                    <div className="flex justify-center items-center pt-20">
                      <p className="text-gray-600 font-semibold">
                        No tasks added yet
                      </p>
                    </div>
                  )}
                  {tasks.length > 0 &&
                    tasks.map((task, index) => (
                      <li
                        key={index}
                        className="bg-white rounded-md shadow-sm p-4 flex justify-between items-center"
                      >
                        <span className="text-gray-800">
                          {index + 1}.{task}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteTask(index)}
                            className="text-red-500 font-bold hover:text-red-700 transition duration-300"
                          >
                            x
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setAddProductModalOpen(false)}
                className="bg-gray-400 text-white px-5 py-2 rounded-md hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
