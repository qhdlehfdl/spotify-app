import countries from 'i18n-iso-countries';

export async function getMarkets(token) {
  const response = await fetch("https://api.spotify.com/v1/markets", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Spotify API request failed with status ${response.status}`
    );
  }

  const data = await response.json();
  return data.markets; 
}

export async function countryNameToCode(countryName) {
  countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

  // 예: "United States of America" => "US"
  const code = countries.getAlpha2Code(countryName, "en");
  console.log(code.toLowerCase()); // "us"
  return code.toLowerCase();
}
