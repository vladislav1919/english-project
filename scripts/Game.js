import { AvatarManager } from "./AvatarManager.js";
import { BackgroundManager } from "./BackgroundManager.js";
import { DialogManager } from "./DialogManager.js";
import { TriggerManager } from "./TriggerManager.js";
export class Game {
    constructor(scenario, browser) {
        this.scenario = scenario;
        this.backgroundManager = new BackgroundManager(browser.backgroundImage);
        this.dialogManager = new DialogManager(browser.dialogContainer, browser.dialogTextContainer, browser.dialogResponseContainer);
        this.triggerManager = new TriggerManager(browser.triggerPane);
        this.avatarManager = new AvatarManager(browser.avatarContainer, browser.avatarArchive);
        this.sceneStates = new Map();
        this.populateSceneStates();
    }
    start() {
        this.loadScene(this.scenario.inceptionScene);
    }
    setBackground(image) {
        return this.backgroundManager.reset(image);
    }
    setDialog(code) {
        const dialog = this.getDialogByCode(code);
        const responses = new Map();
        dialog.responses.forEach((responseEvent, responseText) => {
            responses.set(responseText, this.bindGameEvent(responseEvent));
        });
        return this.dialogManager.reset(dialog.text, responses);
    }
    clearDialogs() {
        return this.dialogManager.reset();
    }
    addTrigger(x, y, event) {
        return this.triggerManager.addTrigger(x, y, this.bindGameEvent(event));
    }
    clearTriggers() {
        return this.triggerManager.clearTriggers();
    }
    addAvatar(name, pane) {
        return this.avatarManager.introduce(name, pane);
    }
    removeAvatar(name) {
        return this.avatarManager.remove(name);
    }
    clearAvatars() {
        return this.avatarManager.clear();
    }
    populateSceneStates() {
        this.scenario.scenes.forEach((scene, sceneName) => {
            this.sceneStates.set(sceneName, scene.initialState);
        });
    }
    loadScene(sceneName) {
        this.currentScene = sceneName;
        const stateCode = this.getSceneStateCode(sceneName);
        const stateEvent = this.getSceneStateEvent(sceneName, stateCode);
        this.triggerManager.clearTriggers();
        this.dialogManager.reset();
        (this.bindGameEvent(stateEvent))();
    }
    bindGameEvent(event) {
        return () => {
            event(this).then(whatsNext => {
                if (whatsNext !== undefined) {
                    const { nextScene, nextState } = whatsNext;
                    if (nextState !== undefined) {
                        this.sceneStates.set(this.getCurrentScene(), nextState);
                    }
                    this.loadScene(nextScene);
                }
            });
        };
    }
    getSceneStateCode(sceneName) {
        const stateCode = this.sceneStates.get(sceneName);
        if (stateCode === undefined) {
            throw new Error(`Failed to get state code for scene ${sceneName}`);
        }
        return stateCode;
    }
    getSceneStateEvent(sceneName, stateCode) {
        const scene = this.getSceneByName(sceneName);
        const stateEvent = scene.states.get(stateCode);
        if (stateEvent === undefined) {
            throw new Error(`Failed to find state event for state ${stateCode} of scene ${sceneName}`);
        }
        return stateEvent;
    }
    getSceneByName(sceneName) {
        const scene = this.scenario.scenes.get(sceneName);
        if (scene === undefined) {
            throw new Error(`No scene with name ${sceneName} found.`);
        }
        return scene;
    }
    getDialogByCode(dialogCode) {
        const dialog = this.scenario.dialogs.get(dialogCode);
        if (dialog === undefined) {
            throw new Error(`Failed to find dialog with code ${dialogCode}`);
        }
        return dialog;
    }
    getCurrentScene() {
        if (this.currentScene === undefined) {
            throw new Error(`Current scene is undefined`);
        }
        return this.currentScene;
    }
}
