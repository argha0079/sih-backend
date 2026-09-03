import axios from "axios";
import { ML_SERVICE_URL } from "../config/envConfig.js";

const ML_TIMEOUT = 5000;

// TODO: replace with real ML service calls when ML service is ready
export const callCategorize = async (title, description) => {
    try {
        const { data } = await axios.post(
            `${ML_SERVICE_URL}/categorize`,
            { title, description },
            { timeout: ML_TIMEOUT }
        );
        return data;
    } catch (error) {
        console.warn("ML categorize failed, using fallback:", error.message);
        return { category: "other", confidence: 0 };
    }
};

// TODO: replace with real ML service calls when ML service is ready
export const callDeduplicate = async (challengeId, title, description) => {
    try {
        const { data } = await axios.post(
            `${ML_SERVICE_URL}/deduplicate`,
            { challenge_id: challengeId, title, description },
            { timeout: ML_TIMEOUT }
        );
        return data;
    } catch (error) {
        console.warn("ML deduplicate failed, using fallback:", error.message);
        return { is_duplicate: false, similar_challenge_id: null };
    }
};
