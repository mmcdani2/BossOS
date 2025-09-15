import { useAuth } from "@/app/providers/AuthProvider";

export default function Nav() {
    const { user, signOut } = useAuth();
    return (
        <div className="nav-bar">
            <div className="nav-brand">BossOS</div>
            <div className="nav-right">
                <span style={{ color: "#9ca3af", fontSize: ".9rem" }}>{user?.email}</span>
                <button className="nav-btn" onClick={signOut}>Sign out</button>
            </div>
        </div>
    );
}

