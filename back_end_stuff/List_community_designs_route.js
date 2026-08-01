const { supabaseBase } = require("../supabaseHelpers");

function registerListCommunityDesignsRoute(app) {
    app.get("/community/list", async (req, res) => {
        const queryResult = await supabaseBase
            .from("designs")
            .select("id, name, design_data, preview_url, user_id, profiles(username)")
            .eq("is_public", true) 
            .order("updated_at", { ascending: false });

        if (queryResult.error) {
            return res.status(500).json({ error: queryResult.error.message });
        }

        return res.status(200).json({ designs: queryResult.data });
    });
}

module.exports = registerListCommunityDesignsRoute; 