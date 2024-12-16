import React, { useState } from "react";

const PriceToggle = () => {
  const [isToggled, setIsToggled] = useState(false); // Estado para controlar el switch

  const handleToggle = () => {
    setIsToggled(!isToggled); // Cambia el estado al hacer clic
  };

  return (
    <div className="hidden md:flex items-center border-2 rounded-lg px-4 py-2 h-12 w-fit space-x-4 shadow-sm">
      <p className="text-gray-700 font-medium">
        Precio total {isToggled ? "con impuestos" : "sin impuestos"}
      </p>

      <div
        onClick={handleToggle}
        className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${isToggled ? "bg-blue-500" : "bg-gray-300"
          }`}
      >

        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isToggled ? "translate-x-4" : "translate-x-0"
            }`}
        ></div>
      </div>
    </div>
  );
};

export default PriceToggle;