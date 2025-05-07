import React, { useState, useEffect } from "react";
import "../styles/ArtistPage.css";
import PopularityBarchart  from "../components/PopularityBarchart.js";
import TopTracks from "../components/TopTracks.js";

function ArtistPage() {
  const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [relatedArtists, setRelatedArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);

  const inputChange = (e) => {
    setQuery(e.target.value);
  };

  const searchClick = async () => {
      console.log("검색어:", query);
      
      try {
          const response = await fetch(
              `http://localhost:4000/api/search-artist/${query}`
          );
        const data = await response.json();
        const combined = [data.artist,
        ...data.relatedArtist.items.filter(
          (artist) => artist.name !== data.artist.name),];
        
        //상위 5개만
        const tracks = data.tracks
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 5);
        console.log(combined);
        setRelatedArtists(combined);
        setTopTracks(tracks);
        console.log(tracks);
      } catch (error) {
          console.error("search-artist", error);
      }
  };

  return (
    <div className="artist-page container-fluid py-5">
      <div className="search-box d-flex justify-content-center mb-4">
        <div className="input-group" style={{ maxWidth: "500px" }}>
          <input
            type="text"
            className="form-control bg-dark text-white border-secondary"
            placeholder="Artist..."
            value={query}
            onChange={inputChange}
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={searchClick}
          >
            Search
          </button>
        </div>
      </div>

      {relatedArtists && (
        <div className="d-flex justify-content-center gap-4">
          <div
            className="card p-4 w-100"
            style={{ maxWidth: "900px", backgroundColor: "#121212" }}
          >
            <PopularityBarchart artists={relatedArtists} />
          </div>
          {topTracks && relatedArtists && relatedArtists.length > 0 && (
            <div
              className="card p-3"
              style={{
                width: "300px",
                backgroundColor: "#121212",
                color: "white",
              }}
            >
              <h5 className="mb-3">{relatedArtists[0].name}'s Top Tracks</h5>
              <TopTracks tracks={topTracks} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ArtistPage;
