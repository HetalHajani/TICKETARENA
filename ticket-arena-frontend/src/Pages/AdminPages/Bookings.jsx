import { useEffect, useState } from "react";
import {
  Pencil,
  X,
  Download,
  ChevronDown,
  Search,
  XCircle,
} from "lucide-react";
import getStatus from "../../Helper/getStatus";
import formatDate from "../../Helper/formatDate";
import EditBookingModal from "../../Components/EditBookingModal";
import { ApiService } from "../../Services/ApiService";

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [eventFilter, setEventFilter] = useState("");

  const loadTickets = async () => {
    const response = await ApiService.get("/tickets/list");
    const tickets = response?.data || [];

    const formatted = tickets.map((item) => ({
      id: item.id,
      user: item.user?.name || "—",
      event: item.event?.title || "Untitled",
      date: formatDate(item.event?.date),
      rawDate: item.event?.date,
      time: item.event?.time || "—",
      venue:item.event?.venue,
      tickets: item.seats?.join(", ") || "—",
      price: item.price,
      status: getStatus(item.event?.date, item.event?.time),
      capacity: item?.event?.capacity,
    }));

    setBookings(formatted);
    setFilteredBookings(formatted);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    let temp = [...bookings];

    if (searchTerm.trim() !== "") {
      temp = temp.filter(
        (b) =>
          b.id.toString().includes(searchTerm) ||
          b.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.event?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "") {
      temp = temp.filter((b) => b.status === statusFilter);
    }

    if (eventFilter !== "") {
      temp = temp.filter((b) => b.event === eventFilter);
    }

    setFilteredBookings(temp);
  }, [searchTerm, statusFilter, eventFilter, bookings]);

  const openEditModal = (booking) => {
    setSelectedBooking(booking);
    setIsEditOpen(true);
  };

  const closeModal = () => {
    setIsEditOpen(false);
    setSelectedBooking(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (data) => {
    await ApiService.put(`/tickets/update/${data.id}`, data);
    loadTickets();
    closeModal();
  };

  const deleteBooking = async (booking) => {
    await ApiService.delete(`/tickets/delete/${booking.id}`);
    loadTickets();
  };

  const handleExport = async (booking) => {
    try {
      const response = await ApiService.postBlob(
        "/tickets/export/excel",
        Array.isArray(booking) ? booking : [booking],
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tickets.xlsx");

      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Excel download error:", error);
    }
  };

  const eventNames = bookings.map((b) => b.event);
  const uniqueEvents = [...new Set(eventNames)].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-zinc-900/90 text-slate-100 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 space-y-3">
        {/* Title - big, gradient */}
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Manage Bookings
        </h1>

        {/* Subtitle - below the title */}
        <p className="text-slate-300 text-lg">
          View, edit, and manage all ticket bookings
        </p>
      </div>

      {/* Filters & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-3 w-full">
          {/* Search */}
          <div className="relative flex-1 min-w-[280px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by ID, user, or match..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900/60 border border-slate-700/70 rounded-full text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-5 py-3 pr-10 bg-slate-900/60 border border-slate-700/70 rounded-full text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            >
              <option value="">All Status</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="LIVE">Live</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400"
              size={18}
            />
          </div>

          {/* Event Filter */}
          <div className="relative">
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="appearance-none px-5 py-3 pr-10 bg-slate-900/60 border border-slate-700/70 rounded-full text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            >
              <option value="">All Match</option>
              {uniqueEvents.map((event, index) => (
                <option key={index} value={event}>
                  {event}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400"
              size={18}
            />
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={() => handleExport(filteredBookings)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-orange-500 hover:to-amber-500 transition-all duration-300 whitespace-nowrap"
        >
          <Download size={18} /> Export
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gradient-to-r from-cyan-950/90 to-purple-950/90">
              <tr>
                <th className="p-5 font-semibold text-cyan-200">Booking ID</th>
                <th className="p-5 font-semibold text-cyan-200">User</th>
                <th className="p-5 font-semibold text-cyan-200">Match</th>
                <th className="p-5 font-semibold text-cyan-200">Date</th>
                <th className="p-5 font-semibold text-cyan-200">Time</th>
                <th className="p-5 font-semibold text-cyan-200">Venue</th>
                <th className="p-5 font-semibold text-cyan-200">Tickets</th>
                <th className="p-5 font-semibold text-cyan-200">Status</th>
                <th className="p-5 text-center font-semibold text-cyan-200">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700/40">
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-slate-800/60 transition-colors duration-150"
                >
                  <td className="p-5 text-slate-200 font-medium">
                    {booking.id}
                  </td>
                  <td className="p-5 text-slate-200">{booking.user}</td>
                  <td className="p-5 text-slate-200">{booking.event}</td>
                  <td className="p-5 text-slate-300">{booking.date}</td>
                  <td className="p-5 text-slate-300">{booking.time}</td>
                  <td className="p-5 text-slate-300">{booking.venue}</td>
                  <td className="p-5 text-slate-200">{booking.tickets}</td>

                  <td className="p-5">
                    <span
                      className={`inline-flex px-4 py-1.5 text-xs font-semibold rounded-full capitalize tracking-wide shadow-sm
                        ${
                          booking.status === "UPCOMING"
                            ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white border border-orange-500/40"
                            : booking.status === "LIVE"
                              ? "bg-gradient-to-r from-yellow-600 to-amber-600 text-white border border-amber-500/40"
                              : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-500/40"
                        }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="p-5 text-center flex items-center justify-center gap-4">
                    <button
                      onClick={() => openEditModal(booking)}
                      className="p-2.5 rounded-full bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 hover:text-cyan-200 transition-all duration-200 shadow-sm hover:shadow-cyan-500/20"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => deleteBooking(booking)}
                      className="p-2.5 rounded-full bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-red-200 transition-all duration-200 shadow-sm hover:shadow-red-500/20"
                    >
                      <XCircle size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="py-16 text-center text-slate-400 text-lg">
            No bookings found matching your filters
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditBookingModal
        isEditOpen={isEditOpen}
        selectedBooking={selectedBooking}
        closeModal={closeModal}
        handleChange={handleChange}
        handleSave={handleSave}
      />
    </div>
  );
}
