import { blogImg, fmtDate } from "../data/blog.js";
import { Arrow } from "./ui.jsx";

export default function BlogCard({ b, eager = false }) {
  return (
    <a className="bcard" href={`/blog/${b.slug}`}>
      <span className="bc-img">
        <img src={blogImg(b)} alt={b.imageAlt} loading={eager ? "eager" : "lazy"} decoding="async" />
      </span>
      <span className="bc-body">
        <span className="bc-meta">
          <span className="bc-cat">{b.category}</span>
          <span>{fmtDate(b.date)}</span>
          <span>{b.minutes} min read</span>
        </span>
        <h3>{b.title}</h3>
        <p>{b.description}</p>
        <span className="lnk">
          Read article <Arrow />
        </span>
      </span>
    </a>
  );
}
