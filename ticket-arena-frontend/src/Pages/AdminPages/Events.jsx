import { useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  Users,
  IndianRupee,
  X,
} from "lucide-react";

import { ApiService } from "../../Services/ApiService";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    capacity: 100,
    price: 0,
  });

  /* ---------------- LOAD EVENTS ---------------- */
  const loadEvents = async () => {
    const res = await ApiService.post("/events/list", {
      isAdminEvent: true,
      isEventPage: true,
    });
    setEvents(res.data.events || []);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  /* ---------------- FORM VALIDATION ---------------- */
  const validateForm = () => {
    let newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Event title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Event date is required";
    if (!formData.time) newErrors.time = "Event time is required";
    if (formData.capacity <= 0)
      newErrors.capacity = "Capacity must be greater than 0";
    if (formData.price < 0) newErrors.price = "Price cannot be negative";
    if (!formData.venue.trim()) newErrors.venue = "venue is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- MODAL HANDLERS ---------------- */
  const openAddModal = () => {
    setEditingEvent(null);
    setErrors({});
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      capacity: 100,
      price: 0,
      venue: "",
    });
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setErrors({});
    setFormData({ ...event });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    if (editingEvent) {
      await ApiService.put(`/events/${editingEvent.id}`, formData);
    } else {
      await ApiService.post("/events", formData);
    }

    setShowModal(false);
    loadEvents();
  };

  const handleDelete = async (id) => {
    await ApiService.delete(`/events/${id}`);
    loadEvents();
  };

  const toggleStatus = async (event) => {
    await ApiService.put(`/events/${event.id}`, {
      active: !event.active,
    });
    loadEvents();
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-zinc-900/90 text-slate-100 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Manage Events
          </h1>
          <p className="text-slate-300 mt-2">Create and manage your events</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-orange-500 hover:to-amber-500 transition-all duration-300"
        >
          <Plus size={18} /> Add Event
        </button>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const progress = (
            (parseInt(event.bookingCount || 0) / event.capacity) *
            100
          ).toFixed(1);

          return (
            <div
              key={event.id}
              className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {event.title}
                  </h2>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full mt-2 inline-block ${
                      event.active
                        ? "bg-emerald-600/80 text-emerald-100"
                        : "bg-red-600/80 text-red-100"
                    }`}
                  >
                    {event.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => openEditModal(event)}
                    className="p-2 rounded-full bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 hover:text-cyan-200 transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 rounded-full bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-red-200 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <p className="text-slate-300 text-sm mb-2 line-clamp-2">
                {event.description}
              </p>
              <p className="flex items-center gap-1 text-slate-300 text-sm mb-6 line-clamp-2">
                <MapPin size={16} />
                <span>{event.venue}</span>
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl">
                  <Calendar size={18} className="text-cyan-400" />
                  <div className="text-sm">
                    <p className="text-slate-400">Date</p>
                    <p className="text-white">{event.date.split("T")[0]}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl">
                  <Clock size={18} className="text-purple-400" />
                  <div className="text-sm">
                    <p className="text-slate-400">Time</p>
                    <p className="text-white">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl">
                  <Users size={18} className="text-yellow-400" />
                  <div className="text-sm">
                    <p className="text-slate-400">Capacity</p>
                    <p className="text-white">
                      {event.bookingCount || 0} / {event.capacity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl">
                  <IndianRupee size={18} className="text-emerald-400" />
                  <div className="text-sm">
                    <p className="text-slate-400">Price</p>
                    <p className="text-white">₹{event.price}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-slate-300 mb-2">
                  <span>Bookings</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Toggle Status */}
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Event Status</span>
                <button
                  onClick={() => toggleStatus(event)}
                  className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300 ${
                    event.active ? "bg-cyan-600" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute left-1 inline-block w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
                      event.active ? "translate-x-6" : "translate-x-0"
                    } shadow-md`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">
                {editingEvent ? "Edit Event" : "Add New Event"}
              </h2>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Event Title
                  </label>
                  <input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    placeholder="Enter event title"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all h-28 resize-none"
                    placeholder="Describe the event..."
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* venue */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    venue
                  </label>
                  <textarea
                    value={formData.venue}
                    onChange={(e) =>
                      setFormData({ ...formData, venue: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all h-16 resize-none"
                    placeholder="Enter venue"
                  />
                  {errors.venue && (
                    <p className="text-red-400 text-sm mt-1">{errors.venue}</p>
                  )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    />
                    {errors.date && (
                      <p className="text-red-400 text-sm mt-1">{errors.date}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    />
                    {errors.time && (
                      <p className="text-red-400 text-sm mt-1">{errors.time}</p>
                    )}
                  </div>
                </div>

                {/* Capacity & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          capacity: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    />
                    {errors.capacity && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.capacity}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    />
                    {errors.price && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {editingEvent ? "Update Event" : "Create Event"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
