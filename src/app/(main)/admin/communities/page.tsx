import { CommunityDataTable } from "@/components/features/admin/communities/CommunityDataTable";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";


export default function ManageCommunitiesPage() {
  return (
    <div className="space-y-8">
      <AnimateOnScroll
        delay={ 0.1 }
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight mt-2">
            Community Management
          </h1>
          <p className="text-muted-foreground mt-2">
            View, manage, and moderate all communities on the platform.
          </p>
        </div>
      </AnimateOnScroll>

      <CommunityDataTable />
    </div>
  );
}
