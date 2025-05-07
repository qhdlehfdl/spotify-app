import React from "react";

function TopArtists({ countryName, artists }) {
  if (!artists) return <div>Loading...</div>;

  return (
    <div className="card top-section">
      <h2 className="section-title">{countryName} - Top Artists</h2>
      <ul className="list-unstyled">
        {artists.map((artist, index) => (
          <li key={index} className="media-item">
            <img
              src={artist.artistMetadata.displayImageUri
                .replace("{w}", "100")
                .replace("{h}", "100")}
              alt={artist.artistMetadata.artistName}
              className="media-image rounded-circle"
            />
            <div className="media-info">
              <div className="media-title">
                {artist.artistMetadata.artistName}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopArtists;
