import React, { useState, useRef } from "react";
import Tshirt from "../assets/tshirt.png";

const TShirtDesigner = () => {
  const [logo, setLogo] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState(100); // Percentage for resizing
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    if (logo) {
      setIsDragging(true);
      const offsetX = e.clientX - position.x;
      const offsetY = e.clientY - position.y;
      setDragOffset({ x: offsetX, y: offsetY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      // Update position based on mouse movement
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Prevent moving out of bounds of the t-shirt area
      if (newX >= 0 && newX <= 256 && newY >= 0 && newY <= 256) {
        setPosition({ x: newX, y: newY });
      }
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Draw T-Shirt
    const tshirtImg = new Image();
    tshirtImg.src = Tshirt;
    tshirtImg.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
      context.drawImage(tshirtImg, 0, 0, canvas.width, canvas.height);

      // Draw Logo
      if (logo) {
        const logoImg = new Image();
        logoImg.src = logo;
        logoImg.onload = () => {
          // Calculate logo dimensions based on size percentage
          const logoWidth = (canvas.width * size) / 100; 
          const logoHeight = (logoWidth * logoImg.height) / logoImg.width; // Maintain aspect ratio

          // Calculate position on canvas
          const posX = (canvas.width * position.x) / 256; // Adjust based on T-shirt width
          const posY = (canvas.height * position.y) / 256; // Adjust based on T-shirt height

          context.drawImage(logoImg, posX, posY, logoWidth, logoHeight);

          // Create download link
          const link = document.createElement("a");
          link.download = "tshirt_design.png";
          link.href = canvas.toDataURL("image/png");
          link.click();
        };
      }
    };
  };

  return (
    <div className="sm:h-screen flex justify-center items-center">
      <div className="flex h-screen sm:w-[90%] md:h-[60%] md:w-[80%] lg:w-[50%] flex-col sm:flex-row items-center justify-center rounded-sm p-10 gap-10 bg-gray-200">
        <div>
          <div
            className="relative w-64 h-64 bg-gray-200 border border-gray-400"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            <img
              src={Tshirt}
              alt="T-Shirt"
              className="absolute inset-0 w-full h-full"
            />
            {logo && (
              <img
                src={logo}
                alt="Logo"
                onMouseDown={handleMouseDown}
                style={{
                  position: "absolute",
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  width: `${size}%`,
                  height: "auto",
                  cursor: "move",
                }}
              />
            )}
          </div>
          <input
            type="range"
            min="10"
            max="200"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="mt-4"
          />
        </div>

        <div className="flex flex-col sm:gap-32 items-end">
          <input 
            type="file" 
            className="border-2 border-blue-500 border-dashed py-3 px-4 rounded-md" 
            onChange={handleLogoUpload} 
          />
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-400 duration-300 text-white p-2 rounded"
            onClick={downloadImage}
          >
            Download Final Image
          </button>
          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
            width={640}
            height={640}
          ></canvas>
        </div>
      </div>
    </div>
  );
};

export default TShirtDesigner;
