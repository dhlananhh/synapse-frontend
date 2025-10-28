import { UserDataTable } from "@/components/features/admin/users/UserDataTable";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";


export default function ManageUsersPage() {
  return (
    <div className="space-y-8">
      <AnimateOnScroll
        delay={ 0.1 }
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            View, manage, and moderate all users on the platform.
          </p>
        </div>
      </AnimateOnScroll>

      <UserDataTable />
    </div>
  );
}
