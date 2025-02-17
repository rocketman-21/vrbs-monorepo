type MediaDimension = { height: number; width: number };

//https://stackoverflow.com/questions/4129102/html5-video-dimensions

/**
 Returns the dimensions of a video asynchrounsly.
 @param {String} url Url of the video to get dimensions from.
 @return {Promise<{width: number, height: number}>} Promise which returns the dimensions of the video in 'width' and 'height' properties.
 */
export const getVideoDimensionsOf = (url: string): Promise<MediaDimension> => {
  return new Promise((resolve, reject) => {
    // create the video element
    const video = document.createElement("video");
    //set crossOrigin anonymous on video element
    video.crossOrigin = "anonymous";

    // place a listener on it
    video.addEventListener(
      "loadedmetadata",
      function loaded() {
        // retrieve dimensions
        const height = this.videoHeight;
        const width = this.videoWidth;

        // send back result
        resolve({ height, width });
      },
      false,
    );

    video.addEventListener("error", error => {
      console.error("video error", error);
      reject(error);
    });

    // start download meta-datas
    video.src = url;
  });
};

/**
 * Generates a thumbnail from a video.
 * @param videoUrl The URL of the video to generate a thumbnail from.
 * @param seekTo The time in seconds to seek to.
 * @returns A promise that resolves with the thumbnail as a data URL.
 */
/**
 * Generates a thumbnail from a video.
 * @param videoUrl The URL of the video to generate a thumbnail from.
 * @param seekTo The time in seconds to seek to.
 * @returns A promise that resolves with the thumbnail as a Blob.
 */
export function generateVideoThumbnail(videoUrl: string, seekTo: number = 0): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Important settings
    video.crossOrigin = "anonymous";
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    video.addEventListener("loadedmetadata", () => {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Seek to specified time
      if (video.duration < seekTo) {
        reject(new Error("Video is too short."));
        return;
      }

      // Delay seeking to ensure it works on Safari
      setTimeout(() => {
        video.currentTime = seekTo;
      }, 200);

      video.addEventListener("seeked", () => {
        if (!context) {
          reject(new Error("No context"));
          return;
        }
        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob(
          blob => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob from canvas"));
            }
          },
          "image/jpeg",
          0.75, // quality
        );

        // Clean up
        URL.revokeObjectURL(video.src);
      });
    });

    video.addEventListener("error", event => {
      // Use a more generic error object that doesn't rely on destructuring
      reject(
        new Error(`Error when loading video file: ${video.error?.message || "Unknown error"}`),
      );
    });

    // Start loading the video
    video.src = videoUrl;
    video.load();
  });
}

//return dimensions of an image asynchrounsly
export const getImageDimensionsOf = (url: string): Promise<MediaDimension> => {
  const img = new Image();
  //set crossOrigin anonymous on image element
  img.crossOrigin = "anonymous";

  return new Promise(resolve => {
    img.onload = () => {
      const { height, width } = img;
      resolve({ height, width });
    };

    img.src = url;
  });
};

export const getFileDimensions = async (file: File) => {
  if (!file.type.includes("image") && !file.type.includes("video")) return null;

  const objectUrl = URL.createObjectURL(file);
  const dimensions = await getMediaDimensions(objectUrl, file.type);
  URL.revokeObjectURL(objectUrl);

  return dimensions;
};

export const getMediaDimensions = async (url: string, mimeType: string) => {
  if (mimeType.includes("image")) {
    return await getImageDimensionsOf(url);
  }

  if (mimeType.includes("video")) {
    return await getVideoDimensionsOf(url);
  }

  return null;
};

export const getMediaType = (formatNameRaw: string): string => {
  const formatName = formatNameRaw.toLowerCase();

  //check for presence of jpeg etc in formatName
  if (formatName.includes("jpeg")) {
    return "image";
  }
  if (formatName.includes("jpg")) {
    return "image";
  }
  if (formatName.includes("svg")) {
    return "image";
  }
  if (formatName.includes("bmp")) {
    return "image";
  }
  if (formatName.includes("tiff")) {
    return "image";
  }
  if (formatName.includes("webp")) {
    return "image";
  }
  if (formatName.includes("png")) {
    return "image";
  }
  if (formatName.includes("gif")) {
    return "image";
  }
  //check for presence of mp4 in formatName
  if (formatName.includes("mp4")) {
    return "video";
  }
  //check for presence of mov in formatName
  if (formatName.includes("mov")) {
    return "video";
  }
  if (formatName.includes("webm")) {
    return "video";
  }
  if (formatName.includes("ogg")) {
    return "video";
  }
  if (formatName.includes("ogv")) {
    return "video";
  }
  //check for presence of mp3 in formatName
  if (formatName.includes("mp3")) {
    return "audio";
  }
  //check for presence of m4a in formatName
  if (formatName.includes("m4a")) {
    return "audio";
  }
  //check for presence of mp3 in formatName
  if (formatName.includes("mp3")) {
    return "audio";
  }
  return "video";
};
