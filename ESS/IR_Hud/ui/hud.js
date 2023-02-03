// "use strict";

// const player = mp.players.local;

// global.hud = undefined;

// let playerMoney = 0;
// let playerBank  = 0;
// let playerHunger = 0;
// let playerThirst = 0;

// let playerName = "";

// let updatePlayerName = false;

// mp.events.add('browserDomReady', (browser) => {
//     if (browser === hud)
// 	{
// 		//hud.execute(`initHud("${player.name}", ${player.remoteId}, ${playerMoney}, "${gmVer}");`); //HUD o start kon
// 		hud.execute(`initHud("${playerName}", ${playerMoney}, ${playerBank}, ${playerHunger});`); //HUD o start kon
// 	}
// });

// mp.events.add("showHud", (toggle, intArray) => {
// 	if (toggle == true)
// 	{
// 		if (hud === undefined)
// 		{
// 			playerName = player.name;
// 			playerMoney = intArray[0];
// 			playerBank = intArray[1];
// 			playerHunger = intArray[2];

// 			hud = mp.browsers.new("package://RoyalRoleplay/modules/hud/index.html");	

// 		}
// 	} else {
// 		if (hud != undefined)
// 		{
// 		    hud.destroy();

//             hud = undefined;			
// 		}
// 	}
// });

// /*mp.events.add("updateHud", () => {
// 	if (hud !== undefined)
// 	{
// 	    playerMoney = player.getVariable("PLAYER_MONEY");
// 		playerBank = player.getVariable("PLAYER_BANK");
//         playerHunger = player.getVariable("PLAYER_HUNGER");

// 		hud.execute(`updateUserMoney(${playerMoney}, ${playerBank});`);
// 		hud.execute(`setHunger(${playerHunger});`);

// 		if (updatePlayerName == true)
// 		{
// 			updatePlayerName = false;
// 			playerName = player.name + " (" + player.remoteId + ")";
// 			hud.execute(`setPlayerName("${playerName}");`);
// 		}
// 	}
// }); DEP */

// mp.events.add("updateHud", (intArray) => {
// 	if (hud !== undefined)
// 	{
// 	    playerMoney = intArray[0];
// 		playerBank = intArray[1];
//         playerHunger = intArray[2];

// 		hud.execute(`updateUserMoney(${playerMoney}, ${playerBank});`);
// 		hud.execute(`setHunger(${playerHunger});`);

// 		if (updatePlayerName == true)
// 		{
// 			updatePlayerName = false;
// 			playerName = player.name;
// 			hud.execute(`setPlayerName("${playerName}");`);
// 		}
// 	}
// });

// mp.events.add("updatePlayerName", () => { updatePlayerName = true; });