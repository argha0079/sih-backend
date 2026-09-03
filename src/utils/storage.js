import { supabase } from "./supabaseClient.js";

export const uploadChallengeMedia = async (file, challengeId) => {
    try {
        const timestamp = Date.now();
        const filePath = `${challengeId}/${timestamp}-${file.originalname}`;

        const { error } = await supabase.storage
            .from("challenge-media")
            .upload(filePath, file.buffer, {
                contentType: file.mimetype
            });

        if (error) {
            throw error;
        }

        const { data } = supabase.storage
            .from("challenge-media")
            .getPublicUrl(filePath);

        return data.publicUrl;

    } catch (error) {
        console.error(
            "Challenge media upload failed:",
            error.message
        );

        throw error;
    }
};