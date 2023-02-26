import { BackupInterface } from "src/app/interfaces/interfaces";
import { Utils } from "src/app/modules/shared/utils.class";

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
    this.account = Utils.urldecode(b.account);
    this.date = b.date;

    return this;
  }

  toInterface(): BackupInterface {
    return {
      id: this.id,
      idAccount: this.idAccount,
      account: Utils.urlencode(this.account),
      date: this.date,
    };
  }
}
