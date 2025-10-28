import { UserDataTable } from "@/components/features/admin/users/UserDataTable";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";


export default function ManageUsersPage() {
  return (
    <div className="space-y-8">
      <AnimateOnScroll
        delay={ 0.1 }
      >
        <Link
          href={ `/admin` }
        >
          <Button
            variant="ghost"
            className="-ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mt-2">
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
