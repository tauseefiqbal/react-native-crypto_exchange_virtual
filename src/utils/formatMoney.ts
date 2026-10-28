export default (amount: number, decimalCount?: number, decimal = ".", thousands = ",") => {
  try {
    const num = Number(amount) || 0;
    let decimals = decimalCount !== undefined ? Math.abs(decimalCount) : (num > 0 && num < 0.01 ? 6 : 2);
    decimals = isNaN(decimals) ? 2 : decimals;

    const negativeSign = num < 0 ? "-" : "";
    const absNum = Math.abs(num);
    const fixedStr = absNum.toFixed(decimals);
    const [intPart, decPart] = fixedStr.split('.');

    const j = intPart.length > 3 ? intPart.length % 3 : 0;
    const formattedInt = (j ? intPart.substr(0, j) + thousands : '') + intPart.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands);

    return negativeSign + formattedInt + (decPart ? decimal + decPart : '');
  } catch (e) {
    console.log(e);
    return "0.00";
  }
};
