export default function Modal({
  title,
  date,
  content,
  media,
  onClose,
}) {
  const isImage = (file) =>
    typeof file === "string" &&
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file);

  const isVideo = (file) =>
    typeof file === "string" &&
    /\.(mp4|webm|ogg)$/i.test(file);

  const mediaUrl = (file) => `/uploads/${file}`;

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
              <img
                src={mediaUrl(media)}
                alt="media"
                className="modal-media"
              />
            )}

            {isVideo(media) && (
              <video controls className="modal-media">
                <source src={mediaUrl(media)} />
              </video>
            )}

            {!isImage(media) && !isVideo(media) && (
              <a
                href={mediaUrl(media)}
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
    </div>
  );
}