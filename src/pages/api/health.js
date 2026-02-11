import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  try {
    const { error } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    if (error) {
      return res.status(500).json({
        status: "fail",
        db: "down"
      });
    }

    return res.status(200).json({
      status: "ok",
      db: "connected"
    });

  } catch (err) {
    return res.status(500).json({
      status: "error"
    });
  }
}
