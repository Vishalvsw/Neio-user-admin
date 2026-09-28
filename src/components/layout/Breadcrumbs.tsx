import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="text-sm text-gray-500 mb-6">
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="hover:text-black">
                {item.name}
              </Link>
            ) : (
              <span className="text-gray-900">{item.name}</span>
            )}
            {index !== items.length - 1 && <span>/</span>}
          </span>
        ))}
      </div>
    </nav>
  );
}