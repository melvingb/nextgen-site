import { notFound } from "next/navigation";
import { AdminCollectionEditor, type AdminField } from "@/components/admin/AdminCollectionEditor";
import {
  bundledContent,
  isContentKind,
  type ContentKind,
} from "@/lib/admin-content";
import {
  getPublishingBranch,
  readAdminContent,
} from "@/lib/github-admin";

const definitions: Record<ContentKind, {
  title: string;
  description: string;
  previewBase?: string;
  fields: AdminField[];
}> = {
  designs: {
    title: "Designs",
    description: "Maintain the phpBB style catalogue, project metadata and feature lists.",
    previewBase: "/designs",
    fields: [
      {key:"slug",label:"Slug",help:"Used in /designs/[slug]."},
      {key:"title",label:"Title"},
      {key:"description",label:"Short description",type:"textarea"},
      {key:"image",label:"Cover image",type:"media",placeholder:"/assets/images/example.jpg"},
      {key:"tags",label:"Tags",type:"tags",help:"Comma-separated."},
      {key:"repo",label:"GitHub repository",placeholder:"owner/repository"},
      {key:"demoStyle",label:"Demo style key"},
      {key:"features",label:"Features",type:"lines",help:"One feature per line."},
      {key:"details",label:"Project details",type:"textarea"},
    ],
  },
  extensions: {
    title: "Extensions",
    description: "Manage extension releases, repositories, screenshots and public project information.",
    previewBase: "/extensions",
    fields: [
      {key:"slug",label:"Slug"},
      {key:"title",label:"Title"},
      {key:"description",label:"Description",type:"textarea"},
      {key:"image",label:"Cover image",type:"media"},
      {key:"platform",label:"Platform",defaultValue:"phpBB"},
      {key:"status",label:"Status",defaultValue:"Development"},
      {key:"version",label:"Version"},
      {key:"repo",label:"GitHub repository",placeholder:"owner/repository"},
      {key:"repoUrl",label:"Repository URL"},
      {key:"download",label:"Download / releases URL"},
      {key:"features",label:"Features",type:"lines"},
      {key:"screenshots",label:"Screenshot filenames",type:"lines"},
    ],
  },
  portfolio: {
    title: "Portfolio",
    description: "Edit selected client and community projects shown across the site.",
    previewBase: "/portfolio",
    fields: [
      {key:"name",label:"Project name"},
      {key:"description",label:"Description",type:"textarea"},
      {key:"image",label:"Project image",type:"media"},
    ],
  },
  testimonials: {
    title: "Testimonials",
    description: "Maintain client feedback, platform labels and rating information.",
    previewBase: "/testimonials",
    fields: [
      {key:"name",label:"Client / username"},
      {key:"role",label:"Role",defaultValue:"Forum Administrator"},
      {key:"platform",label:"Platform",defaultValue:"phpBB"},
      {key:"rating",label:"Rating",type:"number",defaultValue:5},
      {key:"text",label:"Testimonial",type:"textarea"},
    ],
  },
};

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!isContentKind(section)) notFound();

  const definition = definitions[section];
  let items = bundledContent[section] as Array<Record<string, unknown>>;
  let source = "bundled";
  let loadError = "";

  try {
    items = (await readAdminContent(section)) as Array<Record<string, unknown>>;
    source = "github";
  } catch (error) {
    loadError =
      error instanceof Error
        ? `${error.message} Showing bundled content until GitHub App publishing is configured.`
        : "Could not load GitHub content.";
  }

  return (
    <AdminCollectionEditor
      kind={section}
      title={definition.title}
      description={definition.description}
      fields={definition.fields}
      initialItems={items}
      branch={getPublishingBranch()}
      source={source}
      loadError={loadError}
      previewBase={definition.previewBase}
    />
  );
}
