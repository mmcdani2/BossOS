import UserMenu from "./UserMenu";

export default function Nav() {
  return (
    <div className="nav-bar">
      <div className="nav-brand">Boss.OS</div>
      <div className="nav-right">
        <UserMenu />
      </div>
    </div>
  );
}
