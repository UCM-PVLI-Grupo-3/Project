const KEYS_SCENES = {
    BATTLE: "BATTLE",
};

const KEYS_ASSETS_SPRITES = {
    MISC_DICE: "MISC_DICE",
    MISC_CARD: "MISC_CARD",
    MISC_DICE_SLOT: "MISC_DICE_SLOT",
    DICE_SLOT: "DICE_SLOT",
    PAST_CARD: "PAST_CARD",
    FUTURE_CARD: "FUTURE_CARD",
    CARD_HAND_PANEL: "CARD_HAND_PANEL",

    DICE_TYPE_D4: "DICE_TYPE_D4",
    DICE_TYPE_D6: "DICE_TYPE_D6",
    DICE_TYPE_D8: "DICE_TYPE_D8",
    DICE_TYPE_D10: "DICE_TYPE_D10",
    DICE_TYPE_D12: "DICE_TYPE_D12",
    DICE_TYPE_D20: "DICE_TYPE_D20",

    EMOTION_ANGER_ICON: "EMOTION_ANGER_ICON",
    EMOTION_CALM_ICON: "EMOTION_CALM_ICON",
    EMOTION_HAPPINESS_ICON: "EMOTION_HAPPINESS_ICON",
    EMOTION_SADNESS_ICON: "EMOTION_SADNESS_ICON",
    EMOTION_ECSTASY_ICON: "EMOTION_ECSTASY_ICON",
    EMOTION_CONCERN_ICON: "EMOTION_CONCERN_ICON",
    EMOTION_FEAR_ICON: "EMOTION_FEAR_ICON",
    EMOTION_CONFIDENCE_ICON: "EMOTION_CONFIDENCE_ICON",
};

const CONSTANTS_SPRITES_MEASURES = {
    MISC_DICE_SLOT: {
        WIDTH: 64,
        HEIGHT: 64,
        SLICE_TOP: 16,
        SLICE_BOTTOM: 16,
        SLICE_LEFT: 16,
        SLICE_RIGHT: 16
    },
    DICE_SLOT: {
        WIDTH: 154,
        HEIGHT: 153,
        LINE_BORDER: 10
    },
    SCENE_CARD: {
        WIDTH: 344,
        HEIGHT: 460,
    },
};

function exit(status) {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brettz9.blogspot.com)
    // +      input by: Paul
    // +   bugfixed by: Hyam Singer (http://www.impact-computing.com/)
    // +   improved by: Philip Peterson
    // +   bugfixed by: Brett Zamir (http://brettz9.blogspot.com)
    // %        note 1: Should be considered expirimental. Please comment on this function.
    // *     example 1: exit();
    // *     returns 1: null

    var i;

    if (typeof status === 'string') {
        alert(status);
    }

    window.addEventListener('error', function (e) { e.preventDefault(); e.stopPropagation(); }, false);

    var handlers = [
        'copy', 'cut', 'paste',
        'beforeunload', 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll',
        'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified', 'DOMElementNameChanged', 'DOMAttributeNameChanged', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'online', 'offline', 'textInput',
        'abort', 'close', 'dragdrop', 'load', 'paint', 'reset', 'select', 'submit', 'unload'
    ];

    function stopPropagation(e) {
        e.stopPropagation();
        // e.preventDefault(); // Stop for the form controls, etc., too?
    }
    for (i = 0; i < handlers.length; i++) {
        window.addEventListener(handlers[i], function (e) { stopPropagation(e); }, true);
    }

    if (window.stop) {
        window.stop();
    }

    throw '';
}

export { KEYS_SCENES, KEYS_ASSETS_SPRITES, CONSTANTS_SPRITES_MEASURES, exit };