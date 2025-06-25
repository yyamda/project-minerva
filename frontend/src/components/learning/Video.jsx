"use client";

export default function Video({ src }) {
    const video_link = "https://www.youtube.com/embed/_xIwjmCH6D4";
    // const embedUrl = video_link.replace("watch?v=", "embed/");

  return (
    <div>
      <iframe
        width="100%"
        height="400"
        src={video_link} // ✅ Use passed-in prop here!
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ maxWidth: "800px" }}
      ></iframe>
    </div>
  );
}