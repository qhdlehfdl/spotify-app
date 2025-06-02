import React from "react";

function TopSongs({ countryName, songs }) {
  if (!songs) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="section-title" style={{textAlign : "center"}}>{countryName} - Top Songs</h2>
      <ul className="list-unstyled">
        {songs.map((data, index) => (
          <li key={index} className="media-item">
            <img
              src={data.trackMetadata.displayImageUri
                .replace("{w}", "100")
                .replace("{h}", "100")}
              width="100"
              height="100"
              className="media-image"
            />
            <div className="media-info">
              <div className="media-title">{data.trackMetadata.trackName}</div>{" "}
              
              <div className="media-subtitle" style={{ color: "white;" }}>
                {data.trackMetadata.artists.map((a) => a.name).join(", ")}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopSongs;
