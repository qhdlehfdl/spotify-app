import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// .env 파일에서 Spotify 클라이언트 ID와 비밀 읽기
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function getSpotifyToken() {
  try {
    // Spotify 토큰 요청
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      },
      body: "grant_type=client_credentials", // client_credentials 방식으로 인증 요청
    });

    // 응답 상태 체크
    if (!result.ok) {
      throw new Error(
        `Spotify API request failed with status ${result.status}`
      );
    }

    // JSON 응답에서 access_token 추출
    const data = await result.json();

    console.log("spotify api 토큰 ok"); 
    
    return data.access_token;
  } catch (error) {
    console.error("Error getting Spotify token:", error.message);
    throw error; // 에러를 다시 던져서 상위에서 처리할 수 있도록 함
  }
}


export { getSpotifyToken };
