"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
exports.default = new classes_1.Event('setup', (client, setup) => {
    switch (setup.milestone.name) {
        case 'round': {
            client.room.round = new classes_1.Round(setup.milestone, client);
            setup.milestone.currentPlayerPeerId === setup.selfPeerId &&
                client.gameSocket.emit('selfTurn', setup.milestone.syllable);
            break;
        }
        case 'seating': {
            client.room.joinRound();
            client.room.seatingChatters = setup.players.map((player) => new classes_1.Chatter(player.profile, client));
            break;
        }
    }
});
