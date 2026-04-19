import { ArrowLeft, Save, User as UserIcon, AlertCircle } from "lucide-react";
import Link from "next/link";
import pool from "@/lib/db";
import { updateUser } from "@/app/admin/actions/adminActions";

export default async function EditUserPage({ params }) {
  const { id } = await params;
  let user = null;
  let errorMsg = null;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      errorMsg = "User not found.";
    } else {
      user = rows[0];
    }
  } catch (err) {
    errorMsg = "Failed to load user: " + err.message;
    // Mock user for UI fallback if DB fails
    user = {
      id,
      name: "Mock User",
      email: "mock@example.com",
      role: "User",
      status: "Active",
    };
  }

  if (errorMsg && !user) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg flex items-center gap-3 border border-red-200">
        <AlertCircle size={20} />
        {errorMsg}
        <Link href="/admin/users" className="ml-auto underline font-medium">
          Return to Users
        </Link>
      </div>
    );
  }

  const updateActionWithId = updateUser.bind(null, id);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Edit Profile
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Update user account information and permissions.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
        <form action={updateActionWithId} className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
              <UserIcon size={18} className="text-blue-600" />
              General Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  defaultValue={user.name}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  New Password (Leave blank to keep current)
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  defaultValue={user.role}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm cursor-pointer bg-white"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={user.status}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm cursor-pointer bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Link
              href="/admin/users"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
