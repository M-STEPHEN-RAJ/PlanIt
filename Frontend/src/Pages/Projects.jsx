import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import convertTime from "../utils/convertTime";
import add from "../assets/add-icon.png";
import Progressbar from "../Components/Progressbar";
import ProjectModal from "../Components/Modals/ProjectModal";

const Projects = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, [refresh]);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const token = sessionStorage.getItem("authToken");
      if (!token) {
        toast.error("You must be logged in!");
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(res.data.projects || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="flex-1 flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col gap-5 p-3">
        {loading ? 
          <div className="h-4 w-16 bg-gray-300 rounded mt-3"></div>
          :
          <h2 className="text-lg font-semibold">Projects</h2>
        }

        <div className="grid grid-cols-4 gap-3">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[128px] flex justify-between rounded border border-gray-300 px-4 py-2 animate-pulse"
                >
                  <div className="flex justify-between flex-col gap-2">
                    <div className="space-y-2 pt-2">
                      <div className="h-4 w-32 bg-gray-300 rounded"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>

                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300"></div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-2 pt-2">
                    <div className="h-4 w-12 bg-gray-300 rounded"></div>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                      <div className="h-2 w-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            : projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="flex justify-between rounded border border-gray-300 px-4 py-2 cursor-pointer"
                >
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-col">
                      <h2 className="font-medium">{project.name}</h2>
                      <p className="text-xs text-gray-500">
                        {convertTime(project.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 3).map((member) => (
                          <img
                            key={member._id}
                            className="w-8 h-8 object-cover rounded-full border-2 border-white"
                            src={member.avatar}
                            title={member.name}
                          />
                        ))}
                      </div>

                      {project.members.length > 3 && (
                        <p className="text-sm font-medium text-gray-500">
                          +{project.members.length - 3}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-start gap-5">
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      <p className="text-xs text-green-500 capitalize">
                        {project.status}
                      </p>
                    </div>

                    <Progressbar 
                      progress={project.progress}
                    />
                  </div>
                </div>
              ))}

          <div
            onClick={() => setIsModalOpen(true)}
            className="h-32 flex justify-center items-center gap-3 rounded border border-gray-300 border-dashed cursor-pointer"
          >
            <img className="w-4" src={add} alt="" />
            <p className="text-gray-500 text-sm">Create new project</p>
          </div>
        </div>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default Projects;
