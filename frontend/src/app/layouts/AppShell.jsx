import TopBar from "./TopBar/TopBar";

export default function AppShell({ children, links = [] }) {
  return (
    <>
      <TopBar links={links} />
      <div className="d-flex" style={{ overflowX: "auto" }}>
        <div className="flex-grow-1">
          <div className="container-fluid mt-3">{children}</div>
        </div>
      </div>
    </>
  );
}
