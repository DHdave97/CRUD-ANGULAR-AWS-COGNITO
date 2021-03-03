export class DateFormatter {
  static formatDate(date: string | Date) {
    const fecha = new Date(date);
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1;
    const day = fecha.getDate();
    return new Date(`${day}/${month}/${year}`);
  }
  static dateToString(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  }
}
