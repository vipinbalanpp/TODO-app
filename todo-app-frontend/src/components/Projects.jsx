import React, { useState } from "react";

const Projects = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: "Project A" },
    { id: 2, name: "Project B" },
    { id: 3, name: "Project C" },
  ]);
  const [newProjectName, setNewProjectName] = useState("");

  const addProject = () => {
    if (newProjectName.trim() === "") return;

    const newProject = {
      id: projects.length + 1,
      name: newProjectName,
    };

    setProjects([...projects, newProject]);
    setNewProjectName("");
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <ul className="list-disc pl-5 mb-4">
        {projects.map((project) => (
          <li key={project.id} className="mb-2">
            {project.name}
          </li>
        ))}
      </ul>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Enter new project name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button
          onClick={addProject}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Project
        </button>
      </div>
    </div>
  );
};

export default Projects;
