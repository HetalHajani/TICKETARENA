import { useEffect, useState } from "react";
import { Calendar, Clock, Ticket, Download, X } from "lucide-react";
import formatDate from "../../Helper/formatDate";
import getStatus from "../../Helper/getStatus";
import { ApiService } from "../../Services/ApiService";

const statusStyles = {
  UPCOMING: "bg-orange-500/20 text-orange-400",
  COMPLETED: "bg-emerald-500/20 text-emerald-400",
  LIVE: "bg-emerald-500/20 text-emerald-400",
  CANCELLED: "bg-red-500/20 text-red-400",
};

const formatBookedOn = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/* ---------------- MODAL ---------------- */
const CancelModal = ({ booking, onClose, onConfirm }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-500/20">
            <X size={36} className="text-red-500" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-2 text-white drop-shadow-md">
          Cancel Booking
        </h2>
        <p className="text-sm text-gray-200 text-center mb-6">
          Are you sure you want to cancel this booking?
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 border border-white/30 bg-white/10 text-white rounded-full py-2 text-sm hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(booking)}
            className="flex-1 bg-red-500 text-white rounded-full py-2 text-sm hover:bg-red-600 transition-all shadow-lg"
          >
            Sure
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- MAIN PAGE ---------------- */
const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const id = JSON.parse(localStorage.getItem("authDetail-tickethub")).id;

  const loadEventsByUser = async () => {
    const response = await ApiService.get(`/tickets/list/${id}`);

    const mapped = response.data.map((b) => ({
      id: b.id,
      eventName: b.event.title,
      status: getStatus(b.event.date, b.event.time),
      date: formatDate(b.event.date),
      time: b.event.time,
      tickets: b.seats.join(", "),
      bookedOn: formatBookedOn(b.createdAt),
    }));

    setBookings(mapped);
  };

  useEffect(() => {
    loadEventsByUser();
  }, []);

  const handleDownload = async (booking) => {
    const response = await ApiService.postBlob(
      "/tickets/export/excel",
      Array.isArray(booking) ? booking : [booking]
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tickets.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen text-white">
      {/* BACKGROUND */}
      <img
        src="/Stadium.png"
        className="fixed inset-0 h-full w-full object-cover -z-20"
        alt="bg"
      />
      <div className="fixed inset-0 bg-black/70 -z-10" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-semibold">
            My Bookings
          </h1>
          <p className="text-sm md:text-base text-gray-300 mt-1">
            View and manage all your ticket bookings
          </p>
        </div>

        {/* BOOKINGS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center gap-x-8 gap-y-10">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="w-full sm:w-[90%] md:w-[100%] lg:w-[360px] xl:w-[400px] rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 p-6 md:p-8 hover:scale-[1.03] transition-all min-h-[380px] flex flex-col justify-between"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-semibold text-lg md:text-xl">
                    {booking.eventName}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Booking ID: {booking.id}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyles[booking.status]}`}
                >
                  {booking.status}
                </span>
              </div>

              {/* DETAILS */}
              <div className="space-y-4 text-sm md:text-base">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-orange-400" />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-blue-400" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Ticket size={16} className="text-purple-400" />
                  <span>{booking.tickets} Seat(s)</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Booked on {booking.bookedOn}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => handleDownload(booking)}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl py-3 text-sm md:text-base transition-all"
                >
                  <Download size={16} />
                  Download
                </button>

                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowCancelModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl py-3 text-sm md:text-base transition-all"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="text-center text-gray-400 mt-16">
            No bookings found.
          </div>
        )}
      </div>

      {showCancelModal && (
        <CancelModal
          booking={selectedBooking}
          onClose={() => setShowCancelModal(false)}
          onConfirm={async (bookingToCancel) => {
            await ApiService.delete(`/tickets/delete/${bookingToCancel.id}`);
            setShowCancelModal(false);
            loadEventsByUser();
          }}
        />
      )}
    </div>
  );
};

export default MyBookings;
