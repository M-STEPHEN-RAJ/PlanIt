import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import completed from "../assets/completed-icon.png";
import updated from "../assets/updated-icon.png";
import create from "../assets/create-icon.png";
import date from "../assets/date-icon.png";
import add from "../assets/add-icon.png";
import { API_BASE_URL } from "../utils/api";
import Progressbar from "../Components/Progressbar";
import ProjectChart from "../Components/ProjectChart";
import TaskChart from "../Components/TaskChart";
import convertTime from "../utils/convertTime";

const Dashboard = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    completed: 0,
    updated: 0,
    created: 0,
    dueSoon: 0,
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      const res = await axios.get(`${API_BASE_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setSummary(res.data.summary);
        setAllProjects(res.data.allProjects || []);
        setRecentProjects(res.data.recentProjects || []);
        setAllTasks(res .data.tasks || []);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Failed to fetch data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex-1 flex flex-col items-center p-3 w-full">
          {/* Summary cards */}
          <div className="w-full max-w-[1200px] flex justify-between gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg h-20 animate-pulse"
              >
                <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-3.5 w-24 bg-gray-300 rounded"></div>
                  <div className="h-2.5 w-22 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent projects */}
          <div className="w-full max-w-[1200px] space-y-2 mt-5">
            <div className="flex justify-between items-end">
              <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-3.5 w-16 mr-5 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-3">
              {Array.from({ length: 3 }).map((_, i) => (
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
              ))}
              <div
                className="h-32 flex justify-center items-center gap-3 rounded border border-gray-300 border-dashed cursor-pointer"
              >
                <img className="w-4" src={add} alt="" />
                <p className="text-gray-500 text-sm">Create new project</p>
              </div>              
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center p-3 gap-3">
          <div className="w-full max-w-[1200px] flex justify-between gap-4">
            <div className="flex-1 flex items-center gap-4 px-4 py-2 border border-gray-300 rounded-lg h-20">
              <img className="w-5" src={completed} alt="" />
              <div className="">
                <h2 className="font-medium">{summary.completed} completed</h2>
                <p className="text-xs text-gray-500">in the last 7 days</p>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-4 px-4 py-2 border border-gray-300 rounded-lg h-20">
              <img className="w-5" src={updated} alt="" />
              <div className="">
                <h2 className="font-medium">{summary.updated} updated</h2>
                <p className="text-xs text-gray-500">in the last 7 days</p>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-4 px-4 py-2 border border-gray-300 rounded-lg h-20">
              <img className="w-5" src={create} alt="" />
              <div className="">
                <h2 className="font-medium">{summary.created} created</h2>
                <p className="text-xs text-gray-500">in the last 7 days</p>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-4 px-4 py-2 border border-gray-300 rounded-lg h-20">
              <img className="w-5" src={date} alt="" />
              <div className="">
                <h2 className="font-medium">{summary.dueSoon} due soon</h2>
                <p className="text-xs text-gray-500">in the last 7 days</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[1200px] space-y-2">
            <div className="flex justify-between items-end">
              <h2 className="text-lg font-semibold">Recent Projects</h2>
              <p
                onClick={() => navigate("/projects")}
                className="mr-5 text-sm font-medium cursor-pointer hover:underline"
              >
                View more
              </p>
            </div>

            {recentProjects.length === 0 ? (
              <div className="grid grid-cols-4 gap-3">
                <div
                  onClick={() => navigate("/projects")}
                  className="h-32 flex justify-center items-center gap-3 rounded border border-gray-300 border-dashed cursor-pointer"
                >
                  <img className="w-4" src={add} alt="" />
                  <p className="text-gray-500 text-sm">Create new project</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {recentProjects.map((project) => (
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

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex -space-x-2">
                          {project.members?.slice(0, 3).map((member) => (
                            <img
                              key={member._id}
                              className="w-8 h-8 object-cover rounded-full border-2 border-white"
                              src={member.avatar || "/default-avatar.png"}
                              title={member.name}
                              alt={member.name}
                            />
                          ))}
                        </div>
                        {project.members?.length > 3 && (
                          <p className="text-sm font-medium text-gray-500">
                            +{project.members.length - 3}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col justify-start gap-5">
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full
                        ${
                          project.status === "assigned"
                            ? "bg-blue-500"
                            : project.status === "development"
                            ? "bg-yellow-500"
                            : project.status === "testing"
                            ? "bg-purple-500"
                            : project.status === "completed"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                        ></span>
                        <p
                          className={`text-xs capitalize
                        ${
                          project.status === "assigned"
                            ? "text-blue-500"
                            : project.status === "development"
                            ? "text-yellow-500"
                            : project.status === "testing"
                            ? "text-purple-500"
                            : project.status === "completed"
                            ? "text-green-500"
                            : "text-gray-500"
                        }`}
                        >
                          {project.status}
                        </p>
                      </div>

                      <Progressbar progress={project.progress || 0} />
                    </div>
                  </div>
                ))}

                <div
                  onClick={() => navigate("/projects", { state: { openModal: true } })}
                  className="h-32 flex justify-center items-center gap-3 rounded border border-gray-300 border-dashed cursor-pointer"
                >
                  <img className="w-4" src={add} alt="" />
                  <p className="text-gray-500 text-sm">Create new project</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <ProjectChart projects={allProjects} />
            <TaskChart tasks={Object.entries(allTasks).map(([status, count]) => ({ status, count }))} />
          </div>

        </div>
      )}
    </>
  );
};

export default Dashboard;
