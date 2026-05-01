const AMAZON_DOMAINS = {
  AU: "amazon.com.au",
  CA: "amazon.ca",
  DE: "amazon.de",
  FR: "amazon.fr",
  GB: "amazon.co.uk",
  IT: "amazon.it",
  JP: "amazon.co.jp",
  US: "amazon.com",
};

const AUDIBLE_DOMAINS = {
  AU: "audible.com.au",
  CA: "audible.ca",
  DE: "audible.de",
  FR: "audible.fr",
  GB: "audible.co.uk",
  US: "audible.com",
};

function userRegion() {
  const nav = typeof navigator === "undefined" ? null : navigator;
  const locale = nav?.languages?.[0] || nav?.language || "en-US";
  return locale.split("-").pop()?.toUpperCase() || "US";
}

export function amazonSearchUrl(title, providedUrl = "") {
  if (providedUrl) return providedUrl;
  const domain = AMAZON_DOMAINS[userRegion()] || AMAZON_DOMAINS.US;
  return `https://www.${domain}/s?k=${encodeURIComponent(title)}`;
}

export function audibleSearchUrl(title) {
  const domain = AUDIBLE_DOMAINS[userRegion()] || AUDIBLE_DOMAINS.US;
  return `https://www.${domain}/search?keywords=${encodeURIComponent(title)}`;
}
