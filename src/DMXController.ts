import FormData from "form-data";
import axios, { AxiosInstance } from "axios";
import throttle from "lodash/throttle";

export class DMXController {
  private client: AxiosInstance;
  private universe: number;
  private data: number[] = new Array(512).fill(0);

  constructor({ baseURL = "http://raspberrypi.local:9090", universe = 0 } = {}) {
    this.update = throttle(this.update.bind(this), 100);
    this.universe = universe;
    this.client = axios.create({
      baseURL,
    });
  }

  set(start: number, values: number[]) {
    this.data.splice(start, values.length, ...values);
    this.update();
  }

  update() {
    const payload = new FormData();
    payload.append("u", this.universe.toString());
    payload.append("d", `${this.data.join(",")}`);
    this.client.post("/set_dmx", payload);
  }
}
