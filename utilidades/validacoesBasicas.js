function isStringVazio(string) {
    if (string == null) return true;
    if (string.length == 0) return true;

    return false;
}

function isArrayVazio(array) {
    if (array.length == 0) return true;

    return false;
}

module.exports = {isStringVazio, isArrayVazio}