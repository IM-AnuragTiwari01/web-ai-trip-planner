import React, { useState, useEffect } from "react";

const PlaceAutocomplete = ({ onChange }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchPlaces = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`,
          {
            headers: {
              "User-Agent": "MyReactApp/1.0 (your_email@example.com)",
            },
          }
        );
        const data = await response.json();
        setSuggestions(data.slice(0, 5));
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    const debounce = setTimeout(fetchPlaces, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a place..."
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          border: "2px solid #555",
          borderRadius: "4px",
        }}
      />
      {suggestions.length > 0 && (
        <ul style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "#fff",
          border: "2px solid #555",
          borderTop: "none",
          borderRadius: "0 0 4px 4px",
          zIndex: 1000,
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}>
          {suggestions.map((place, idx) => (
            <li
              key={idx}
              style={{
                padding: "10px",
                borderBottom: idx !== suggestions.length - 1 ? "1px solid #ccc" : "none",
                cursor: "pointer",
              }}
              onClick={() => {
                setQuery(place.display_name);
                setSuggestions([]);
                if (onChange) {
                  onChange(place); // Trigger parent with full place object
                }
              }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlaceAutocomplete;
