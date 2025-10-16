import { Metadata, ResolvingMetadata } from "next";
import UserProfileLayout from "@/components/features/user/UserProfileLayout";

type Props = {
  children: React.ReactNode;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: "My Profile | Synapse",
    description:
      "View and manage your profile, posts, and activity on the Synapse discussion forum.",
  };
}

export default function Layout({ children }: Props) {
  return <UserProfileLayout>{children}</UserProfileLayout>;
}
