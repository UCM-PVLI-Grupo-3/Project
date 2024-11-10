import { EMOTION_TYPE } from "./emotions.js";

const EMOTION_STACK_DEFAULTS = {
    ACUMULATED_EMOTIONS: Array(EMOTION_TYPE.HAPPINESS()),
};

class EmotionStack {
    acumulated_emotions = EMOTION_STACK_DEFAULTS.ACUMULATED_EMOTIONS;

    constructor(emotion_types) {
        console.assert(emotion_types instanceof Array, "error: emotion_types must be an array");
        emotion_types.forEach((emotion_type) => {
            console.assert(emotion_type in EMOTION_TYPE, "error: emotion_type must be a valid EMOTION_TYPE enum value");
        });

        this.acumulated_emotions = [...emotion_types];
    }

    emotion_count() {
        return this.acumulated_emotions.length;
    }

    add_emotion(emotion_type) {
        console.assert(emotion_type in EMOTION_TYPE, "error: emotion_type must be a valid EMOTION_TYPE enum value");
        this.acumulated_emotions.push(emotion_type);
    }

    add_emotions(emotion_types) {
        console.assert(emotion_types instanceof Array, "error: emotion_types must be an array");
        emotion_types.forEach((emotion_type) => {
            console.assert(emotion_type in EMOTION_TYPE, "error: emotion_type must be a valid EMOTION_TYPE enum value");
        });
        this.acumulated_emotions = [...this.acumulated_emotions, ...emotion_types];
    }

    pop_emotion() {
        console.assert(
            this.emotion_count() > 0,
            "error: there are no emotions to pop, check with emotion_count() > 0"
        );
        return this.acumulated_emotions.pop();
    }

    peek_emotion() {
        console.assert(
            this.emotion_count() > 0,
            "error: there are no emotions to peek, check with emotion_count() > 0"
        );
        return this.acumulated_emotions[this.emotion_count() - 1];
    }

    peek_emotions(count) {
        console.assert(count > 0, "error: count must be greater than 0");
        console.assert(
            this.emotion_count() >= count,
            "error: there are not enough emotions to peek, check with emotion_count() >= count"
        );
        return this.acumulated_emotions.slice(this.emotion_count() - count, this.emotion_count());
    }

    pop_emotions(count) {
        console.assert(count > 0, "error: count must be greater than 0");
        console.assert(
            this.emotion_count() >= count,
            "error: there are not enough emotions to pop, check with emotion_count() >= count"
        );
        return this.acumulated_emotions.splice(this.emotion_count() - count, count);
    }
}

export { EmotionStack };