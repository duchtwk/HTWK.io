/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

let awaitingResponse: boolean = false;
let currentPopup: any = undefined;

const questions = [
    {
        question: "Willkommen, was willst du wissen?",
        options: {
            a: "Hallo! ich bin..",
            b: "Was kann ich machen?",
            c: "Wo bin ich?",
            d: "Ich habe noch weitere Fragen."
        },
        answers: {
            a: "Mich interessiert nicht, wer du bist. Du bist neu hier. Ich kümmere mich um die Neuen. Belassen wir es vorerst dabei.",
            b: "Du kannst dich ausprobieren, ohne irgendwas kaputt zu machen.",
            c: "Du bist im Lipsius-Bau, Raum LI013-L, im Hardwarelabor.",
            d: "Ich bin auch nicht allwissend. Probier' es doch mal im OPAL-Kurs dieses Raumes."
        }
    }
];

WA.room.area.onEnter("NPC").subscribe(() => {
    const question = questions[0];
    let message = question.question + "\n";
    for (const [key, value] of Object.entries(question.options)) {
        message += `${key.toUpperCase()}: ${value}\n`;
    }
    message += "Tippe einen Buchstaben ein, um mich was zu Fragen.";
    WA.chat.sendChatMessage(message, "Diego");
    awaitingResponse = true;
});

WA.chat.onChatMessage((message: string) => {
    if (awaitingResponse) {
        const question = questions[0];
        const answerKey = message.toLowerCase();
        if (question.answers[answerKey]) {
            WA.chat.sendChatMessage(question.answers[answerKey], "Diego");
        } else {
            WA.chat.sendChatMessage("Was?, ich hab dich nicht verstanden. (Ungültige Eingabe)", "Diego");
        }
    }
});

WA.room.area.onLeave("NPC").subscribe(() => {
    console.log("Left NPC area");
    awaitingResponse = false;
});

WA.room.area.onEnter("RickRoll").subscribe(() => {
    console.log("Entered RickRoll area");
    const triggerMessage = WA.ui.displayActionMessage({
        message: "Drücke die Leertaste um den Arbeitsplatz zu untersuchen.",
        callback: () => {
            WA.nav.openCoWebSite('https://www.youtube.com/embed/dQw4w9WgXcQ?si=76YKUScBNch9gsFm');
        }
    });

    setTimeout(() => {
        triggerMessage.remove();
    }, 1000);
});

WA.room.area.onEnter("Eingang").subscribe(() => {
    console.log("Entered Eingang area");
    if (currentPopup === undefined) {
        try {
            currentPopup = WA.ui.openPopup("Eingang_popup", "Willkommen im Hardwarelabor!", [{
                label: "Close",
                className: "primary",
                callback: (popup) => {
                    popup.close();
                    currentPopup = undefined;
                }
            }]);
            console.log("Opened Eingang_popup successfully");
        } catch (error) {
            console.error("Error while opening Eingang_popup: ", error);
        }
    }
});

WA.room.area.onLeave("Eingang").subscribe(() => {
    console.log("Left Eingang area");
    closePopup();
});

function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

WA.ui.modal.openModal({
    title: "WorkAdventure",
    src: "https://www.htwk-leipzig.de",
    allow: "fullscreen",
    allowApi: true,
    position: "center",
});
