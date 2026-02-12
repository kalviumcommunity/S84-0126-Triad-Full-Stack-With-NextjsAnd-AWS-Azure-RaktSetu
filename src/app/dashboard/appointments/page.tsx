"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";

function generateCalendar(month: number, year: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return [...blanks, ...days];
}

export default function AppointmentsPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(
    today.getDate()
  );

  const calendarDays = generateCalendar(currentMonth, currentYear);

  const changeMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDate(null);
  };

  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    { month: "long" }
  );

  // Dummy Appointment Data
  const appointments = [
    {
      id: 1,
      name: "Rahul Sharma",
      blood: "A+",
      time: "10:00 AM",
      location: "City Blood Bank",
      status: "Scheduled",
    },
    {
      id: 2,
      name: "Priya Patel",
      blood: "B+",
      time: "11:30 AM",
      location: "City Blood Bank",
      status: "Scheduled",
    },
    {
      id: 3,
      name: "Amit Kumar",
      blood: "O+",
      time: "2:00 PM",
      location: "Red Cross Center",
      status: "Scheduled",
    },
    {
      id: 4,
      name: "Sneha Gupta",
      blood: "AB-",
      time: "9:00 AM",
      location: "Apollo Blood Bank",
      status: "Completed",
    },
    {
      id: 5,
      name: "Vikram Singh",
      blood: "O-",
      time: "3:00 PM",
      location: "City Blood Bank",
      status: "No-Show",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Appointments</h1>
        <p className="text-black mt-1">
          Schedule and manage donation appointments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — Calendar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border self-start h-fit">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft />
            </button>

            <h2 className="font-semibold text-lg text-black">
              {monthName} {currentYear}
            </h2>

            <button
              onClick={() => changeMonth(1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 text-center text-sm font-medium text-black mb-2">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-7 gap-2 text-center text-sm text-black">
            {calendarDays.map((day, index) =>
              day ? (
                <div
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedDate === day
                      ? "bg-red-600 text-white font-semibold scale-105"
                      : "hover:bg-gray-100 hover:scale-105"
                  }`}
                >
                  {day}
                </div>
              ) : (
                <div key={index}></div>
              )
            )}
          </div>

          <button className="mt-6 w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-all duration-300 hover:scale-[1.02] active:scale-95">
            + Schedule Appointment
          </button>
        </div>

        {/* RIGHT — Today's Appointments */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Today’s Appointments (3)
          </h2>

          <div className="space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-red-600 text-white font-bold w-12 h-12 flex items-center justify-center rounded-lg">
                    {appt.blood}
                  </div>

                  <div>
                    <p className="font-semibold text-black">{appt.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {appt.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {appt.location}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      appt.status === "Scheduled" && "bg-blue-100 text-blue-600"
                    } ${
                      appt.status === "Completed" &&
                      "bg-green-100 text-green-600"
                    } ${
                      appt.status === "No-Show" && "bg-red-100 text-red-600"
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>

                {appt.status === "Scheduled" && (
                  <div className="flex gap-2">
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
                      Complete
                    </button>
                    <button className="border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
                      Reschedule
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
