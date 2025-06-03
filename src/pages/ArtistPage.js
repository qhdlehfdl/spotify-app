import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PopularityBarchart  from "../components/PopularityBarchart.js";
import TopTracks from "../components/TopTracks.js";
import CollaborationGraph from "../components/CollaborationGraph.js";
import Navbar from "../components/Nav.js"; // 네비바

import "../styles/ArtistPage.css";

function ArtistPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [relatedArtists, setRelatedArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [collaboration, setCollaboration] = useState(null);
  const { artistName } = useParams(); // 웰컴페이지에서 아티스트 검색 시 사용
  
  const inputChange = (e) => {
    setQuery(e.target.value);
  };

  const searchClick = async (nameParam) => {
      // 웰컴페이지에서 검색했다면 해당 아티스트로, 혹은 기존 방식대로 직접 검색
      const searchQuery = nameParam || query;
      console.log("검색어:", searchQuery);
      
      try {
          const response = await fetch(
              `http://localhost:4000/api/search-artist/${searchQuery}`
          );
        const data = await response.json();
        console.log(data);
        const combined = [data.artist,
        ...data.relatedArtist.items.filter(
          (artist) => artist.name !== data.artist.name),];
        
        //상위 5개만
        const tracks = data.tracks
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 5);
        
        let graphData = { nodes: new Map(), links: new Map() }; 
        graphData.nodes.set(data.artist.name, { id: data.artist.name });

        data.collaborate.items.filter(item => item.artists.length > 1).forEach(item => {
          const artistNames = item.artists.map((a) => a.name);

          artistNames.forEach(artistName => {
            if (artistName === data.artist.name) return;

            if (!graphData.nodes.has(artistName)) {
              graphData.nodes.set(artistName, { id: artistName });
            }

            const key = `${data.artist.name}___${artistName}}`;

            if (graphData.links.has(key)) {
              graphData.links.get(key).count += 1;
            } else {
              graphData.links.set(key, {
                source: data.artist.name,
                target: artistName,
                count: 1,
              });
            }
          });
        });
        const finalGraphData = {
          nodes: Array.from(graphData.nodes.values()),
          links: Array.from(graphData.links.values()),
        };
        
        setRelatedArtists(combined);
        setTopTracks(tracks);
        setCollaboration(finalGraphData);
      } catch (error) {
          console.error("search-artist", error);
      }
  };

  // 웰컴페이지에서 검색한 경우 검색창에 해당 아티스트 자동 입력 & 검색
  useEffect(() => {
    if (artistName) {
      setQuery(artistName);
      searchClick(artistName);
    }
  }, [artistName]);

  return (
    <div className="wrap">
      <Navbar />
      <div className="App py-5">
        <div className="artist-page container-fluid py-5">
          <img className="welcome-bg" src="/bg.png" alt="" />
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
                onClick={() => searchClick()}
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
                <h5 className="mb-3 text-white">
                  Popularity Chart of Related Artists
                </h5>
                <PopularityBarchart artists={relatedArtists} />
              </div>

              {topTracks && relatedArtists.length > 0 && (
                <div
                  className="card p-3"
                  style={{
                    width: "300px",
                    backgroundColor: "rgba(17, 59, 87, 0.329)",
                    color: "white",
                  }}
                >
                  <h5 className="mb-3">{relatedArtists[0].name}'s Top Tracks</h5>
                  <TopTracks tracks={topTracks} />
                </div>
              )}
            </div>
          )}

          {collaboration && (
            <div className="d-flex justify-content-center mt-4">
              <div
                className="card p-4"
                style={{
                  width: "100%",
                  maxWidth: "900px",
                  backgroundColor: "#121212",
                  color: "white",
                  boxSizing: "border-box",
                }}
              >
                <h5 className="mb-3">Collaboration Graph</h5>
                <CollaborationGraph
                  main={relatedArtists[0].name}
                  data={collaboration}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
}

export default ArtistPage;
