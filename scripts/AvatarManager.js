import { PromiseTools } from "./PromiseTools.js";
export class AvatarManager {
    constructor(avatarPane, avatarArchive) {
        this.avatarPane = avatarPane;
        this.avatarArchive = avatarArchive;
        this.activeAvatars = avatarPane.children;
        this.dormantAvatars = avatarArchive.children;
    }
    introduce(name, pane) {
        if (this.avatarPane.childElementCount === 0) {
            this.avatarPane.classList.remove('undisplayed');
        }
        const avatar = this.getDormantAvatar(name);
        avatar.classList.add(`avatar-on-${pane}`);
        this.avatarPane.insertBefore(avatar, this.avatarPane.firstChild);
        const promise = PromiseTools.wait(100).then(() => {
            this.avatarPane.classList.add('presenting');
            avatar.classList.add('introduced');
            return Promise.all([
                PromiseTools.waitForDOMEvent(this.avatarPane, 'transitionend'),
                PromiseTools.waitForDOMEvent(avatar, 'transitionend'),
            ]);
        });
        return PromiseTools.toVoid(promise);
    }
    remove(nameOrElement) {
        const avatar = typeof nameOrElement === 'string' ?
            this.getActiveAvatar(nameOrElement) : nameOrElement;
        if (this.avatarPane.childElementCount === 1) {
            this.avatarPane.classList.remove('presenting');
        }
        avatar.classList.remove(`introduced`);
        const transitionPromise = PromiseTools.waitForDOMEvent(avatar, 'transitionend');
        return transitionPromise.then(() => {
            this.avatarArchive.insertBefore(avatar, null);
            avatar.classList.remove(`avatar-on-left`, `avatar-on-right`);
        }).then(() => {
            return PromiseTools.waitForDOMEvent(this.avatarPane, 'transitionend');
        }).then(() => {
            if (this.avatarPane.childElementCount === 0) {
                this.avatarPane.classList.add('undisplayed');
            }
        });
    }
    clear() {
        const promises = [];
        for (const avatar of this.activeAvatars) {
            promises.push(this.remove(avatar));
        }
        return PromiseTools.toVoid(Promise.all(promises));
    }
    getDormantAvatar(name) {
        const avatar = this.getAvatar(this.dormantAvatars, name);
        if (avatar === undefined) {
            throw new Error(`Failed to find dormant avatar with name ${name}`);
        }
        return avatar;
    }
    getActiveAvatar(name) {
        const avatar = this.getAvatar(this.activeAvatars, name);
        if (avatar === undefined) {
            throw new Error(`Failed to find active avatar with name ${name}`);
        }
        return avatar;
    }
    getAvatar(collection, name) {
        for (const avatar of collection) {
            const nameAttribute = avatar.getAttribute('data-avatar-name');
            console.log(`Considering ${nameAttribute}`);
            if (nameAttribute === name) {
                return avatar;
            }
        }
    }
}
