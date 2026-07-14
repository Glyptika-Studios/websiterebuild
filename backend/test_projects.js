import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase.from("projects").select("*");
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("All Projects count:", data.length);
    data.forEach((p) => {
      console.log(`- ID: ${p.id}, Title: ${p.title}, Featured: ${p.featured}, Status: ${p.status}`);
      console.log(`  Description: ${p.description}`);
    });
  }
}
test();
