import { useState, useEffect } from "react";
import { Calendar, Clock, Users, Armchair } from "lucide-react";
import generateSeats from "../Helper/generateSeat";

const BookingModal = ({ event, isOpen, onClose, onConfirm }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lockTimer, setLockTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!event) return;

    const generated = generateSeats(event.capacity || 0);
    const bookedSeats = (event.allSeats || []).flat();

    const finalSeats = generated.map((s) =>
      bookedSeats.includes(s.number) ? { ...s, isBooked: true } : s
    );

    setSeats(finalSeats);
  }, [event]);

  useEffect(() => {
    if (selectedSeats.length === 0) return;

    if (lockTimer) clearTimeout(lockTimer);
    setTimeLeft(120);

    const timer = setTimeout(() => {
      setSeats((prev) =>
        prev.map((s) =>
          selectedSeats.includes(s.number) ? { ...s, isBooked: false } : s
        )
      );
      setSelectedSeats([]);
    }, 2 * 60 * 1000);

    setLockTimer(timer);
  }, [selectedSeats]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  if (!isOpen || !event) return null;

  const toggleSeat = (seat) => {
    if (seat.isBooked) return;

    setSelectedSeats((prev) =>
      prev.includes(seat.number)
        ? prev.filter((num) => num !== seat.number)
        : [...prev, seat.number]
    );
  };

  const pricePerTicket = event.price;
  const total = (selectedSeats.length * pricePerTicket).toFixed(2);

  const groupedSeats = seats.reduce((group, seat) => {
    const row = seat.number.charAt(0);
    if (!group[row]) group[row] = [];
    group[row].push(seat);
    return group;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto backdrop-blur-sm">
      <div 
        className="
          bg-gradient-to-b from-[#f8faff] to-[#e8f0ff]   /* ← Light elegant background */
          w-full max-w-4xl 
          min-h-[60vh]                  /* ← Reduced height (was 80vh) */
          p-6 md:p-8 
          rounded-3xl 
          shadow-2xl 
          border border-[#005EB8]/20
          text-[#001F3F]                /* Dark text for contrast */
          overflow-y-auto
          relative
        "
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#003087] tracking-tight">
            {event.title}
          </h2>
          <button
            className="text-[#001F3F] hover:text-[#C8102E] text-4xl font-bold transition-colors"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* EVENT INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-[#005EB8]/20 mb-6 shadow-sm">
          <div className="flex items-center gap-3 text-[#003087]">
            <Calendar size={20} /> <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-3 text-[#003087]">
            <Clock size={20} /> <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-3 text-[#003087]">
            <Users size={20} />{" "}
            <span>{event.capacity - (event.allSeats || []).flat().length} seats left</span>
          </div>
          {timeLeft > 0 && (
            <div className="col-span-full text-center text-[#C8102E] font-bold text-base mt-2">
              Seats reserved for: {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          )}
        </div>

        {/* SCREEN */}
        <div className="text-center text-[#003087] font-semibold text-lg mb-4 tracking-wider">
           SELECT YOUR SEATS
        </div>
        <div className="mx-auto w-4/5 h-2 bg-red-600 rounded-full mb-8 shadow"></div>

        {/* SEAT SELECTION */}
        <div className="space-y-8 max-h-[320px] overflow-y-auto pr-3 pb-4">
          {Object.keys(groupedSeats).map((rowKey) => {
            const rowSeats = groupedSeats[rowKey];
            const seatSize =
              seats.length > 300
                ? "w-8 h-8"
                : seats.length > 150
                ? "w-9 h-9"
                : seats.length > 80
                ? "w-10 h-10"
                : "w-11 h-11";

            return (
              <div key={rowKey} className="grid place-items-center">
                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(14, rowSeats.length)}, 1fr)`,
                  }}
                >
                  {rowSeats.map((seat) => (
                    <div key={seat.number} className="flex flex-col items-center">
                      <button
                        onClick={() => toggleSeat(seat)}
                        disabled={seat.isBooked}
                        className={`
                          ${seatSize}
                          flex items-center justify-center rounded-xl border-2 transition-all duration-200
                          ${
                            seat.isBooked
                              ? "bg-gray-200 border-gray-400 cursor-not-allowed opacity-60"
                              : selectedSeats.includes(seat.number)
                              ? "bg-[#005EB8] border-[#C8102E] scale-110 shadow-[0_0_12px_rgba(0,94,184,0.5)] text-white"
                              : "bg-white border-[#005EB8]/60 hover:bg-[#005EB8]/10 hover:border-[#005EB8] hover:scale-105 text-[#001F3F]"
                          }
                        `}
                      >
                        <Armchair
                          size={
                            seatSize.includes("w-8") ? 16 :
                            seatSize.includes("w-9") ? 18 :
                            seatSize.includes("w-10") ? 20 : 22
                          }
                          className={`
                            ${seat.isBooked ? "text-gray-500" : ""}
                            ${selectedSeats.includes(seat.number) ? "text-white" : "text-[#003087]"}
                          `}
                        />
                      </button>
                      <span className="mt-2 text-xs font-semibold text-[#001F3F]/80">
                        {seat.number}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* PRICE BOX */}
        <div className="bg-white/90 backdrop-blur-sm border border-[#005EB8]/30 p-5 mt-6 rounded-2xl shadow-sm">
          <div className="flex justify-between text-[#001F3F] mb-3">
            <span className= "font-bold text-lg text-[#003087] tracking-wide">Selected Seats:</span>
            <span className="font-medium">{selectedSeats.join(", ") || "None"}</span>
          </div>
          <div className="flex justify-between text-[#001F3F] mb-4">
            <span className= "font-bold text-lg text-[#003087] tracking-wide">Price per ticket:</span>
            <span>₹{pricePerTicket}</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-[#005EB8]/20">
            <span className="text-lg font-bold text-[#005EB]">Total:</span>
            <span className="text-2xl font-bold text-[#C8102E]">₹{total}</span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <button
            onClick={onClose}
            className="w-full sm:w-[48%] py-3 rounded-full bg-gray-200 text-[#001F3F] hover:bg-gray-300 border border-[#005EB8]/30 font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ ...event, total, seats: selectedSeats })}
            disabled={selectedSeats.length === 0}
            className="w-full sm:w-[48%] py-3 rounded-full bg-red-600 text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;