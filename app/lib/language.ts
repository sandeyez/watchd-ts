export class Noun {
  constructor(
    public singular: string,
    public plural: string
  ) {}

  public toString(amount: number, includeAmount = true): string {
    const noun = amount === 1 ? this.singular : this.plural;
    return includeAmount ? `${amount} ${noun}` : noun;
  }
}
