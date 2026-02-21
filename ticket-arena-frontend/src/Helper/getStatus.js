// const getStatus = (eventDate, eventTime) => {
//   const now = new Date();

//   const eventStart = new Date(`${eventDate.split("T")[0]}T${eventTime}`);

//   const eventEnd = new Date(`${eventDate.split("T")[0]}T23:59:59`);

//   if (now < eventStart) return "UPCOMING";

//   if (now >= eventStart && now <= eventEnd) return "LIVE";

//   return "COMPLETED";
// };

// export default getStatus;
// Helper to calculate event status considering timezones
const getStatus = (eventDateISO, eventTime) => {
  const now = new Date();

  // Parse event date + time in local time
  const eventDate = new Date(eventDateISO);
  if (eventTime) {
    const [hours, minutes] = eventTime.split(":").map(Number);
    eventDate.setHours(hours, minutes, 0, 0);
  } else {
    eventDate.setHours(0, 0, 0, 0);
  }

  // End of event = end of the day in event's local time
  const eventEnd = new Date(eventDate);
  eventEnd.setHours(23, 59, 59, 999);

  if (now < eventDate) return "UPCOMING";
  if (now >= eventDate && now <= eventEnd) return "LIVE";
  return "COMPLETED";
};

export default getStatus;
