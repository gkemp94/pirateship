import { DMXController } from "./DMXController";
import { FogMachine } from "./FogMachine";
import { SevenChannelRGB } from "./SevenChannelRGB";

const FOG_MACHINE_ENABLED = true;

function lerp(start: number, end: number, t: number) {
  return start + t * (end - start);
}

function simulateStormyOcean(light: SevenChannelRGB, fogMachine: FogMachine) {
  let isLightning = false;
  let canLightning = true;
  const deepOceanBlue = [0, 51, 102];
  const stormyGreen = [0, 102, 102];
  let currentColor = [...deepOceanBlue];
  let targetColor = [...stormyGreen];
  let brightness = 75;

  function updateLight() {
    if (isLightning) {
      return;
    }

    // Gradually change color
    for (let i = 0; i < 3; i++) {
      currentColor[i] = lerp(currentColor[i], targetColor[i], 0.1);
    }

    // Gradually change brightness
    if (Math.random() > 0.95) {
      // 5% chance to change brightness target
      brightness = Math.random() * 75 + 100; // Random brightness between 25% and 75%
    }
    let currentBrightness = lerp(light.getBrightness(), brightness, 0.05);

    light.setBrightness(Math.round(currentBrightness)).setRGB(currentColor.map(Math.round)).update();

    if (Math.random() > 0.98) {
      targetColor = targetColor === deepOceanBlue ? stormyGreen : deepOceanBlue;
    }
  }

  // Simulate lightning
  function lightning() {
    if (Math.random() > 0.85 && canLightning) {
      isLightning = true;
      canLightning = false;
      let currentBrightness = lerp(light.getBrightness(), brightness, 0.05);
      light.setRGB([255, 255, 255]).setBrightness(100).strobe(true).update();

      setTimeout(() => {
        isLightning = false;
        light.strobe(false).setRGB(currentColor.map(Math.round)).setBrightness(currentBrightness).update();
        setTimeout(() => {
          canLightning = true;
        }, 5000);
      }, 500);
    }
  }

  const FIVE_MINUTES = 1000 * 60 * 5;

  // Simulate fog
  setInterval(() => {
    console.log(`Fogging`);
    FOG_MACHINE_ENABLED && fogMachine.run(50).update();
    setTimeout(() => {
      console.log(`Clearing fog`);
      fogMachine.run(0).update();
    }, 5000);
  }, FIVE_MINUTES);

  setInterval(updateLight, 100);
  setInterval(lightning, 10000); // Check for lightning every 10 seconds
  setInterval(() => {
    // isDark();
  }, 5000);
}
/**
function simulateEerieLight(light: SevenChannelRGB, fogMachine: FogMachine) {
  const eerieOrange = [255, 85, 0]; // RGB for an orange color
  let currentColor = [...eerieOrange];
  let brightness = 50;

  function updateLight() {
    console.log("up");
    // Gradually change brightness
    if (Math.random() > 0.5) {
      console.log("flicker");
      // 30% chance to change brightness target
      brightness = Math.random() * 35 + 35; // Random brightness between 35% and 65%
    }
    console.log(light.getBrightness());
    let currentBrightness = lerp(light.getBrightness(), brightness, 1); // Increased the lerp factor for faster transition

    light.setBrightness(Math.round(currentBrightness)).setRGB(currentColor.map(Math.round)).update();
  }

  setInterval(updateLight, 1000); // Update the light every 50 milliseconds for more frequent flickering
}
 */

// Runs git pull every 5 mins
const pollGithub = () => {
  const { exec } = require("child_process");
  exec("git pull", (err: any, stdout: any, stderr: any) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });

  // Poll Github every 30 seconds
  setTimeout(pollGithub, 30000);
  // setTimeout(pollGithub, 300000);
};

(() => {
  const controller = new DMXController();
  const light = new SevenChannelRGB({ controller, start: 0 });
  const fogMachine = new FogMachine({ controller, start: 7 });
  simulateStormyOcean(light, fogMachine);
  pollGithub();
})();
