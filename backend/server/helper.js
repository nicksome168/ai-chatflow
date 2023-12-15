function generateId(len) {
    var result = [];
    var chars = 'QWERTYUIOPLKJHGFDSAZXCVBNMqwertyuioplkjhgfdsazxcvbnm0987654321';
    var charLen = chars.length;

    for (var i = 0; i < len; i++) {
        result.push(chars.charAt(Math.floor(Math.random() * charLen)));
    }
    return result.join('');
}

exports.generateId = generateId();