// app/link-menu.tsx
// Link do menu que fica destacado quando você está naquela página.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LinkMenu({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const caminho = usePathname();
  const ativo = href === "/" ? caminho === "/" : caminho.startsWith(href);

  return (
    <Link
      href={href}
      className={ativo ? "link-ativo" : undefined}
      style={{ marginLeft: 16 }}
    >
      {children}
    </Link>
  );
}