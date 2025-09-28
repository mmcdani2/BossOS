import { ReactNode } from "react";
import PageHeader from "@/ui/PageHeader";
import ViewToolbar from "@/ui/ViewToolbar";
import GlassCard from "@/ui/GlassCard";

type ToolbarAction = {
    id: string;
    label: string;
    onClick: () => void;
    disabled?: boolean;
};

export default function ListViewLayout({
    title,
    filterBar,
    actions,
    children,
    subtitle,
}: {
    title: string;
    filterBar?: ReactNode;        
    actions?: ToolbarAction[];    
    children: ReactNode;          
    subtitle?: string;
}) {
    return (
        <>
            <PageHeader title={title} subtitle={subtitle} />

            <section className="w-full">
                <div className="shell page-viewport">
                    {/* Header Card w/ ViewToolbar (matches your Jobs header) */}
                    <GlassCard className="p-3">
                        <ViewToolbar
                            label={title}
                            right={
                                actions ? (
                                    <div className="flex gap-2">
                                        {actions.map(a => (
                                            <button
                                                key={a.id}
                                                title={a.label}
                                                onClick={a.onClick}
                                                disabled={a.disabled}
                                                className="px-2.5 py-1.5 text-xs leading-none rounded-[9px] text-slate-200
                                   border border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30
                                   active:translate-y-px inline-flex items-center gap-2"
                                            >
                                                {a.label}
                                            </button>
                                        ))}
                                    </div>
                                ) : null
                            }
                        />
                    </GlassCard>

                    {/* Sticky Filter Bar (exact positioning you used) */}
                    {filterBar ? (
                        <div
                            className="z-50"
                            style={{
                                position: "sticky",
                                top: "calc(34px + var(--toolbar-h, 56px))",
                            }}
                        >
                            <GlassCard className="p-3">{filterBar}</GlassCard>
                        </div>
                    ) : null}

                    {/* Body: your panel/list goes here unchanged */}
                    {children}
                </div>
            </section>
        </>
    );
}
