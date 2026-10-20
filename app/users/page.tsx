import UserList from "../components/UserList";

export default function UsersPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold">Users</h1>

        <UserList />
      </div>
    </main>
  );
}