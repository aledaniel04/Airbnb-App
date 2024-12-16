import React from "react";

const CountersSection = ({ counters, incrementCounter, decrementCounter }) => (
  <div className="mb-6">
    <p className="text-sm font-medium text-gray-700">Agrega algunos datos básicos sobre tu espacio</p>
    {["Huespedes", "Habitaciones", "Camas", "Baños"].map((field) => (
      <div className="flex items-center justify-between mt-2" key={field}>
        <p className="capitalize">{field}</p>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => decrementCounter(field)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            -
          </button>
          <span>{counters[field]}</span>
          <button
            type="button"
            onClick={() => incrementCounter(field)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            +
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default CountersSection;
