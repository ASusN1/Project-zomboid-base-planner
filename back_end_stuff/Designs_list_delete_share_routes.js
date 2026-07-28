const crypto = require('crypto');
const requireLoggedInUser = require("")
const {buildSupabaseCleintForUser} = require("../utils/supabaseHelpers");

//get the dsign list -> for user loggd in 
function registerListDesignsRoutes(app) {
    app.get("/designs/List", requireLoggedInUser, async (req, res) => {
        const userId = req.user.id;
        const supabaseFOrThisUser = buildSupabaseCleintForUser(req.userAcesssToken);
        const queryResult = await supabaseForThisUser
            .from("designs")
            .select("id, name, updated_at, design_data, preview_url")
            .eq("user_id", userId)
            .or("is_public.is.null, is_public.eq.false")
        
        if(queryResult.error) {
            res.status(500).json({error: queryResult.error.message});
            return;
        }

        const publicCopiesResult = await supabaseForThisUser
            .from("designs")
            .select("source_design_id")
            .eq("user_id", userId)
            .eq("is_public", true);
    })
}