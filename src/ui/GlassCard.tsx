import * as React from "react";
import { cn } from "@/lib/utils";

type Padding = "none" | "sm" | "md" | "lg";
type Accent = "none" | "teal";
type ExtraProps = {
  padding?: Padding;
  elevated?: boolean;
  interactive?: boolean;
  divided?: boolean;
  /** optional dark-mode glow like the mock */
  accent?: Accent;
};

// polymorphic helper
type PolymorphicProps<T extends React.ElementType, P> =
  P & { as?: T } & Omit<React.ComponentPropsWithoutRef<T>, keyof P | "as">;

function GlassCardInner<T extends React.ElementType = "div">(
  {
    as,
    className,
    children,
    padding = "sm",
    elevated = true,
    interactive = false,
    divided = false,
    accent = "none",
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
        "glass text-basecolor rounded-2xl",
        pad,
        elevated && "shadow-1",
        divided && "divide-y divide-token",

        // interactive states via tokens so both themes behave
        interactive && [
          "transition-all",
          "hover:[background:color-mix(in_srgb,var(--surface-3)_94%,transparent)]",
          "active:[background:color-mix(in_srgb,var(--surface-3)_90%,transparent)]",
          "focus-visible:outline-none focus-visible:ring-token"
        ],

        // optional teal accent (dark-only flair via CSS selector below)
        accent === "teal" && "glass-accent--teal",

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
