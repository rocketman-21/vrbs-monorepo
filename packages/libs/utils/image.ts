const whitelistedImageDomains = {
  domains: [
    "nftstorage.link",
    "openseauserdata.com",
    "ipfs.io",
    "instagram.com",
    "youtube.com",
    "discord.com",
    "gnars.com",
    "thatsgnar.ly",
    "zora.co",
    "skatecuida.org",
    "decentralized-content.com",
  ],
  remotePatterns: [
    { hostname: "*.mypinata.cloud" },
    { hostname: "*.youtube.com" },
    { hostname: "*.nftstorage.link" },
    { hostname: "*.instagram.com" },
    { hostname: "*.imgur.com" },
    { hostname: "*.seadn.io" },
    { hostname: "*.alchemy.com" },
    { hostname: "*.rarible.org" },
    { hostname: "*.googleusercontent.com" },
    { hostname: "*.s3.amazonaws.com" },
    { hostname: "*.twimg.com" },
    { hostname: "*.cdninstagram.com" },
    { hostname: "localhost" },
    { hostname: "*.zora.co" },
    { hostname: "*.mux.com" },
    { hostname: "*.linktr.ee" },
    { hostname: "*.decentralized-content.com" },
  ],
  dangerouslyAllowSVG: true,
  contentDispositionType: "attachment",
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
};

const isImageDomainWhitelisted = (domain: string): boolean => {
  if (whitelistedImageDomains.domains.includes(domain)) {
    return true;
  }

  for (const { hostname } of whitelistedImageDomains.remotePatterns) {
    if (domain.endsWith(hostname.replace("*.", ""))) {
      return true;
    }
  }

  return false;
};

export const canUseNextImage = (imageUrl: string): boolean => {
  if (!imageUrl) return false;
  if (imageUrl.startsWith("/")) return true;

  try {
    return isImageDomainWhitelisted(new URL(imageUrl).hostname);
  } catch {
    return false;
  }
};

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    try {
      const image = new Image();

      image.onload = () => {
        const width = image.naturalWidth;
        const height = image.naturalHeight;

        window.URL.revokeObjectURL(image.src);

        return resolve({ width, height });
      };

      image.crossOrigin = "anonymous";
      image.src = window.URL.createObjectURL(file);
    } catch (error) {
      return reject(error);
    }
  });
}
