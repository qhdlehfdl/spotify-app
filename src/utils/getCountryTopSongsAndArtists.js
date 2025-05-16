const codeCache = {};

// REST Countries API 국가이름을 코드로
export const countryNameToCode = async (countryName) => {
  if (codeCache[countryName]) return codeCache[countryName];

  try {
    const encodedCountryName = encodeURIComponent(countryName);
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodedCountryName}`
    );

    const countries = await response.json();

    if (countries && countries.length > 0) {
      let country;
      if (countryName === "China") country = countries[2];
      else country = countries[0]; // 첫 번째 국가를 가져옴

      codeCache[countryName] = country.cca2;
      
      return country.cca2; // ISO 3166-1 alpha-2 코드 반환
    } else {
      throw new Error("국가 코드 변환 실패");
    }
  } catch (error) {
    console.error("Error fetching country code:", error);
    return null;
  }
};

export const getCountryTopSongs = async (token, countryName, date) => {
  if (countryName !== "global") {
    countryName = await countryNameToCode(countryName);
  }

  if (!countryName) {
    throw new Error("국가 코드 변환 실패");
  }

  const url = `https://charts-spotify-com-service.spotify.com/auth/v0/charts/regional-${countryName}-weekly/${date}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
        "app-platform": "Browser",
        "spotify-app-version": "0.0.0.production",
        Origin: "https://charts.spotify.com",
        Referer: "https://charts.spotify.com/",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return result.entries;
  } catch (error) {
    console.error("Error fetching Spotify chart:", error);
  }
};

export const getCountryTopArtists = async (token, countryName) => {
  const countryCode = await countryNameToCode(countryName);

  if (!countryCode) {
    throw new Error("국가 코드 변환 실패");
  }

  const url = `https://charts-spotify-com-service.spotify.com/auth/v0/charts/artist-${countryCode}-weekly/latest`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
        "app-platform": "Browser",
        "spotify-app-version": "0.0.0.production",
        Origin: "https://charts.spotify.com",
        Referer: "https://charts.spotify.com/",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.entries;
  } catch (error) {
    console.error("Error fetching Spotify chart:", error);
  }
};
