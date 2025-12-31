import { BackupInterface } from '@interfaces/interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class Backup {
  constructor(
    public id: number | null = null,
    public idAccount: number | null = null,
    public account: string | null = null,
    public date: string | null = null
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
