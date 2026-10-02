import {cp, mkdir, access} from "node:fs/promises";
import {constants} from "node:fs";
import path from "node:path";

const source = path.resolve(process.cwd(), "../assets");
const target = path.resolve(process.cwd(), "public/assets");
try {
  await access(source, constants.R_OK);
  await mkdir(target, {recursive:true});
  await cp(source, target, {recursive:true, force:true});
  console.log("Synced ../assets → public/assets");
} catch {
  console.warn("No ../assets directory found. Keep the existing repository assets next to the Next.js folder or copy them into public/assets.");
}
