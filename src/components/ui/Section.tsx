import { Container } from "./Container";
import { cn } from "@/lib/utils";

/** Consistent vertical rhythm + anchor id for every page section. */
export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-20 md:py-28", className)}>
      <Container>{children}</Container>
    </section>
  );
}
