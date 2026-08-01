const crypto = require('crypto');
const requireLoggedInUser = require('./requireLoggedInUser');
const { buildSupabaseClientForUser } = require('./supabaseHelpers');
const upload = require('./multerHelper');

function registerSaveDesignRoute(app) {
    app.post('/designs/save', requireLoggedInUser, upload.single('previewImage'), async (req, res) => {
        const userId = req.verifiedUser.id;
        const supabaseForThisUser = buildSupabaseClientForUser(req.userAccessToken);

        let designName = req.body.designName;
        if (!designName) {
            designName = 'My Base';
        }

        let designDataObject;
        try {
            designDataObject = JSON.parse(req.body.designData);
        } catch (parseError) {
            res.status(400).json({ error: 'Invalid designData JSON' });
            return;
        }

        let projectId = req.body.projectId;
        if (!projectId) {
            projectId = crypto.randomUUID();
        }

        const uploadedFile = req.file;
        let previewUrl = null;

        if (uploadedFile) {
            const previewPath = userId + '/' + projectId + '.jpg';
            const uploadResult = await supabaseForThisUser.storage
                .from('design-preview-card-picture')
                .upload(previewPath, uploadedFile.buffer, { upsert: true, contentType: 'image/jpeg' });

            if (uploadResult.error) {
                res.status(500).json({ error: uploadResult.error.message });
                return;
            }

            const publicUrlResult = supabaseForThisUser.storage
                .from('design-preview-card-picture')
                .getPublicUrl(previewPath);

            const timestampForCacheBust = Date.now();
            previewUrl = publicUrlResult.data.publicUrl + '?t=' + timestampForCacheBust;
        }

        const rowToSave = {
            id: projectId,
            user_id: userId,
            name: designName,
            design_data: designDataObject,
            preview_url: previewUrl
        };

        const upsertResult = await supabaseForThisUser
            .from('designs')
            .upsert(rowToSave, { onConflict: 'id' });

        if (upsertResult.error) {
            res.status(500).json({ error: upsertResult.error.message });
            return;
        }

        res.status(200).json({ projectId: projectId, previewUrl: previewUrl });
    });
}

module.exports = registerSaveDesignRoute;