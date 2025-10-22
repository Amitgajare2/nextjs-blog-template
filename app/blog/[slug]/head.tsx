import { getAllPostSlugs } from '../../../utils/blog';

export default function Head({ params }: { params: { slug: string } }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const ampHref = `${baseUrl}/amp/blog/${params.slug}`;
  return (
    <>
      <link rel="amphtml" href={ampHref} />
    </>
  );
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}


