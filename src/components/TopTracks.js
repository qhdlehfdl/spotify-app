import React from "react";

function TopTracks({ tracks }) {
  return (
    <div
      style={{
        backgroundColor: "rgba(17, 59, 87, 0.329)",
        color: "white",
      }}
    >
      {tracks.map((track, index) => (
        <div key={track.id} className="mb-3 d-flex align-items-center">
          <img
            src={track.album?.images?.[0]?.url}
            alt={track.name}
            style={{ width: 50, height: 50, borderRadius: 4, marginRight: 10 }}
          />
          <div>
            <div style={{ fontWeight: "bold" }}>{track.name}</div>
            <div style={{ fontSize: "0.85rem", color: "rgb(243, 241, 241)" }}>
              Popularity: {track.popularity}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TopTracks;
