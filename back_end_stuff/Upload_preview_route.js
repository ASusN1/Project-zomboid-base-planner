const requireLoggedInUser = require('./requireLoggedInUser');
const {buildSupabaseClientForUser} = require("./Supabasehelpers");
const {upload} = require("./Multerhelper");

function registerUploadPreviewRoute(app) {
    app.post('/upload-preview', requireLoggedInUser, upload.single('previewImage'), async (req, res) => {
        const uploadedFile = req.file;
        const projectId = req.body.projectId;
        const userId = req.verifiedUser.id;

        if (!uploadedFile || !projectId) {
            res.status(400).json({ error: 'Missing uploadedFile or projectId' });
            return;
        }

        const supabaseForThisUser = buildSupabaseClientForUser(req.userAccessToken);
        const previewPath = userId + '/' + projectId + '.jpg';

        const uploadResult = await supabaseForThisUser.storage
            .from('design-preview-card-picture')
            .upload(previewPath, uploadedFile.buffer, { upsert: true, contentType: 'image/jpeg' });

        if (uploadResult.error) {
            console.log('Upload error: ' + uploadResult.error.message);
            res.status(500).json({ error: uploadResult.error.message });
            return;
        }

        const publicUrlResult = supabaseForThisUser.storage
            .from('design-preview-card-picture')
            .getPublicUrl(previewPath);

        const timestampForCacheBust = Date.now();
        const finalPreviewUrl = publicUrlResult.data.publicUrl + '?t=' + timestampForCacheBust;

        res.status(200).json({ previewUrl: finalPreviewUrl });
    });
}

module.exports = registerUploadPreviewRoute;