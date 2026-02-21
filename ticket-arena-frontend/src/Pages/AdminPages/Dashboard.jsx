import { CalendarCheck, IndianRupee } from "lucide-react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import getStatus from "../../Helper/getStatus";
import formatDate from "../../Helper/formatDate";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../Services/ApiService";

const stats = [
  {
    id: 1,
    title: "Total Bookings (24h)",
    value: 0,
    icon: CalendarCheck,
    color: "from-blue-600 to-blue-400",
  },
  {
    id: 2,
    title: "Total Revenue (24h)",
    value: 0,
    icon: IndianRupee,
    color: "from-emerald-600 to-emerald-400",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashBoardStatasctics, setDashBoardStatistics] = useState(stats);
  const [events, setEvents] = useState([]);
  const [bookingCount, setBookingCount] = useState([]);
  const [bookingRevenue, setBookingRevenue] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingCapacity, setBookingCapacity] = useState([]);
  const [cancelCount, setCancelledCount] = useState([]);
  const [eventStatus, setEventStatus] = useState([]);

  const barChartOptions = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
    },
    title: { text: null },
    credits: { enabled: false },
    xAxis: {
      categories: bookingRevenue.map((item) => item.name),
      labels: { style: { color: "#cbd5e1" } },
      gridLineColor: "#4b5563",
    },
    yAxis: {
      min: 0,
      title: { text: "Values", style: { color: "#cbd5e1" } },
      labels: { style: { color: "#cbd5e1" } },
      gridLineColor: "#4b5563",
    },
    legend: {
      itemStyle: { color: "#e2e8f0" },
    },
    series: [
      { name: "Booking",   data: bookingCount,   color: "#3b82f6" },
      { name: "Capacity",  data: bookingCapacity, color: "#8b5cf6" },
      { name: "Cancelled", data: cancelCount,    color: "#ef4444" },
      { name: "Revenue",   data: bookingRevenue, color: "#10b981" },
    ],
  };

  const pieChartOptions = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
    },
    title: { text: "" },
    credits: { enabled: false },
    colors: ["#3b82f6", "#10b981", "#8b5cf6"],
    plotOptions: {
      pie: {
        innerSize: "60%",
        dataLabels: {
          enabled: true,
          distance: 10,
          style: { color: "#e2e8f0", textOutline: "none" },
        },
      },
    },
    series: [{ name: "Events", data: eventStatus }],
  };

  const loadEvents = async () => {
    const res = await ApiService.post("/events/list", { isAdminEvent: true });
    const allEvents = res.data.events || [];
    setEvents(allEvents);

    const statusCount = { UPCOMING: 0, LIVE: 0, COMPLETED: 0 };

    const modifiedStats = dashBoardStatasctics.map((item) => {
      if (item.id === 1) return { ...item, value: res.data?.totalBookings ?? 0 };
      if (item.id === 2) return { ...item, value: res.data?.totalRevenue ? `₹${res.data.totalRevenue}` : "$0" };
      return item;
    });

    const bookingCountData = allEvents.map((event) => ({
      name: event.title,
      y: Number(event.bookingCount || 0),
    }));

    const cancelledCountData = allEvents.map((event) => ({
      name: event.title,
      y: Number(event.cancelledCount || 0),
    }));

    const bookingCapacityData = allEvents.map((event) => ({
      name: event.title,
      y: Number(event.capacity || 0),
    }));

    const bookingPriceData = allEvents.map((event) => ({
      name: event.title,
      y: Number(event.bookingPrice || 0),
    }));

    allEvents.forEach((event) => {
      const status = getStatus(event.date, event.time);
      statusCount[status] += 1;
    });

    const chartData = [
      { name: "Upcoming", y: statusCount.UPCOMING },
      { name: "Live",     y: statusCount.LIVE },
      { name: "Completed",y: statusCount.COMPLETED },
    ];

    setEventStatus(chartData);
    setBookingCount(bookingCountData);
    setBookingCapacity(bookingCapacityData);
    setBookingRevenue(bookingPriceData);
    setDashBoardStatistics(modifiedStats);
    setCancelledCount(cancelledCountData);
  };

  const loadTickets = async () => {
    const response = await ApiService.get("/tickets/list");
    const tickets = response?.data || [];

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentBookings = tickets
      .filter((ticket) => new Date(ticket.createdAt) >= twentyFourHoursAgo)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const formatted = recentBookings.map((item) => ({
      id: item.id,
      user: item.user?.name || "—",
      event: item.event?.title || "Untitled Event",
      date: formatDate(item.event?.date),
      time: item.event?.time || "—",
      tickets: item.seats?.join(", ") || "—",
      price: item.price,
      status: getStatus(item.event?.date, item.event?.time),
    }));

    setBookings(formatted);
  };

  useEffect(() => {
    loadEvents();
    loadTickets();
  }, []);

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-zinc-900/90 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <header className="pb-8">
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          </div>
          </div>
          <p className="mt-2 text-slate-300">
            Overview of your ticket booking platform
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
          {dashBoardStatasctics.map((stat) => (
            <div
              key={stat.id}
              className={`
                bg-gradient-to-br ${stat.color}
                rounded-2xl p-6 shadow-lg relative overflow-hidden
                hover:shadow-xl transition-shadow
              `}
            >
              <div className="absolute top-4 right-4 opacity-20">
                <stat.icon size={64} />
              </div>
              <p className="text-sm font-medium text-white/90 mb-1">{stat.title}</p>
              <p className="text-4xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Bar Chart */}
          <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-2">Event Performance</h3>
            <p className="text-slate-400 text-sm mb-6">
              Bookings, capacity, cancellations & revenue
            </p>
            <div className="h-[400px]">
              {bookingCapacity.length === 0 &&
              bookingCount.length === 0 &&
              bookingRevenue.length === 0 &&
              cancelCount.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500">
                  No data available
                </div>
              ) : (
                <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
              )}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-2">Event Status Distribution</h3>
            <p className="text-slate-400 text-sm mb-6">
              Upcoming • Live • Completed
            </p>
            <div className="h-[400px] flex items-center justify-center">
              {eventStatus.length === 0 ? (
                <div className="text-slate-500">No events to display</div>
              ) : (
                <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
              )}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        {bookings.length > 0 && (
          <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Bookings</h2>
              <button
                onClick={() => navigate("/admin/bookings")}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1"
              >
                View all →
              </button>
            </div>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-slate-500 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-white">{booking.event}</h4>
                      <p className="text-sm text-slate-400 mt-1">
                        {booking.user} • {booking.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1 text-xs font-medium bg-cyan-950 text-cyan-300 rounded-full border border-cyan-800/50">
                        {booking.tickets} seats
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                          booking.status === "LIVE"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                            : booking.status === "UPCOMING"
                            ? "bg-amber-950 text-amber-300 border border-amber-800/50"
                            : "bg-slate-700 text-slate-300 border border-slate-600/50"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;