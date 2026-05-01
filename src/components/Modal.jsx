import { useState } from "react";

export default function Modal({
  title,
  date,
  content,
  media,
  onClose,
}) {
  const [expandedMedia, setExpandedMedia] = useState(false);

  const isImage = (file) =>
    typeof file === "string" &&
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file);

  const isVideo = (file) =>
    typeof file === "string" &&
    /\.(mp4|webm|ogg)$/i.test(file);

  const mediaUrl = (file) => {
    if (!file || typeof file !== "string") return "";
    if (/^https?:\/\//i.test(file) || file.startsWith("/")) return file;
    return `/uploads/${file}`;
  };

  const src = mediaUrl(media);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        {/* CLOSE BUTTON */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* TITLE */}
        <h2>{title || "Untitled"}</h2>

        {/* DATE */}
        {date && (
          <small style={{ opacity: 0.6 }}>
            {date}
          </small>
        )}

        {/* MEDIA */}
        {media && (
          <div className="modal-media-wrapper">
            {isImage(media) && (
              <>
                <img
                  src={src}
                  alt="media"
                  className="modal-media"
                />
                <button
                  type="button"
                  className="modal-expand-btn"
                  onClick={() => setExpandedMedia(true)}
                >
                  Expand media
                </button>
              </>
            )}

            {isVideo(media) && (
              <>
                <video controls className="modal-media modal-media-compact">
                  <source src={src} />
                </video>
                <button
                  type="button"
                  className="modal-expand-btn"
                  onClick={() => setExpandedMedia(true)}
                >
                  Expand media
                </button>
              </>
            )}

            {!isImage(media) && !isVideo(media) && (
              <a
                href={src}
                target="_blank"
                rel="noreferrer"
                className="file-link"
              >
                📎 Open file
              </a>
            )}
          </div>
        )}

        {/* CONTENT */}
        <p className="modal-content">
          {content || "No content available."}
        </p>

      </div>

      {expandedMedia && (isImage(media) || isVideo(media)) && (
        <div
          className="media-lightbox"
          onClick={() => setExpandedMedia(false)}
        >
          <button
            type="button"
            className="media-lightbox-close"
            onClick={() => setExpandedMedia(false)}
          >
            ✕
          </button>

          {isImage(media) ? (
            <img
              src={src}
              alt="expanded media"
              className="media-lightbox-content"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <video
              controls
              autoPlay
              className="media-lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <source src={src} />
            </video>
          )}
        </div>
      )}
    </div>
  );
}