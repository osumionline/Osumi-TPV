import { ColorValues } from "src/app/interfaces/interfaces";

export class Utils {
  static formatNumber(num: number): string {
    if (num === null) {
      return "";
    }
    return num.toFixed(2).replace(".", ",");
  }

  static toNumber(str: string): number {
    if (str === null || str === "") {
      return 0;
    }
    return parseFloat(str.replace(",", "."));
  }

  static urlencode(str: string): string {
    if (str === null) {
      return null;
    }
    return encodeURIComponent(str)
      .replace(/\%20/g, "+")
      .replace(/!/g, "%21")
      .replace(/'/g, "%27")
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29")
      .replace(/\*/g, "%2A")
      .replace(/\~/g, "%7E");
  }

  static urldecode(str: string): string {
    if (!str) {
      return "";
    }
    return decodeURIComponent(
      str
        .replace(/\+/g, "%20")
        .replace(/\%21/g, "!")
        .replace(/\%27/g, "'")
        .replace(/\%28/g, "(")
        .replace(/\%29/g, ")")
        .replace(/\%2A/g, "*")
        .replace(/\%7E/g, "~")
    );
  }

  static validateEmail(email: string): boolean {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }

  static convertRange(
    value: number,
    oldMin: number,
    oldMax: number,
    newMin: number,
    newMax: number
  ): number {
    return (
      Math.round(
        (((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin) *
          10000
      ) / 10000
    );
  }

  static hexToRgbFloat(hex: string): ColorValues {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: Utils.convertRange(parseInt(result[1], 16), 0, 255, 0, 1),
          g: Utils.convertRange(parseInt(result[2], 16), 0, 255, 0, 1),
          b: Utils.convertRange(parseInt(result[3], 16), 0, 255, 0, 1),
        }
      : null;
  }

  static addDays(date: Date, number: number): Date {
    const newDate = new Date(date);
    return new Date(newDate.setDate(date.getDate() + number));
  }

  static getDate(date: Date): string {
    const day: string =
      date.getDate() < 10 ? "0" + date.getDate() : date.getDate().toString();
    const month: string =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : (date.getMonth() + 1).toString();

    return day + "/" + month + "/" + date.getFullYear();
  }

  static getCurrentDate(): string {
    const d: Date = new Date();
    return (
      d.getFullYear() +
      "-" +
      (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) +
      "-" +
      (d.getDate() < 10 ? "0" + d.getDate() : d.getDate())
    );
  }
}
