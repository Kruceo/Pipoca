import { executeCli } from "cheloni";
import { cli } from "./commands/root";

await executeCli({ cli: cli })