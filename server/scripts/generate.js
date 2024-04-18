const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const privateKey = secp256k1.utils.randomPrivateKey();

console.log('private key:', toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey);

console.log('public key:', toHex(publicKey))

message = ""
const messageHash = keccak256(utf8ToBytes(message))
let signature = secp256k1.sign(messageHash, privateKey)
// signature = signature.addRecoveryBit(0)
sig = signature.toCompactHex()
recoverybit = signature['recovery']
console.log('signature:', signature)


let signatureFromCompact = secp256k1.Signature.fromCompact(sig);
signatureFromCompact = signatureFromCompact.addRecoveryBit(recoverybit)
console.log('signatureFromCompact:', signatureFromCompact)


pubkey = signatureFromCompact.recoverPublicKey(messageHash).toHex()
console.log('pubkey:', pubkey)