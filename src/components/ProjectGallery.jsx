import { useState } from 'react';
import { isVideoMedia } from '../../shared/projectMedia';

export default function ProjectGallery({ project, expanded, onExpand }) {
  const [index, setIndex] = useState(0);
  const media = project.gallery;
  if (!media.length) return <p className="project-gallery-empty">Screenshots will appear here when added.</p>;
  const url = media[index];
  const move = direction => setIndex(current => (current + direction + media.length) % media.length);
  return <section className="project-gallery" aria-label={`${project.title} screenshots`} onKeyDown={event => {
    if (event.target.tagName === 'VIDEO') return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
  }}>
    <div className="project-gallery-heading"><h3>Screenshots & demo</h3><span>{index + 1} / {media.length}</span></div>
    <div className="project-gallery-stage">
      {isVideoMedia(url) ? <video key={url} src={url} controls playsInline preload="metadata" aria-label={`${project.title} demo ${index + 1}`} /> : <button type="button" className="project-gallery-open" onClick={() => onExpand(!expanded)} aria-label={expanded ? 'Return to project details' : `Enlarge screenshot ${index + 1}`}><img src={url} alt={`${project.title} screenshot ${index + 1}`} /><span>{expanded ? 'Return to details' : 'Click to enlarge'}</span></button>}
    </div>
    <div className="project-gallery-controls">
      {media.length > 1 && <button type="button" onClick={() => move(-1)} aria-label="Previous screenshot">← Previous</button>}
      <button type="button" onClick={() => onExpand(!expanded)}>{expanded ? 'Back to details' : 'Large view'}</button>
      {media.length > 1 && <button type="button" onClick={() => move(1)} aria-label="Next screenshot">Next →</button>}
    </div>
    {media.length > 1 && <div className="project-gallery-thumbnails" aria-label="Choose screenshot">{media.map((item, i) => <button type="button" key={item} onClick={() => setIndex(i)} aria-label={`Show ${isVideoMedia(item) ? 'video' : 'screenshot'} ${i + 1}`} aria-pressed={i === index}>{isVideoMedia(item) ? <span>Video {i + 1}</span> : <img src={item} alt="" loading="lazy" />}</button>)}</div>}
  </section>;
}
