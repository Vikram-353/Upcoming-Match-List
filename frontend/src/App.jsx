import React, { useEffect, useState } from "react";
import dotenv from "dotenv";

function App() {
  const [matches, setMatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const matchesPerPage = 5;

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    setLoading(true);
    fetch(`${apiUrl}`)
      .then((res) => res.json())
      .then((data) => {
        setMatches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching matches:", err);
        setLoading(false);
      });
  }, []);

  // Pagination logic
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);
  const totalPages = Math.ceil(matches.length / matchesPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const LoadingCard = () => (
    <li className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border border-indigo-100 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-300 rounded-full"></div>
          <div className="h-5 w-20 sm:w-24 bg-gray-300 rounded"></div>
        </div>
        <div className="hidden sm:block h-4 w-8 bg-gray-300 rounded mx-auto"></div>
        <div className="flex items-center gap-3 justify-end sm:justify-start">
          <div className="h-5 w-20 sm:w-24 bg-gray-300 rounded"></div>
          <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-300 rounded-full"></div>
        </div>
      </div>
      <div className="h-4 w-32 bg-gray-300 rounded mx-auto mt-4"></div>
    </li>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-100/20 to-pink-100/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className=" p-4 bg-white/20 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl mb-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text h-full text-transparent mb-2 pb-4">
                Upcoming Soccer Matches
              </h1>
              <p className="text-sm sm:text-base text-indigo-600/80 font-medium">
                Stay updated with the latest fixtures
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-indigo-200/50 shadow-lg">
                <p className="text-lg sm:text-xl font-bold text-indigo-700">
                  {matches.length}
                </p>
                <p className="text-xs sm:text-sm text-indigo-600">Total</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-purple-200/50 shadow-lg">
                <p className="text-lg sm:text-xl font-bold text-purple-700">
                  {totalPages}
                </p>
                <p className="text-xs sm:text-sm text-purple-600">Pages</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-blue-200/50 shadow-lg col-span-2 sm:col-span-1">
                <p className="text-lg sm:text-xl font-bold text-blue-700">
                  {currentPage}
                </p>
                <p className="text-xs sm:text-sm text-blue-600">Current</p>
              </div>
            </div>
          </div>

          {/* Matches List */}
          {loading ? (
            <ul className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
              {[...Array(5)].map((_, index) => (
                <LoadingCard key={index} />
              ))}
            </ul>
          ) : matches.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-indigo-200/50 shadow-xl inline-block">
                <div className="text-4xl sm:text-6xl mb-4">⚽</div>
                <p className="text-xl sm:text-2xl text-indigo-700 font-semibold mb-2">
                  No matches found
                </p>
                <p className="text-indigo-600/80">
                  Check back later for upcoming games!
                </p>
              </div>
            </div>
          ) : (
            <>
              <ul className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
                {currentMatches.map((match, index) => (
                  <li
                    key={index}
                    className={`group relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-indigo-100 hover:border-indigo-300 transform hover:-translate-y-1 ${
                      selectedMatch === index
                        ? "ring-2 ring-indigo-400 bg-white scale-[1.02]"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedMatch(selectedMatch === index ? null : index)
                    }
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                    {/* Floating status indicator */}
                    {/* <div className="absolute top-3 items-center sm:top-4 sm:right-4">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-pulse">
                        LIVE SOON
                      </div>
                    </div> */}

                    <div className="relative z-10">
                      {/* Teams section - responsive layout */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="relative">
                            <img
                              src={match.homeLogo}
                              alt={match.homeTeam}
                              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-indigo-200 shadow-lg object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%236366f1'/%3E%3Ctext x='24' y='28' text-anchor='middle' fill='white' font-size='16' font-weight='bold'%3E⚽%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                H
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="font-bold text-indigo-800 text-base sm:text-lg group-hover:text-indigo-600 transition-colors duration-300">
                              {match.homeTeam}
                            </span>
                            <p className="text-xs text-indigo-600/70">
                              Home Team
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-center">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 sm:px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                            VS
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 justify-end sm:justify-start">
                          <div className="text-right sm:text-left">
                            <span className="font-bold text-indigo-800 text-base sm:text-lg group-hover:text-indigo-600 transition-colors duration-300">
                              {match.awayTeam}
                            </span>
                            <p className="text-xs text-indigo-600/70">
                              Away Team
                            </p>
                          </div>
                          <div className="relative">
                            <img
                              src={match.awayLogo}
                              alt={match.awayTeam}
                              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-purple-200 shadow-lg object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23a855f7'/%3E%3Ctext x='24' y='28' text-anchor='middle' fill='white' font-size='16' font-weight='bold'%3E⚽%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                A
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Date and time section */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 sm:p-4 border border-indigo-200/50">
                        <div className="flex items-center justify-center gap-2 text-indigo-700">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="font-semibold text-sm sm:text-base">
                            🗓️ {formatDate(match.date)}
                          </span>
                        </div>

                        {selectedMatch === index && (
                          <div className="mt-4 pt-4 border-t border-indigo-200 animate-fadeIn">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                              <div className="text-center bg-white/50 rounded-lg p-3">
                                <p className="text-indigo-600 font-medium mb-1">
                                  Competition
                                </p>
                                <p className="font-semibold text-indigo-800">
                                  Premier League
                                </p>
                              </div>
                              <div className="text-center bg-white/50 rounded-lg p-3">
                                <p className="text-indigo-600 font-medium mb-1">
                                  Stadium
                                </p>
                                <p className="font-semibold text-indigo-800">
                                  To Be Announced
                                </p>
                              </div>
                              <div className="text-center bg-white/50 rounded-lg p-3">
                                <p className="text-indigo-600 font-medium mb-1">
                                  Status
                                </p>
                                <p className="font-semibold text-green-600">
                                  Scheduled
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-indigo-200/50 shadow-lg">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
                >
                  ← Prev
                </button>
                <span className="text-indigo-700 font-semibold text-lg px-4 py-2 bg-white/80 rounded-lg border border-indigo-200">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        @media (max-width: 640px) {
          .group:hover {
            transform: translateY(-2px) !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
