import decodeDnsName from "./decodeDnsName";

describe("decodeDnsname", () => {
    test('correctly decode a 3-levels name', () => {
        const address = "0x0471647164056d7964616f0365746800";
        const name = decodeDnsName(Buffer.from(address.slice(2), 'hex'));
        expect(name).toBe("qdqd.mydao.eth");
    });

    test('throws an error if the input is an empty string', () => {
        expect(() => decodeDnsName(Buffer.from("", 'hex'))).toThrow(new RangeError("Attempt to access memory outside buffer bounds"));
    });
});
