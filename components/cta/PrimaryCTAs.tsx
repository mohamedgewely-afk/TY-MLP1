import React from "react";
import { analytics } from "../../utils/analytics";

export const PrimaryCTAs: React.FC = () => {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4">
        <button
          onClick={() => analytics.track("reserve_online")}
          className="flex-1 bg-[var(--brand-primary)] text-white px-6 py-4 rounded-md"
        >
          Reserve Online
        </button>
        <button onClick={() => analytics.track("book_test_drive")} className="flex-1 border border-white/6 px-6 py-4 rounded-md text-white">
          Book Test Drive
        </button>
        <button onClick={() => analytics.track("service_booking")} className="flex-1 border border-white/6 px-6 py-4 rounded-md text-white">
          Service Booking
        </button>
      </div>
    </section>
  );
};