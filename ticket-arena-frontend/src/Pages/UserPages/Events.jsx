import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import BookingModal from "../../Components/BookingModal.jsx";
import { ApiService } from "../../Services/ApiService.js";
import { getTeamsFromDescription } from "../../Helper/teamLogos";

const Events = () => {
  const user = JSON.parse(localStorage.getItem("authDetail-tickethub") || "{}");
  const id = user?.id;

  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Load all events
  const loadEvents = async () => {
    try {
      const res = await ApiService.post("/events/list", {
        isAdminEvent: true, // fetch all events including inactive/pending
      });

      const formattedData = (res.data.events || []).map((event) => {
        const dateObj = new Date(event.date);
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
        return {
          ...event,
          date: formattedDate,
          booked: Number(event.booked || 0),
          capacity: Number(event.capacity || 1),
        };
      });

      setEvents(formattedData);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Handle booking
  const handleBooking = async (data) => {
    try {
      const payload = {
        eventId: data.id,
        userId: id,
        price: data.price,
        noOfTickets: data.ticketCount,
        seats: data.seats,
      };

      const response = await ApiService.post("/tickets/add", payload);
      alert(response?.description || "Booking successful!");
      loadEvents();
      setOpen(false);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book tickets. Please try again.");
    }
  };

  return (
    <>
      <div className="relative min-h-screen text-white">
        {/* BACKGROUND */}
        <img
          src="/Stadium.png"
          className="fixed inset-0 h-full w-full object-cover -z-20"
          alt="bg"
        />
        <div className="fixed inset-0 bg-black/70 -z-10" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Matches Dashboard
            </h1>
            <p className="text-lg text-white/90 drop-shadow-md">
              Manage and book tickets for upcoming matches
            </p>
          </div>

          {/* Event Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 place-items-center gap-x-8 gap-y-12 pb-20">
            {events.map((event) => {
              const teams = getTeamsFromDescription(event.description);
              const availability = 100 - (event.booked / event.capacity) * 100;

              return (
                <div
                  key={event.id}
                  className="w-full max-w-[820px] h-[460px] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20"
                >
                  <div className="h-full p-5 md:p-8 flex flex-col justify-between">
                    {/* Event Title */}
                    <div className="text-center mt-1">
                      <h2 className="text-2xl md:text-3xl font-bold drop-shadow-md">
                        {event.title}
                      </h2>
                    </div>

                    {/* Venue */}
                    <div className="flex justify-center items-center mt-1 text-sm md:text-base opacity-90 gap-1">
                      <MapPin size={16} />
                      <span>{event.venue}</span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex justify-center items-center gap-4 text-sm md:text-base opacity-90">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    {/* Teams */}
                    {teams && (
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center gap-3">
                          <img
                            src={teams.teamA.logo}
                            alt={teams.teamA.name}
                            className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain drop-shadow-lg"
                          />
                          <h3 className="text-lg font-semibold drop-shadow-md">
                            {teams.teamA.name}
                          </h3>
                        </div>

                        <div className="relative flex items-center justify-center">
                          <div className="absolute w-20 h-20 rounded-full bg-red-500/30 blur-xl animate-pulse" />
                          <div className="relative w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl font-extrabold tracking-wide animate-pulse text-white shadow-lg">
                            V/S
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <img
                            src={teams.teamB.logo}
                            alt={teams.teamB.name}
                            className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain drop-shadow-lg"
                          />
                          <h3 className="text-lg font-semibold drop-shadow-md">
                            {teams.teamB.name}
                          </h3>
                        </div>
                      </div>
                    )}

                    {/* Availability */}
                    <div className="mt-1">
                      <div className="flex justify-between text-sm mb-1 opacity-90">
                        <span>Availability</span>
                        <span>{Math.round(availability)}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full transition-all"
                          style={{ width: `${availability}%` }}
                        />
                      </div>
                    </div>

                    {/* Price & Book Button */}
                    <div className="flex items-center justify-between mt-1">
                      <div>
                        <p className="text-sm opacity-90">Price</p>
                        <p className="text-2xl font-bold">₹{event.price}</p>
                      </div>
                      <button
                        disabled={!event.active || availability <= 0}
                        className={`px-8 py-3 rounded-full ${
                          event.active && availability > 0
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-gray-600 cursor-not-allowed text-gray-300"
                        } transition font-semibold shadow-lg`}
                        onClick={() => {
                          setSelectedEvent(event);
                          setOpen(true);
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {open && selectedEvent && (
        <BookingModal
          event={selectedEvent}
          isOpen={open}
          onConfirm={handleBooking}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Events;
