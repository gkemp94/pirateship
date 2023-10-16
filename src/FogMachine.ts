import { DMXController } from "./DMXController";
import { Device } from "./Device";

export class FogMachine extends Device {
  constructor({ controller, start = 0, count = 1 }: { controller: DMXController; start?: number; count?: number }) {
    super({ controller, start, count });
  }

  /**
   *
   * @param percentage {number} min-0 max-100
   * @returns
   */
  run(percentage: number) {
    this.data = [Math.round((Math.min(Math.max(0, percentage), 100) / 100) * 255)];
    return this;
  }
}
