import { MediaManager } from "@/components/admin/MediaManager";
import { getPublishingBranch } from "@/lib/github-admin";

export default function AdminMediaPage() {
  return <MediaManager branch={getPublishingBranch()} />;
}
