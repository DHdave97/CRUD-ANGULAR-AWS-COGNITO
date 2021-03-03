import { PrintType } from 'src/app/shared/enums';

export class PrintOptions {
  constructor(
    public type: PrintType = PrintType.CURRENT,
    public details: boolean = false,
    public resultsPerPage: number = 40
  ) {}
}
