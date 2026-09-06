export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbProps {
  section?: string;
  sectionPath?: string;
  currentPage?: string;
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb(_props: BreadcrumbProps) {
  return null;
}
