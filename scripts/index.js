import { Game } from "./Game.js";
import { PromiseTools } from "./PromiseTools.js";
const collisionCanvas = document.getElementById('game-col-canvas');
if (!(collisionCanvas instanceof HTMLCanvasElement)) {
    throw new Error('Failed to find collision canvas element');
}
const backgroundImage = document.getElementById('game-bg-image');
if (!(backgroundImage instanceof HTMLImageElement)) {
    throw new Error('Failed to find background image element');
}
const dialogContainer = document.getElementById('dialog-container');
if (!(dialogContainer instanceof HTMLElement)) {
    throw new Error('Failed to find dialog container element');
}
const dialogTextContainer = document.getElementById('dialog-text-container');
if (!(dialogTextContainer instanceof HTMLElement)) {
    throw new Error('Failed to find dialog text container element');
}
const dialogResponseContainer = document.getElementById('dialog-response-container');
if (!(dialogResponseContainer instanceof HTMLElement)) {
    throw new Error('Failed to find dialog response container element');
}
const avatarContainer = document.getElementById('avatar-container');
if (!(avatarContainer instanceof HTMLElement)) {
    throw new Error('Failed to find avatar container element');
}
const avatarArchive = document.getElementById('avatar-archive');
if (!(avatarArchive instanceof HTMLElement)) {
    throw new Error(`Failed to find avatar archive element`);
}
const triggerPane = document.getElementById('trigger-pane');
if (!(triggerPane instanceof HTMLElement)) {
    throw new Error(`Failed to find trigger pane element.`);
}
const browserProvider = {
    backgroundImage: backgroundImage,
    collisionCanvas: collisionCanvas,
    dialogContainer: dialogContainer,
    dialogTextContainer: dialogTextContainer,
    dialogResponseContainer: dialogResponseContainer,
    avatarContainer: avatarContainer,
    avatarArchive: avatarArchive,
    triggerPane: triggerPane,
};
const scenario = {
    inceptionScene: `dorm`,
    dialogs: new Map(),
    scenes: new Map()
};
/**************************************/
/* Add dialogs.
/**************************************/
scenario.dialogs.set('dorm-q1-d1', {
    text: '..up! Wake up, dude!',
    responses: new Map([
        ['...', g => g.setDialog('dorm-q1-d2')]
    ]),
});
scenario.dialogs.set('dorm-q1-d2', {
    text: `You've nearly overslept!`,
    responses: new Map([
        ['...', g => g.setDialog('dorm-q1-d3')]
    ])
});
scenario.dialogs.set('dorm-q1-d3', {
    text: `It's a good thing I decided to check up on you.`,
    responses: new Map([
        ['...', g => g.setDialog('dorm-q1-d4')]
    ])
});
scenario.dialogs.set('dorm-q1-d4', {
    text: `Once you entirely wake up you should get dressed and ready and all, I'll be waiting for you in the hall. And I sure do hope you won't fall back asleep, otherwise I'll sprinkle you with cold water!`,
    responses: new Map([
        [`...`, g => Promise.resolve({ nextScene: 'room', nextState: 'q1' })]
    ])
});
scenario.dialogs.set('room-q1-d1', {
    text: `It takes you time to gather strength and  get out of bed. You now stand in a cozy room: there's an old wardrobe with your clothes in it, a table where countless piles of books and study materials lie, a ray of light found its way through the semi-transparent blue curtains that are halfway open.`,
    responses: new Map([
        [`...`, g => g.setDialog('room-q1-d2')]
    ])
});
scenario.dialogs.set('room-q1-d2', {
    text: `You pick an outfit and leave the room.`,
    responses: new Map([
        [`...`, g => g.clearDialogs()
                .then(() => g.addTrigger(0.21, 0.48, () => Promise.resolve({ nextScene: 'hall', nextState: 'q1' })))
        ]
    ])
});
scenario.dialogs.set(`hall-q1-d1`, {
    text: `You are now in a spacious hall, where your Cheerful friend stands, looking at his/her phone.`,
    responses: new Map([
        [`...`, g => Promise.all([
                g.setDialog('hall-q1-d2'),
                g.addAvatar('ned', 'left')
            ]).then(() => { })]
    ])
});
scenario.dialogs.set('hall-q1-d2', {
    text: `You're done, great! I was just checking the timetable, I forgot where my first class takes place.`,
    responses: new Map([
        [`...`, g => g.removeAvatar('ned').then(() => g.setDialog('hall-q1-d3'))
        ]
    ])
});
scenario.dialogs.set('hall-q1-d3', {
    text: `I suggest you check yours too, just to be sure. `,
    responses: new Map([
        [`[Check the timetable]`, g => PromiseTools.toVoid(Promise.all([
                g.addAvatar('ned', 'left'),
                g.setDialog('hall-q1-d4')
            ]))]
    ])
});
scenario.dialogs.set(`hall-q1-d4`, {
    text: `Did you finish checking? Alright, let's head out. `,
    responses: new Map([
        [`...`, g => g.clearDialogs()
                .then(() => g.removeAvatar('ned'))
                .then(() => g.addTrigger(0.24, 0.55, () => {
                return g.clearTriggers()
                    .then(() => g.setDialog('outside-q1-d1'));
            }))
        ]
    ])
});
scenario.dialogs.set('outside-q1-d1', {
    text: `On your way out your meet two girls: one's wearing a strange-looking pin with a Neanderthal-like man in brownish rags...`,
    responses: new Map([
        [`...`, g => g.setDialog('outside-q1-d2')]
    ])
});
scenario.dialogs.set('outside-q1-d2', {
    text: `...and the other is wearing a pin with a cute Princess-like girl in a quaint dress.`,
    responses: new Map([
        [`...`, g => g.setDialog('outside-q1-d3')]
    ])
});
scenario.dialogs.set('outside-q1-d3', {
    text: `You've seen them around the campus a few times, though you're not sure you've ever caught their names.`,
    responses: new Map([
        [`...`, g => g.setDialog('outside-q1-d4')]
    ])
});
scenario.dialogs.set('outside-q1-d4', {
    text: `Laura? Anne? Maria? Of course one of them would be Maria.`,
    responses: new Map([
        [`...`, g => g.addAvatar('patty', 'left')
                .then(() => g.setDialog('outside-q1-d5'))]
    ])
});
scenario.dialogs.set('outside-q1-d5', {
    text: `... and that's why a cyborg-shark would never lose to an armed gorilla.`,
    responses: new Map([
        [`...`, g => Promise.all([
                g.addAvatar('marge', 'right'),
                g.removeAvatar('patty'),
                g.setDialog('outside-q1-d6')
            ]).then(() => { })]
    ])
});
scenario.dialogs.set('outside-q1-d6', {
    text: `Yeah, I'm not sure about what that has to do with Buddy's situation. You're a pro at changing subjects, that's for sure.`,
    responses: new Map([
        [`...`, g => Promise.all([
                g.addAvatar('patty', 'left'),
                g.removeAvatar('marge'),
                g.setDialog('outside-q1-d7')
            ]).then(() => { })]
    ])
});
scenario.dialogs.set('outside-q1-d7', {
    text: `Oh, right. We were talking about Buddy. So what if he's been skipping class, I mean, how much trouble can one person get in because of that?`,
    responses: new Map([
        [`...`, g => Promise.all([
                g.addAvatar('marge', 'right'),
                g.removeAvatar('patty'),
                g.setDialog('outside-q1-d8')
            ]).then(() => { })]
    ])
});
scenario.dialogs.set('outside-q1-d8', {
    text: `You DO know you're not allowed to skip more than (x) times, right? After that comes expulsion, Maria.`,
    responses: new Map([
        [`...`, g => Promise.all([
                g.clearAvatars(),
                g.setDialog('outside-q1-d9')
            ]).then(() => { })]
    ])
});
scenario.dialogs.set('outside-q1-d9', {
    text: `Maria's definitely bored with the subject of Buddy skipping class.`,
    responses: new Map([
        [`...`, g => g.setDialog('outside-q1-d10')]
    ])
});
scenario.dialogs.set('outside-q1-d10', {
    text: `Now you know why she was so involved while talking about cyborg-sharks and whatnots rather than talking about her friend.`,
    responses: new Map([
        [`...`, g => Promise.all([
                g.addAvatar('patty', 'left'),
                g.setDialog('outside-q1-d11')
            ]).then(() => { })]
    ])
});
scenario.dialogs.set('outside-q1-d11', {
    text: `Yeah, yeah, we've all heard that, thank you.`,
    responses: new Map([
        [`...`, g => Promise.all([
                g.removeAvatar('patty'),
                g.addAvatar('ned', 'left'),
                g.setDialog('outside-q1-d12')
            ]).then(() => { })]
    ])
});
scenario.dialogs.set('outside-q1-d12', {
    text: `Oh, hi guys! Are you headed to the uni?`,
    responses: new Map([
        [`...`, g => g.setDialog('outside-q1-d13')]
    ])
});
scenario.dialogs.set('outside-q1-d13', {
    text: `Because I was just about to go to...`,
    responses: new Map([
        [`...`, g => Promise.all([
                g.removeAvatar('ned'),
                g.setDialog('outside-q1-d14')
            ]).then(() => { })]
    ])
});
scenario.dialogs.set('outside-q1-d14', {
    text: `Maria inconspicuously walks away from her friend. Suddenly, she is grabbed by the shoulder.`,
    responses: new Map([
        [`...`, g => Promise.all([
                g.addAvatar('marge', 'right'),
                g.setDialog('outside-q1-d15')
            ]).then(() => { })]
    ])
});
scenario.dialogs.set('outside-q1-d15', {
    text: `But we're not done talking yet!`,
    responses: new Map([
        [`...`, g => Promise.all([
                g.removeAvatar('marge'),
                g.setDialog('outside-q1-d17')
            ]).then(() => { })]
    ])
});
scenario.dialogs.set('outside-q1-d17', {
    text: `You think that something inside Maria has died that day.`,
    responses: new Map([
        [`...`, g => g.setDialog('outside-q1-d18')]
    ])
});
scenario.dialogs.set('outside-q1-d18', {
    text: `She lowers her head and turns to her friend to keep listening.`,
    responses: new Map([
        [`...`, g => g.setDialog('outside-q1-d19')]
    ])
});
scenario.dialogs.set('outside-q1-d19', {
    text: `Or at leats to pretend to listen.`,
    responses: new Map([
        [`...`, g => g.setDialog('outside-q1-d20')]
    ])
});
scenario.dialogs.set('outside-q1-d20', {
    text: `You leave the dorms and on your way to the University you chat about who's about to do what when the classes are over.`,
    responses: new Map([
        [`...`, g => Promise.resolve({ nextScene: 'outside' })]
    ])
});
scenario.dialogs.set('outside-q2-d1', {
    text: `I've heard from the guys/girls in my Chemistry class that there's a new figurine of Jessy the Harbinger/ Voltron the Barbarian in 'Kawaiishop' in Кристалл.`,
    responses: new Map([
        [`...`, g => g.setDialog('outside-q2-d2')]
    ])
});
scenario.dialogs.set('outside-q2-d2', {
    text: `What do you say we go there at around 14.30?`,
    responses: new Map([
        [`...`, g => Promise.all([
                g.setDialog('outside-q2-d3a'),
                g.clearAvatars()
            ]).then(() => { })]
    ])
});
scenario.dialogs.set('outside-q2-d3a', {
    text: `14:30 today sounds about right. Wait, won't I be in the middle of my Biology class?`,
    responses: new Map([
        [`...`, g => Promise.all([
                g.setDialog('outside-q2-d3'),
                g.addAvatar('ned', 'left')
            ]).then(() => { })]
    ])
});
scenario.dialogs.set('outside-q2-d3', {
    text: `...`,
    responses: new Map([
        [`I'd love to, but I'm afraid I have a class at that time. Can't we go at a different time, say, at 16.00?`,
            g => g.setDialog('outside-q2-d3-1')
        ],
        [`Sure, why not. I mean, it's JtH/VtB we're talking about here, I can't miss such a treasure.`,
            g => Promise.all([
                g.clearAvatars(),
                g.setDialog('outside-q2-d4')
            ]).then(() => { })]
    ])
});
scenario.dialogs.set('outside-q2-d3-1', {
    text: `Nah, man, it's a limited edition Figurine! The sale'll be held from 14.30 to 15.30, we won't make it in time if we go later!`,
    responses: new Map([
        [`Yes but you've heard the girls in the hall, we'll be in trouble if we skip lessons. Perhaps, there's some other way to obtain the Figurine, I'm sure the sale's not our only option.`,
            g => g.setDialog('outside-q2-d3-1-1')
        ],
        [`Perhaps you're right. Since it's a limited edition and all, it's all for the better to go and buy the Figurine while there's still a chance.`,
            g => g.setDialog('outside-q2-d3-1-2')
        ]
    ])
});
scenario.dialogs.set('outside-q2-d3-1-1', {
    text: `I wouldn't be so sure about that, but... I guess we'll have to wait and see.`,
    responses: new Map([
        [`...`, g => Promise.all([
                g.clearAvatars(),
                g.setDialog('outside-q2-d4')
            ]).then(() => { })]
    ])
});
scenario.dialogs.set('outside-q2-d3-1-2', {
    text: `Cool! I'll be sure to message you when I'm ready.`,
    responses: new Map([
        [`...`, g => Promise.all([
                g.clearAvatars(),
                g.setDialog('outside-q2-d4')
            ]).then(() => { })]
    ])
});
scenario.dialogs.set('outside-q2-d4', {
    text: `Just as you finish the chat the bus arrives at the right stop and you both leave. You part ways and are now headed to the institute where the morning lesson will be held.`,
    responses: new Map([
        [`...`, g => g.setDialog('outside-q2-d5')]
    ])
});
scenario.dialogs.set('outside-q2-d5', {
    text: `Fin.`,
    responses: new Map()
});
/**************************************/
/* Add scenes.
/**************************************/
scenario.scenes.set('dorm', {
    'initialState': 'q1',
    'states': new Map([
        ['q1', g => g.setBackground('assets/bg/waking-up.png')
                .then(() => g.setDialog(`dorm-q1-d1`))
        ]
    ])
});
scenario.scenes.set(`room`, {
    initialState: `q1`,
    states: new Map([
        [`q1`, g => g.setBackground(`assets/bg/basic-dorm-room.png`)
                .then(() => g.setDialog(`room-q1-d1`))
        ]
    ])
});
scenario.scenes.set('hall', {
    'initialState': 'q1',
    'states': new Map([
        ['q1', g => g.setBackground('assets/bg/basic-dorm-hall.png')
                .then(() => g.setDialog(`hall-q1-d1`))
        ]
    ]),
});
scenario.scenes.set('outside', {
    'initialState': 'q1',
    'states': new Map([
        ['q1', g => g.setBackground('assets/bg/outside.png')
                .then(() => Promise.all([
                g.setDialog('outside-q2-d1'),
                g.addAvatar('ned', 'left')
            ])).then(() => { })
        ]
    ])
});
(new Game(scenario, browserProvider)).start();
