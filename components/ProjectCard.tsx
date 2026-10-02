import Link from "next/link";
import type { Design } from "@/lib/data";
import { SafeImage } from "@/components/SafeImage";

export function ProjectCard({ item }: { item: Design; index?: number }) {
  return (
    <article className="project-card">
      <Link href={`/designs/${item.slug}`} className="project-image" aria-label={`View ${item.title}`}>
        <SafeImage src={item.image} alt={`${item.title} preview`} width={900} height={560} fallback={`${item.title} / preview`} variant="theme" meta={`${item.slug} / phpBB 3.3`} />
      </Link>
      <div className="project-body">
        <div className="project-meta-row"><span>phpBB style</span><code>3.3</code></div>
        <h3><Link href={`/designs/${item.slug}`}>{item.title}</Link></h3>
        <p>{item.description}</p>
        <div className="tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="project-links">
          <a href={`https://demo.nextgen.gt/demo/#${item.demoStyle}`} target="_blank" rel="noreferrer">Demo ↗</a>
          <Link href={`/designs/${item.slug}`}>Details →</Link>
        </div>
      </div>
    </article>
  );
}
