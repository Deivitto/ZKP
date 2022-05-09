const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/
const plonkVerifierRegex = /contract PlonkVerifier/

var content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
var bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier');

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment

// Code for Multiplier Verifier
content = fs.readFileSync("./contracts/Multiplier3Verifier.sol", { encoding: 'utf-8' });
bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex, 'contract Multiplier3Verifier');

fs.writeFileSync("./contracts/Multiplier3Verifier.sol", bumped);


// Code for Plonk version
content = fs.readFileSync("./contracts/_plonkMultiplier3Verifier.sol", { encoding: 'utf-8' });
bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(plonkVerifierRegex, 'contract _plonkMultiplier3Verifier');

fs.writeFileSync("./contracts/_plonkMultiplier3Verifier.sol", bumped);