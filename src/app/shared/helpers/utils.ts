export const isAValidKey = (keycode: string): boolean => {
    const teclaMas = 'NumpadAdd'.toLowerCase();
    const teclaMenos = 'NumpadSubtract'.toLowerCase();
    const teclaPor = 'NumpadMultiply'.toLowerCase();
    const teclaDividir = 'NumpadDivide'.toLowerCase();
    const teclaSlashs = 'Slash'.toLowerCase();
    const teclaSpace = 'Space'.toLowerCase();
    const teclaSeleccionada = keycode.toLowerCase();
    // return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57
    if (teclaSeleccionada == teclaMas || teclaSeleccionada == teclaMenos || teclaSeleccionada == teclaPor || teclaSeleccionada == teclaDividir || teclaSeleccionada == teclaSlashs || teclaSeleccionada == teclaSpace) {
        return false;
    }
    return true;
}

export function removeFromArray(array: any, elem: any) {
    const tempArray = [...array];
    var index = tempArray.indexOf(elem);
    if (index > -1) {
        tempArray.splice(index, 1);
    }
    return tempArray;
}