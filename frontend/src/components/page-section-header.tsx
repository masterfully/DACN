interface PageSectionHeaderProps {
  title: string;
  description?: string;
}

export function PageSectionHeader({
  title,
  description,
}: PageSectionHeaderProps) {
  return (
    <div className="flex shrink-0 flex-col gap-2">
      <h1 className="text-balance text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground text-pretty text-sm">
          {description}
        </p>
      )}
    </div>
  );
}
