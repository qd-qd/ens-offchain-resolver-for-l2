function decodeDnsName(dnsname: Buffer) {
    const labels = [];
    let idx = 0;
    while (true) {
        const len = dnsname.readUInt8(idx);
        if (len === 0) break;
        labels.push(dnsname.slice(idx + 1, idx + len + 1).toString('utf8'));
        idx += len + 1;
    }
    return labels.join('.');
}

export default decodeDnsName;