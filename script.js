var gameData = {
    unassignedMiningDroids: 1,
    totalMiningDroids: 1,
    electricity: 100,
    electricityMaximum: 100,
    electricityPerSecond: 1,
    solarPanels: 1,
    solarPanelsMaximum: 0,
    electricityPerSecondPerSolarPanel: 1,
    ice: 0,
    iceMaximum: 10,
    icePerSecond: 0,
    iceDroids: 0,
    icePerSecondPerDroid: 0.5,
    rocketFuel: 10,
    rocketFuelMaximum: 10,
    rocketFuelPerSecond: 0,
    rocketFuelPerAssignedDroidPerSecond: 0.1,
    rocketFuelRefinery: true,
    rocketFuelRefineryActive: false,
    rocketFuelPerSecondPerRefinery: 1,
    icePerSecondPerRefinery: 0.5,
    electricityPerSecondPerRefinery: 4,
    iron: 0,
    ironMaximum: 10,
    ironPerSecond: 0,
    ironDroids: 0,
    ironPerSecondPerDroid: 0.25,
    silicon: 0,
    siliconMaximum: 10,
    siliconPerSecond: 0,
    siliconDroids: 0,
    siliconPerSecondPerDroid: 0.4,
}

var savegame = JSON.parse(localStorage.getItem("galaxyIncrementalSave"));
if (savegame !== null) {
    gameData = savegame;
}

function createMiningDroid() {
    // Mining Droid Price
    const priceIron = 10;
    const priceSilicon = 5;
    const priceElectricity = 1;
    if (priceIron <= gameData.iron && priceSilicon <= gameData.silicon && priceElectricity <= gameData.electricity) {
        gameData.unassignedMiningDroids++;
        gameData.totalMiningDroids++;

        gameData.iron -= priceIron;
        gameData.silicon -= priceSilicon;
        gameData.electricity -= priceElectricity;

        updateUI();
    }
}

function createSolarPanel() {
    // Solar Panel Price
    const priceIron = 5;
    const priceSilicon = 10;
    const priceElectricity = 1;
    if (priceIron <= gameData.iron && priceSilicon <= gameData.silicon && priceElectricity <= gameData.electricity) {
        gameData.solarPanels++;

        gameData.iron -= priceIron;
        gameData.silicon -= priceSilicon;
        gameData.electricity -= priceElectricity;

        updateUI();
    }
}

function updateResourcesPerSecond() {
    currentActiveDroids = gameData.totalMiningDroids - gameData.unassignedMiningDroids;

    // Calculate if there is enough Rocket Fuel to run Droids
    let droidsActive = true;
    if (gameData.rocketFuel < (currentActiveDroids * gameData.rocketFuelPerAssignedDroidPerSecond)) {
        droidsActive = false;
    }

    // Calculate if there is enough Ice and Electricity to run Rocket Fuel Refinery
    let refineryActive = true;
    if (gameData.ice < gameData.icePerSecondPerRefinery || gameData.electricity < gameData.electricityPerSecondPerRefinery) {
        refineryActive = false;
    }

    // ======================
    // Electricity
    // ======================

    // Calculate Electricity from Solar Panels
    electricityFromSolarPanels = gameData.solarPanels * gameData.electricityPerSecondPerSolarPanel;

    // Calculate Electricity spent by Rocket Fuel Refineries
    electricityDeficitFromRocketFuelRefineries = gameData.rocketFuelRefineryActive ? gameData.electricityPerSecondPerRefinery : 0;

    gameData.electricityPerSecond = electricityFromSolarPanels - electricityDeficitFromRocketFuelRefineries;

    // ======================
    // Ice
    // ======================

    // Calculate Ice from Droids
    iceFromDroids = droidsActive ? gameData.iceDroids * gameData.icePerSecondPerDroid : 0;

    // Calculate Ice spent by Rocket Fuel Refineries
    iceDeficitFromRocketFuelRefineries = gameData.rocketFuelRefineryActive ? gameData.icePerSecondPerRefinery : 0;

    gameData.icePerSecond = iceFromDroids - iceDeficitFromRocketFuelRefineries;

    // ======================
    // Rocket Fuel
    // ======================

    // Calculate Rocket Fuel spent by Assigned Droids
    rocketFuelDeficitFromDroids = currentActiveDroids * gameData.rocketFuelPerAssignedDroidPerSecond;

    // Calculate Rocket Fuel gained from Refineries
    rocketFuelFromRefineries = gameData.rocketFuelRefineryActive ? gameData.rocketFuelPerSecondPerRefinery : 0;
    rocketFuelFromRefineries = refineryActive ? rocketFuelFromRefineries : 0;

    gameData.rocketFuelPerSecond = rocketFuelFromRefineries - rocketFuelDeficitFromDroids;

    // ======================
    // Iron
    // ======================

    // Calculate Iron from Droids
    ironFromDroids = droidsActive ? gameData.ironDroids * gameData.ironPerSecondPerDroid : 0;

    gameData.ironPerSecond = ironFromDroids;

    // ======================
    // Silicon
    // ======================

    // Calculate Silicon from Droids
    siliconFromDroids = droidsActive ? gameData.siliconDroids * gameData.siliconPerSecondPerDroid : 0;

    gameData.siliconPerSecond = siliconFromDroids;
}

function updateResources() {
    // Electricity
    gameData.electricity += gameData.electricityPerSecond;

    if (gameData.electricity > gameData.electricityMaximum) {
        gameData.electricity = gameData.electricityMaximum;
    }
    if (gameData.electricity < 0) {
        gameData.electricity = 0;
    }

    // Ice
    gameData.ice += gameData.icePerSecond;

    if (gameData.ice > gameData.iceMaximum) {
        gameData.ice = gameData.iceMaximum;
    }
    if (gameData.ice < 0) {
        gameData.ice = 0;
    }

    // Rocket Fuel
    gameData.rocketFuel += gameData.rocketFuelPerSecond;

    if (gameData.rocketFuel > gameData.rocketFuelMaximum) {
        gameData.rocketFuel = gameData.rocketFuelMaximum;
    }
    if (gameData.rocketFuel < 0) {
        gameData.rocketFuel = 0;
    }

    // Iron
    gameData.iron += gameData.ironPerSecond;

    if (gameData.iron > gameData.ironMaximum) {
        gameData.iron = gameData.ironMaximum;
    }
    if (gameData.iron < 0) {
        gameData.iron = 0;
    }

    // Silicon
    gameData.silicon += gameData.siliconPerSecond;

    if (gameData.silicon > gameData.siliconMaximum) {
        gameData.silicon = gameData.siliconMaximum;
    }
    if (gameData.silicon < 0) {
        gameData.silicon = 0;
    }
}

function updateUI() {
    // Mining Droids
    document.getElementById("unassignedMiningDroidsCount").innerHTML = gameData.unassignedMiningDroids;
    document.getElementById("unassignedMiningDroidsTotal").innerHTML = gameData.totalMiningDroids;

    // ======================
    // Energy
    // ======================

    // Electricity
    document.getElementById("electricityCount").innerHTML = Math.floor(gameData.electricity);
    document.getElementById("electricityMaximum").innerHTML = Math.floor(gameData.electricityMaximum);
    document.getElementById("electricityPerSecond").innerHTML = gameData.electricityPerSecond.toFixed(2);
    document.getElementById("solarPanelCount").innerHTML = gameData.solarPanels;

    // Ice
    document.getElementById("iceCount").innerHTML = Math.floor(gameData.ice);
    document.getElementById("iceMaximum").innerHTML = Math.floor(gameData.iceMaximum);
    document.getElementById("icePerSecond").innerHTML = gameData.icePerSecond.toFixed(2);
    document.getElementById("iceDroidCount").innerHTML = gameData.iceDroids;

    // Rocket Fuel
    document.getElementById("rocketFuelCount").innerHTML = Math.floor(gameData.rocketFuel);
    document.getElementById("rocketFuelMaximum").innerHTML = Math.floor(gameData.rocketFuelMaximum);
    document.getElementById("rocketFuelPerSecond").innerHTML = gameData.rocketFuelPerSecond.toFixed(2);
    document.getElementById("rocketFuelRefineryActive").innerHTML = gameData.rocketFuelRefineryActive;

    // =======================
    // Raw Elements
    // =======================

    // Iron
    document.getElementById("ironCount").innerHTML = Math.floor(gameData.iron);
    document.getElementById("ironMaximum").innerHTML = Math.floor(gameData.ironMaximum);
    document.getElementById("ironPerSecond").innerHTML = gameData.ironPerSecond.toFixed(2);
    document.getElementById("ironDroidCount").innerHTML = gameData.ironDroids;

    // Silicon
    document.getElementById("siliconCount").innerHTML = Math.floor(gameData.silicon);
    document.getElementById("siliconMaximum").innerHTML = Math.floor(gameData.siliconMaximum);
    document.getElementById("siliconPerSecond").innerHTML = gameData.siliconPerSecond.toFixed(2);
    document.getElementById("siliconDroidCount").innerHTML = gameData.siliconDroids;
}

function addDroid(resource) {
    if (gameData.unassignedMiningDroids < 1) {
        return;
    }
    switch (resource) {
        case "Ice":
            gameData.iceDroids += 1;
            gameData.unassignedMiningDroids -= 1;
            break;
        case "Iron":
            gameData.ironDroids += 1;
            gameData.unassignedMiningDroids -= 1;
            break;
        case "Silicon":
            gameData.siliconDroids += 1;
            gameData.unassignedMiningDroids -= 1;
            break;
    }
    updateUI();
}

function removeDroid(resource) {
    switch (resource) {
        case "Ice":
            if (gameData["iceDroids"] > 0) {
                gameData.iceDroids -= 1;
                gameData.unassignedMiningDroids += 1;
            }
            break;
        case "Iron":
            if (gameData["ironDroids"] > 0) {
                gameData.ironDroids -= 1;
                gameData.unassignedMiningDroids += 1;
            }
            break;
        case "Silicon":
            if (gameData["siliconDroids"] > 0) {
                gameData.siliconDroids -= 1;
                gameData.unassignedMiningDroids += 1;
            }
            break;
    }
    updateUI();
}

function toggleRocketFuelRefinery() {
    gameData.rocketFuelRefineryActive = !gameData.rocketFuelRefineryActive;
    updateUI();
}

var mainGameLoop = setInterval(function () {
    updateResourcesPerSecond();
    updateResources();
    updateUI();
}, 1000);

var saveGameLoop = setInterval(function () {
    localStorage.setItem("galaxyIncrementalSave", JSON.stringify(gameData));
}, 15000);
