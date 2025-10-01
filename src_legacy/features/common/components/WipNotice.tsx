import PageHeader from "@/ui/PageHeader";
import ViewToolbar from "@/ui/ViewToolbar";
import GlassCard from "@/ui/GlassCard";

export default function WipNotice({ title }: { title: string }) {
    return (
        <>
            <PageHeader />
            <div className="shell page-viewport">
                <GlassCard className="p-3">
                    <ViewToolbar label={title} />
                </GlassCard>
                <div className="mt-4">
                    <GlassCard className="p-6 text-white/70">Coming soon.</GlassCard>
                </div>
            </div>
        </>
    );
}
