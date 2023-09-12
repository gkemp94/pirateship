import { DMXController } from "./DMXController";
import { Device } from "./Device";
import Color from "color";

export class SevenChannelRGB extends Device {
  private brightness = 50;
  constructor({ start = 0, controller }: { start?: number; controller: DMXController }) {
    super({ start, count: 7, controller });
  }

  setHEX(hex: string) {
    const rgb = Color(hex).rgb().array();
    this.data = [this.brightness, ...rgb, 0, 0, 0];
    return this;
  }

  getBrightness() {
    return this.data[0];
  }

  setBrightness(brightness: number) {
    this.data = [Math.min(Math.max(0, brightness), 255)];
    return this;
  }

  setRGB(rgb: number[]) {
    this.data = [this.brightness, ...rgb, 0, 0];
    return this;
  }

  strobe(on: boolean) {
    const data = this.data;
    data.splice(4, 1, on ? 250 : 0);
    this.data = data;
    return this;
  }
}
