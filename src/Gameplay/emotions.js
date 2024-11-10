import { KEYS_ASSETS_SPRITES } from "../common/common.js";

class EMOTION_TYPE {
    static HAPPINESS() { return "HAPPINESS" };
    static ANGER() { return "ANGER" };
    static SADNESS() { return "SADNESS" };
    static FEAR() { return "FEAR" };
    static ECSTASY() { return "ECSTASY" };
    static CONCERN() { return "CONCERN" };
    static CONFIDENCE() { return "CONFIDENCE" };
    static CALM() { return "CALM" };
};

class OPTIONAL_EMOTION_TYPE extends EMOTION_TYPE {
    static NONE() { return "NONE" }
};

function emotion_sprite_key_from_type(emotion_type) {
    console.assert(emotion_type in EMOTION_TYPE, "error: emotion_type must be a valid EMOTION_TYPE enum value");
    console.assert(emotion_type !== OPTIONAL_EMOTION_TYPE.NONE(), "error: emotion_type may not be NONE emotion type");

    switch (emotion_type) {
        case EMOTION_TYPE.HAPPINESS(): return KEYS_ASSETS_SPRITES.EMOTION_HAPPINESS_ICON;
        case EMOTION_TYPE.ANGER(): return KEYS_ASSETS_SPRITES.EMOTION_ANGER_ICON;    
        case EMOTION_TYPE.SADNESS(): return KEYS_ASSETS_SPRITES.EMOTION_SADNESS_ICON;
        case EMOTION_TYPE.FEAR(): return KEYS_ASSETS_SPRITES.EMOTION_FEAR_ICON;
        case EMOTION_TYPE.ECSTASY(): return KEYS_ASSETS_SPRITES.EMOTION_ECSTASY_ICON;
        case EMOTION_TYPE.CONCERN(): return KEYS_ASSETS_SPRITES.EMOTION_CONCERN_ICON;
        case EMOTION_TYPE.CONFIDENCE(): return KEYS_ASSETS_SPRITES.EMOTION_CONFIDENCE_ICON;
        case EMOTION_TYPE.CALM(): return KEYS_ASSETS_SPRITES.EMOTION_CALM_ICON;
        default: {
            console.assert(false, "error: emotion_type must be a valid EMOTION_TYPE enum value");
            return null;
        }
    }
}

export { EMOTION_TYPE, OPTIONAL_EMOTION_TYPE, emotion_sprite_key_from_type };