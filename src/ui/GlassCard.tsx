import * as React from "react";
import { cn } from "@/lib/utils";

// local props that are always valid
type Padding = "none" | "sm" | "md" | "lg";
type ExtraProps = {
  padding?: Padding;
  elevated?: boolean;
  interactive?: boolean;
  divided?: boolean;
};

// polymorphic helper
type PolymorphicProps<T extends React.ElementType, P> =
  P & { as?: T } & Omit<React.ComponentPropsWithoutRef<T>, keyof P | "as">;

function GlassCardInner<T extends React.ElementType = "div">(
  {
    as,
    className,
    children,
    padding = "md",
    elevated = true,
    interactive = false,
    divided = false,
    ...rest
  }: PolymorphicProps<T, ExtraProps>,
  ref: React.Ref<Element>
) {
  const As = (as ?? "div") as React.ElementType;

  const pad =
    padding === "none" ? "" :
    padding === "sm"   ? "p-3" :
    padding === "lg"   ? "p-6" : "p-4";

  return (
    <As
      ref={ref}
      className={cn(
        "glass text-basecolor",
        pad,
        elevated && "shadow-1",
        divided && "divide-y divide-token",
        interactive && [
          "transition-all",
          "hover:[background:color-mix(in_srgb,var(--surface-3)_94%,transparent)]",
          "active:[background:color-mix(in_srgb,var(--surface-3)_90%,transparent)]",
          "focus-visible:outline-none focus-visible:ring-token"
        ],
        className
      )}
      {...rest}
    >
      {children}
    </As>
  );
}

const GlassCard = React.forwardRef(GlassCardInner) as <
  T extends React.ElementType = "div"
>(
  props: PolymorphicProps<T, ExtraProps> & { ref?: React.Ref<Element> }
) => React.ReactElement | null;

export default GlassCard;
