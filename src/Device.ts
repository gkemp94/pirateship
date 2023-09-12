import { DMXController } from "./DMXController";

export class Device {
  private _data: number[];
  private controller: DMXController;
  private start: number;

  constructor({ controller, start, count }: { controller: DMXController; start: number; count: number }) {
    this._data = new Array(count).fill(0);
    this.controller = controller;
    this.start = start;
    controller.set(start, this._data);
  }

  get data() {
    return this._data;
  }

  set data(values: number[]) {
    this._data.splice(0, values.length, ...values);
  }

  public update() {
    this.controller.set(this.start, this._data);
  }
}
