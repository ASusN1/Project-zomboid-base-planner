async function shareDesignToCommunity(privateDesignId) {
    const privateRowResult = await window.sb
        .from("designs")
        .select("*") //grap everyhting 
        .eq("id", privateDesignId)
        .single(); //get 1 row back

    const privateRow = privateRowResult.data;
    const privateRowError = privateRowResult.error;

    if (privateRowError || !privateRowResult) {
        console.error("Error fetching private design:", privateRowError);
        return;
    }

    //check if another public version created 
    const existingPublicResult = await window.sb
        .from("designs")
        .select("id")
        .eq ("source_design_id", privateDesignId)
        .eq("is_public", true)
        .maybeSingle(); // reutn null if none found 

    const existingPublicRow = existingPublicResult.data;

    if (existingPublicRow) { // if public version alreay exit --> udpate it instead of creating new
        const updateResult = await window.sb
            .from("designs")
            .update({
                name: privateRow.name, // copy name
                design_data: privateRow.design_data, // copy lates design datat 
                preview_url: privateRow.preview_url, // copy latest preview picture 
                updated_at: new Date().toISOString(),
            })
            .eq("id", existingPublicRow.id);

        if (updateResult.error) {
            console.error("Error updating public design:", updateResult.error);
            return;
        }
        alert("successfully updated public design");
        return;
    }

    //no public version exists, create new public design
    const insetResult = await window.sb
        .from("designs")
        .insert({ 
            id: crypto.randomUUID(), // generate new unique id for public design
            user_id : privateRow.user_id, // copy owner name
            name: privateRow.name, // copy name
            design_data: privateRow.design_data, // copy design data
            preview_url: privateRow.preview_url, // copy preview picture
            is_public: true, 
            source_design_id: privateDesignId, // link to private design
        });

    if (insetResult.error) { 
        console.log("error creating public design:", insetResult.error);
        return;
    } 
    console.log("successfully created public design:", insetResult.data);
    alert("Design shared to community!");
}

async function unshareDesignFromCommunity(privateDesignId) {
    const publicRowResult = await window.sb
        .from("designs")
        .select("id, preview_url")
        .eq("source_design_id", privateDesignId)
        .eq("is_public", true)
        .maybeSingle();

    const publicRow = publicRowResult.data;
    const publicRowError = publicRowResult.error;

    if (publicRowError) {
        console.error("Error finding public design to remove:", publicRowError);
        return;
    }

    if (!publicRow) {
        console.log("No public copy found for this design, nothing to unshare");
        return;
    }

    const deleteResult = await window.sb
        .from("designs")
        .delete()
        .eq("id", publicRow.id);

    if (deleteResult.error) {
        console.error("Error deleting public design:", deleteResult.error);
        return;
    }

    console.log("successfully removed public design:", publicRow.id);
    alert("Design removed from community!");
}
window.shareDesignToCommunity = shareDesignToCommunity;
window.unshareDesignFromCommunity = unshareDesignFromCommunity;