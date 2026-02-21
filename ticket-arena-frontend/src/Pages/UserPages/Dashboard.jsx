import { useState, useEffect } from "react";
import { Clock, Users, Ticket, ChevronRight } from "lucide-react";
import BookingModal from "../../Components/BookingModal.jsx";
import getStatus from "../../Helper/getStatus.js";
import { ApiService } from "../../Services/ApiService.js";
import { getTeamsFromDescription } from "../../Helper/teamLogos";
import { useNavigate } from "react-router-dom"; // ← NEW: Import useNavigate

const dashboardStats = [
  {
    id: 1,
    title: "Total Bookings",
    value: 0,
    icon: Ticket,
    color: "from-emerald-500/20 to-emerald-600/10",
  },
  {
    id: 2,
    title: "Active Matches",
    value: 0,
    icon: Users,
    color: "from-indigo-500/20 to-indigo-600/10",
  },
];

export default function Dashboard() {
  const navigate = useNavigate(); // ← NEW: Hook for navigation
const [active, setActive] = useState(false);

  const user = JSON.parse(localStorage.getItem("authDetail-tickethub") || "{}");
  const name = user?.name?.split(" ")[0] || "User";

  const [todaysMatches, setTodaysMatches] = useState([]);
  const [filteredTodaysMatches, setFilteredTodaysMatches] = useState([]);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dashBoardStatistics, setDashBoardStatistics] =
    useState(dashboardStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const loadEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await ApiService.post("/events/list", {});
      const apiEvents = res?.data?.events || [];

      const activeEvents = apiEvents.filter((e) => e.active && !e.softDelete);

      let upcoming = 0;
      let live = 0;

      const formatted = activeEvents.map((event) => {
        const eventDateObj = new Date(event.date);
        const dateOnly = eventDateObj.toISOString().split("T")[0];

        const status = getStatus(event.date, event.time);
        if (status === "LIVE") live++;
        if (status === "UPCOMING") upcoming++;

        const teams = getTeamsFromDescription(event.description);

        return {
          ...event,
          dateOnly,
          status,
          teams,
        };
      });

      const todayEvents = formatted.filter((e) => e.dateOnly === todayStr);

      setTodaysMatches(todayEvents);

      setDashBoardStatistics((prev) =>
        prev.map((item) => {
          if (item.id === 1)
            return { ...item, value: res?.data?.totalBookings || 0 };
          if (item.id === 2) return { ...item, value: upcoming + live };
          return item;
        }),
      );
    } catch (err) {
      console.error("Failed to load events:", err);
      setError("Could not load matches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredTodaysMatches(todaysMatches);
    } else {
      setFilteredTodaysMatches(
        todaysMatches.filter((e) => e.status === filter.toUpperCase()),
      );
    }
  }, [filter, todaysMatches]);

  const handleBooking = async (data) => {
    try {
      await ApiService.post("/tickets/add", {
        eventId: data.id,
        userId: user?.id,
        price: data.total,
        noOfTickets: data.ticketCount,
        seats: data.seats,
      });
      alert("Booking confirmed!");
      setOpen(false);
      loadEvents();
    } catch {
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="relative min-h-screen text-white">
      <img
        src="/Stadium.png"
        className="fixed inset-0 h-full w-full object-cover -z-20"
        alt="bg"
      />
      <div className="fixed inset-0 bg-black/70 -z-10" />

      <main className="relative max-w-7xl mx-auto px-6 py-12 md:px-10 lg:px-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Welcome back, <span className="text-indigo-400">{name}</span> 🏏
          </h1>
          <p className="mt-3 text-lg text-gray-400 max-w-2xl">
            Track your bookings and never miss a moment of today's live action.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-16">
          {dashBoardStatistics.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={`rounded-2xl bg-gradient-to-br ${stat.color} backdrop-blur-xl border border-white/10 p-6 transition-all hover:scale-[1.03] hover:shadow-2xl hover:shadow-indigo-900/20 group`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 font-medium">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                    <Icon size={32} className="text-indigo-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Today's Matches Section – with View All button on right */}
        <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-3xl font-bold">Today's Matches</h2>

          <div className="flex items-center gap-6">
            {/* Filter buttons */}
            <div className="flex gap-3">
              {["all", "upcoming", "live"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === f
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  } backdrop-blur-sm border border-white/10`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* ← NEW: View All button */}
            <button
              onClick={() => {
                setActive(true);
                navigate("/user/events");
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium
    transition-all duration-300 active:scale-95
    ${
      active
        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30"
        : "bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white"
    }
  `}
            >
              View All
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-6 text-gray-400">Loading today's matches...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-400">{error}</div>
        ) : filteredTodaysMatches.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10">
            <div className="text-6xl mb-6">🏏</div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-3">
              No matches scheduled for today
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Check back soon — big games and thrilling clashes are coming up!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTodaysMatches.map((event) => {
              const capacity = Number(event.capacity) || 1;
              const booked = Number(event.bookingCount) || 0;
              const availability = Math.max(
                0,
                100 - Math.round((booked / capacity) * 100),
              );

              return (
                <div
                  key={event.id}
                  className="group relative rounded-2xl bg-gradient-to-b from-white/8 to-white/3 backdrop-blur-xl border border-white/10 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-900/20"
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span
                      className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${
                        event.status === "LIVE"
                          ? "bg-red-600/90 text-white shadow-red-600/40"
                          : event.status === "UPCOMING"
                            ? "bg-indigo-600/90 text-white shadow-indigo-600/40"
                            : "bg-gray-700/90 text-gray-200"
                      } backdrop-blur-sm border border-white/10`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <div className="p-4 pb-5">
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                      {event.title}
                    </h3>

                    {event.teams ? (
                      <div className="flex items-center justify-between mb-4 px-2 md:px-6">
                        <div className="flex flex-col items-center">
                          <img
                            src={event.teams.teamA.logo}
                            alt={event.teams.teamA.name}
                            className="w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow-md"
                          />
                          <span className="text-xs md:text-sm font-medium mt-2 text-gray-300 text-center">
                            {event.teams.teamA.name}
                          </span>
                        </div>

                        <div className="relative flex items-center justify-center mx-4">
                          <div className="absolute w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-500/20 blur-md animate-pulse" />
                          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center text-sm md:text-base font-bold text-white">
                            V/S
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <img
                            src={event.teams.teamB.logo}
                            alt={event.teams.teamB.name}
                            className="w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow-md"
                          />
                          <span className="text-xs md:text-sm font-medium mt-2 text-gray-300 text-center">
                            {event.teams.teamB.name}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-gray-400 mb-4 text-sm">
                        Match details not available
                      </p>
                    )}

                    <div className="flex flex-wrap gap-5 text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-indigo-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={18} className="text-indigo-400" />
                        <span>
                          {booked} / {capacity}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Availability</span>
                        <span>{availability}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-600 transition-all duration-300"
                          style={{ width: `${availability}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="text-emerald-400 font-medium">
                        ${event.price?.toFixed(2) || "—"}
                      </div>
                      <div className="text-gray-500">
                        {event.venue || "Venue TBA"}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold transition-all shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/50 group-hover:scale-[1.02]"
                    >
                      Book Tickets
                      <ChevronRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {open && (
        <BookingModal
          event={selectedEvent}
          isOpen={open}
          onConfirm={handleBooking}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
