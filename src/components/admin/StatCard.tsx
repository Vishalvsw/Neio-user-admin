import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-gray-500">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}