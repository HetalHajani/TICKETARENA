import { useState, useEffect } from "react";
import { Armchair, X } from "lucide-react";
import generateSeats from "../Helper/generateSeat";

const EditBookingModal = ({
  isEditOpen,
  selectedBooking,
  closeModal,
  handleChange,
  handleSave,
}) => {
  if (!isEditOpen || !selectedBooking) return null;

  const initialSeats = selectedBooking.tickets
    ? selectedBooking.tickets.split(",").map((s) => s.trim())
    : [];

  const [selectedSeats, setSelectedSeats] = useState(initialSeats);

  useEffect(() => {
    setSelectedSeats(
      selectedBooking.tickets
        ? selectedBooking.tickets.split(",").map((s) => s.trim())
        : []
    );
  }, [selectedBooking]);

  const allSeats = generateSeats(selectedBooking.capacity);

  const bookedSeatsInEvent = selectedBooking.allSeats
    ? selectedBooking.allSeats.flat()
    : [];

  const disabledSeats = bookedSeatsInEvent.filter(
    (seat) => !initialSeats.includes(seat)
  );

  const toggleSeat = (seat) => {
    if (disabledSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const saveBooking = () => {
    handleSave({
      ...selectedBooking,
      seats: selectedSeats,
      tickets: selectedSeats.join(", "),
    });
  };

  const seatSize =
    allSeats.length > 300
      ? "w-7 h-7"
      : allSeats.length > 150
      ? "w-8 h-8"
      : allSeats.length > 80
      ? "w-9 h-9"
      : "w-10 h-10";

  const groupedSeats = {};
  for (let seat of allSeats) {
    const row = seat.number[0];
    if (!groupedSeats[row]) groupedSeats[row] = [];
    groupedSeats[row].push(seat);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Modal */}
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl
        bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950
        border border-slate-700/60 shadow-2xl p-6">

        {/* Close */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition"
        >
          <X size={18} className="text-slate-300" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-slate-100">Edit Booking</h2>
        <p className="text-sm text-slate-400 mb-6">
          Update the booking details below
        </p>

        {/* Content */}
        <div className="space-y-4 overflow-hidden flex-1">

          {/* Event */}
          <div>
            <label className="text-sm text-slate-400">Event Title</label>
            <input
              name="event"
              value={selectedBooking.event || ""}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 rounded-xl
                bg-slate-800 border border-slate-700
                text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Date / Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400">Date</label>
              <input
                name="date"
                value={selectedBooking.date || ""}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 rounded-xl
                  bg-slate-800 border border-slate-700 text-slate-100"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">Time</label>
              <input
                name="time"
                value={selectedBooking.time || ""}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 rounded-xl
                  bg-slate-800 border border-slate-700 text-slate-100"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="text-sm text-slate-400">Price (₹)</label>
            <input
              name="price"
              value={selectedBooking.price || ""}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 rounded-xl
                bg-slate-800 border border-slate-700 text-slate-100"
            />
          </div>

          {/* Seats */}
          <div>
            <label className="text-sm text-slate-400">Select Seats</label>

            <div className="mt-4 max-h-[260px] overflow-y-auto rounded-xl
              bg-slate-800/60 border border-slate-700 p-4 space-y-10">

              {Object.keys(groupedSeats).map((rowKey) => (
                <div key={rowKey} className="grid place-items-center">
                  <div
                    className="grid gap-3"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(
                        12,
                        groupedSeats[rowKey].length
                      )}, 1fr)`,
                    }}
                  >
                    {groupedSeats[rowKey].map((seat) => {
                      const isDisabled = disabledSeats.includes(seat.number);
                      const isSelected = selectedSeats.includes(seat.number);

                      return (
                        <div key={seat.number} className="flex flex-col items-center">
                          <button
                            onClick={() => toggleSeat(seat.number)}
                            disabled={isDisabled}
                            className={`
                              ${seatSize}
                              flex items-center justify-center rounded-lg border transition
                              ${
                                isDisabled
                                  ? "bg-slate-700 border-slate-600 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-cyan-600 border-cyan-500 shadow scale-105"
                                  : "bg-slate-900 border-slate-600 hover:bg-slate-700"
                              }
                            `}
                          >
                            <Armchair
                              size={16}
                              className={
                                isDisabled
                                  ? "text-slate-500"
                                  : isSelected
                                  ? "text-white"
                                  : "text-cyan-400"
                              }
                            />
                          </button>

                          <span className="mt-1 text-[10px] text-slate-400">
                            {seat.number}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-sm text-slate-300">
              Selected:{" "}
              {selectedSeats.length ? selectedSeats.join(", ") : "None"}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={closeModal}
            className="px-6 py-2.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={saveBooking}
            className="px-6 py-2.5 rounded-full
              bg-gradient-to-r from-cyan-600 to-blue-600
              text-white shadow-lg hover:from-cyan-500 hover:to-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
