import { urldecode, urlencode } from "@osumi/tools";
import { BackupInterface } from "src/app/interfaces/interfaces";

export class Backup {
  constructor(
    public id: number = null,
    public idAccount: number = null,
    public account: string = null,
    public date: string = null
  ) {}

  fromInterface(b: BackupInterface): Backup {
    this.id = b.id;
    this.idAccount = b.idAccount;
    this.account = urldecode(b.account);
    this.date = b.date;

    return this;
  }

  toInterface(): BackupInterface {
    return {
      id: this.id,
      idAccount: this.idAccount,
      account: urlencode(this.account),
      date: this.date,
    };
  }
}
