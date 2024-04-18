const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "026547ff4a914686ebb7bd73963215e3cbc6391f3bafe31b074be093fb112e3232": 100,
  "0304dd16af4424040a15783922254ce42b8168977bba91f6dc88ded3d26187dbb0": 50,
  "03599fe990513e7e28ccfda9f7e1627e9c3a60e107b277d4cba24ef46b1ebf8c87": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from the client-side application
  // recover the public address from the signature
  const { data, messageHash, sig, recoveryBit } = req.body;

  const sender = data.sender
  console.log(sender)
  const amount = data.amount
  const recipient = data.recipient
  setInitialBalance(sender);
  setInitialBalance(recipient);

  const isValid = isValidTransaction(messageHash,sig, recoveryBit, sender)
  if(!isValid) {
    res.status(400).send({message: "Not a valid Sender"})
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function isValidTransaction(messageHash, sig, recoveryBit, sender){
  let signatureFromCompact = secp.secp256k1.Signature.fromCompact(sig);
  signatureFromCompact = signatureFromCompact.addRecoveryBit(recoveryBit) 
  // console.log(signatureFromCompact)

  pubkey = signatureFromCompact.recoverPublicKey(messageHash).toHex()

  // console.log("hello")
  const isSigned = secp.secp256k1.verify(sig, messageHash, pubkey)

  const isValidSender = (sender === pubkey) ? true:false

  if(isValidSender && isSigned) return true

  return false
}