let walletElement = document.getElementById("wallet");
let bankElement = document.getElementById("bank");
let timeElement = document.getElementsByClassName("time")[0];
const playerCountElement = document.getElementById("playersCountSPAN");
let audioPlayer = null;
let customRadio = null;
let indicatorsInterval = null;
let hudHelp = true;
let hudStatus = true;
let indicatorsStatus = {
    0: false,
    1: false,
};

window.addEventListener("message", function(event) {
    if (event.data.display == true) {
        $("body").fadeIn(400);
    } else if (event.data.display == false) {
        $("body").fadeOut(400);
    } else if (event.data.action == "handleBeam") {
        handleBeam(event.data.data);
    } else if (event.data.action == "isUserSpeaking") {
        isUserSpeaking(event.data.data);
    } else if (event.data.action == "toggleCarHud") {
        toggleCarHud(event.data.data);
    } else if (event.data.action == "updateCarHud") {
        updateCarHud(event.data.data.speed, event.data.data.geer);
    } else if (event.data.action == "updateHudFuel") {
        updateHudFuel(event.data.data);
    } else if (event.data.action == "updateCarHud") {
        updateCarHud(event.data.data);
    } else if (event.data.action == "handleEngine") {
        handleEngine(event.data.data);
    } else if (event.data.action == "handleLock") {
        handleLock(event.data.data);
    } else if (event.data.action == "handleBelt") {
        handleBelt(event.data.data);
    } else if (event.data.action == "toggleHud") {
        toggleHud();
	} else if (event.data.action == 'handleDamage') {
		setDamage(event.data.data);
    } else if (event.data.action == "updateMoney") {
        updateUserMoney(event.data.data.cash, event.data.data.bank);
    } else if (event.data.action == "playerName") {
        setPlayerName(event.data.data);
    } else if (event.data.action == "toggleInfo") {
        toggleInfo()
    } else if (event.data.action == "updatePlayerCount") {
		updatePlayerCount(event.data.data);
	} else if (event.data.action == 'init') {
		
		updateUserMoney(event.data.data.cash, event.data.data.tether);

		
		console.log('HUD: Initiated.');
	} else if (event.data.action == "updateHunger") {
		setHunger(event.data.data);
	} else if (event.data.action == "updateThirst") {
		setThirst(event.data.data);
	// } else if (event.data.action == "updateDate") {
	// 	document.getElementById("date").innerText = event.data.data;
	// } else if (event.data.action == "updateTime") { 
	//     document.getElementById("time").innerText = event.data.data;
	}
});

function updatePlayerCount(count)
{
	playerCountElement.innerHTML = count + '<span style="opacity: 40% !important;">/200</span>';
}

function updateUserMoney(cash, bank) {
    walletElement.innerHTML = cash;
    bankElement.innerHTML = bank;
}

function setPlayerName(name) {
    if (name) {
        document.getElementById("playerName").innerText = name;
    }
}

function toggleInfo() {
    hudHelp = !hudHelp;
    document.getElementById("infobuttons").style.display = (hudHelp == true ? "block" : "none");
}

function toggleHud() {
    hudStatus = !hudStatus;
    document.getElementById("mainContainer").style.display = (hudStatus == true ? "block" : "none");
}

function handleEngine(status) {
    if (status == true) {
        document.getElementById("engine").classList.remove("status-off");
        document.getElementById("engine").classList.add("status-on");
    } else {
        document.getElementById("engine").classList.remove("status-on");
        document.getElementById("engine").classList.add("status-off");
    }
}

function setDamage(number) {
	document.getElementById("damage").innerText = number;
	
}
function handleBelt(status) {
    if (status == true) {
        document.getElementById("seatbelt").classList.remove("status-off");
        document.getElementById("seatbelt").classList.add("status-on");
    } else {
        document.getElementById("seatbelt").classList.remove("status-on");
        document.getElementById("seatbelt").classList.add("status-off");
    }
}

function handleBeam(status) {
    if (status == true) {
        document.getElementById("highbeam").classList.remove("status-off");
        document.getElementById("highbeam").classList.add("status-on");
    } else {
        document.getElementById("highbeam").classList.remove("status-on");
        document.getElementById("highbeam").classList.add("status-off");
    }
}

function handleLock(status) {
    if (status == true) {
        document.getElementById("lock").classList.remove("status-off");
        document.getElementById("lock").classList.add("status-on");
    } else {
        document.getElementById("lock").classList.remove("status-on");
        document.getElementById("lock").classList.add("status-off");
    }
}

function handleLiveRadio(source) {
    if (source == "OFF") {
        //Disable kon soundo
        //Check mikonim bebinim asan chizi pakhsh mikardim?!
        if (customRadio != null) {
            customRadio.stop();
            customRadio = null;
        }
    } else {
        //Play kon
        if (customRadio != null)
        //Ye custome dige dare play mishe ono stop kon
            customRadio.stop();

        customRadio = new Howl({
            src: [source],
            autoplay: true,
            volume: 0.5,
            html5: true,
            onend: function() {
                //Hichvaght nemishe vali just in case!
                customRadio = null;
            },
        });

        customRadio.play();
    }
}

function playSound(name, volume = 1) {
    audioPlayer = new Audio("sounds/" + name + ".ogg");
    audioPlayer.volume = volume;
    audioPlayer.play();
}

function setTime(time) {
    document.documentElement.style.setProperty("--text", '"' + time + '"');
}

function initHud(name, cash, bank, hunger) {
    setPlayerName(name);
    updateUserMoney(cash, bank);
    isUserSpeaking(false);
    setHunger(hunger);
}

function setHunger(amount) {
	document.getElementById("hunger").style.width =  amount + "%";
}

function setThirst(amount) { 
    document.getElementById("thirst").style.width =  amount + "%";
}

function isUserSpeaking(toggle) {
    if (toggle == true) {
        document.getElementById("sound").classList.remove("hidden");
    } else {
        document.getElementById("sound").classList.add("hidden");
    }
}

function toggleCarHud(toggle) {
    if (toggle == true) {
        document.getElementById("speedometer").classList.remove("hidden");
    } else if (toggle == false) {
        document.getElementById("speedometer").classList.add("hidden");

        document.getElementById("sorat").innerText = "0";
        document.getElementById("benzin").innerText = "100%";

        indicatorsStatus[0] = false;
        indicatorsStatus[1] = false;
        playIndicatorSound = false;
    }
    return;
}

function updateHudFuel(fuel) {
    document.getElementById("benzin").innerText = fuel + "%";
}

let playIndicatorSound = false;
let soundLoop = setInterval(() => {
    if (playIndicatorSound == true) playSound("car-indicators");
}, 800);

function updateIndicators(type) {
    let keyword = type != 0 ? "right" : "left";
    let element = document.getElementById(keyword + "-indic");
    let status = indicatorsStatus[type];

    if (status) {
        //Roshane khamosh she
        indicatorsStatus[type] = false;
        element.style.color = "white";
    } //Khamoshe roshan she!
    else {
        indicatorsStatus[type] = true;
        element.style.color = "lightgreen";
        if (indicatorsInterval == null) {
            indicatorsInterval = setInterval(() => {
                playIndicatorSound = false;
                for (let i = 0; i <= 1; i++) {
                    if (indicatorsStatus[i] == true) {
                        playIndicatorSound = true;
                        let converted = i != 0 ? "right" : "left";
                        let curElement = document.getElementById(converted + "-indic");
                        let white = curElement.style.color == "white";

                        if (white) {
                            curElement.style.color = "lightgreen";
                        } else {
                            curElement.style.color = "white";
                        }
                    }
                }
            }, 800);
        }
    }
}

function updateCarHud(speed, gear) {
    document.getElementById("sorat").innerText = speed.toString();
    document.getElementById("gear").innerText = gear.toString();
}