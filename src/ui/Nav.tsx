import UserMenu from "./UserMenu";

export default function Nav() {
  return (
    <div className="nav-bar">
      <div className="nav-brand">BossOS</div>
      <div className="nav-right">
        <UserMenu />
      </div>
    </div>
  );
}
