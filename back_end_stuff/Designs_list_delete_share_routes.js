const crypto = require('crypto');
const requireLoggedInUser = require("./requireLoggedInUser")
const { buildSupabaseClientForUser } = require("./Supabasehelpers");

//get the dsign list -> for user loggd in 
function registerListDesignsRoute(app) {
    app.get("/designs/List", requireLoggedInUser, async (req, res) => {
        const userId = req.verifiedUser.id;
        const supabaseForThisUser = buildSupabaseClientForUser(req.userAccessToken);
        const queryResult = await supabaseForThisUser
            .from("designs")
            .select("id, name, updated_at, design_data, preview_url")
            .eq("user_id", userId)
            .or("is_public.is.null,is_public.eq.false")
        
        if(queryResult.error) {
            res.status(500).json({error: queryResult.error.message});
            return;
        }

        const publicCopiesResult = await supabaseForThisUser
            .from("designs")
            .select("source_design_id")
            .eq("user_id", userId)
            .eq("is_public", true);

        if(publicCopiesResult.error) {
            res.status(500).json({error: publicCopiesResult.error.message});
            return;
        }

        const shareDesignIds = [];
        for (let i = 0; i< publicCopiesResult.data.length; i++) {
            shareDesignIds.push(publicCopiesResult.data[i].source_design_id);
        }
        res.status(200).json({designs: queryResult.data, sharedDesignIds: shareDesignIds});
    })
}
function registerDeleteDesignsRoute(app) {
    app.post("/designs/delete", requireLoggedInUser, async (req,res)=>{
        const userId = req.verifiedUser.id;
        const idsToDelete = red.body.designsIds;

        if (!idsTodelete|| idsToDelete.length === 0) {
            res.status(400).json({error: "No design ids provided for deletion"});
            return;
        }
        const supabaseForThisUSer = buildSupabaseClientForUser(req.userAccessToken);
        const previewPathsToDelete = [];
        for(let i =0; i < idsToDelete.length; i++){
            previewPathsToDelete.push(userId + "/" + idsToDelete[i] + ".jpg");
        }

        const storageDeleteResult = await await supabaseForThisUser.storage
            .from("design-preview-card-picture")
            .remove(previewPathsToDelete);

        if(storageDeleteResult.error){
            console.log("Error deleting preview images from storage:", storageDeleteResult.error);
        }
        const deleteResult = await supabaseForThisUser
            .from("designs")
            .delete()
            .in("id", idsToDelete)
        
            if(deleteResult.error){
                res.status(500).json({error: deleteResult.error.message});
                return;
            }

            res.status(200).json({message: "Designs deleted successfully"});
    })
}

function registerShareDesignRoutes(app) {
    app.post("/designs/share", requireLoggedInUser, async (req, res) => {
        const privateDesignId = req.body.designId;
        const supabaseForThisUser = buildSupabaseClientForUser(req.userAccessToken);

        const privateRowResult = await supabaseForThisUser
            .from("designs")
            .select("*")
            .eq("id", privateDesignId)
            .single();

        if (privateRowResult.error || !privateRowResult.data) {
            res.status(404).json({ error: "Private design not found" });
            return;
        }

        const privateRow = privateRowResult.data;

        const existingPublicResult = await supabaseForThisUser
            .from("designs")
            .select("id")
            .eq("source_design_id", privateDesignId)
            .eq("is_public", true)
            .maybeSingle();

        if (existingPublicResult.data) {
            const updateResult = await supabaseForThisUser
                .from("designs")
                .update({
                    name: privateRow.name,
                    design_data: privateRow.design_data,
                    preview_url: privateRow.preview_url,
                    updated_at: new Date().toISOString()
                })
                .eq("id", existingPublicResult.data.id);

            if (updateResult.error) {
                res.status(500).json({ error: updateResult.error.message });
                return;
            }

            res.status(200).json({ message: "Public design updated successfully" });
            return;
        }

        const insertResult = await supabaseForThisUser
            .from("designs")
            .insert({
                id: crypto.randomUUID(),
                user_id: privateRow.user_id,
                name: privateRow.name,
                design_data: privateRow.design_data,
                preview_url: privateRow.preview_url,
                is_public: true,
                source_design_id: privateDesignId
            });

        if (insertResult.error) {
            res.status(500).json({ error: insertResult.error.message });
            return;
        }

        res.status(200).json({ message: "Design shared to community successfully" });
    });

    app.post("/designs/unshare", requireLoggedInUser, async (req, res) => {
        const privateDesignId = req.body.designId;
        const supabaseForThisUser = buildSupabaseClientForUser(req.userAccessToken);

        const publicRowResult = await supabaseForThisUser
            .from("designs")
            .select("id")
            .eq("source_design_id", privateDesignId)
            .eq("is_public", true)
            .maybeSingle();

        if (!publicRowResult.data) {
            res.status(200).json({ message: "No public copy found, nothing to unshare" });
            return;
        }

        const deleteResult = await supabaseForThisUser
            .from("designs")
            .delete()
            .eq("id", publicRowResult.data.id);

        if (deleteResult.error) {
            res.status(500).json({ error: deleteResult.error.message });
            return;
        }

        res.status(200).json({ message: "Design removed from community successfully" });
    });
}

module.exports = { registerListDesignsRoute, registerDeleteDesignsRoute, registerShareDesignRoutes };