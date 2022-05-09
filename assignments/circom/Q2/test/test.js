const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16, plonk } = require("snarkjs");

// Converts from a hex string to big integer
function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    // before each test, deploy the contract

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        // it performs groth16.fullProve with input {"a": "1", "b": "2"},
        // wasm file "./contracts/circuits/HelloWorldVerifier.wasm",
        // and zkey file "./contracts/circuits/HelloWorldVerifier.zkey"
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, 
        "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm",
        "contracts/circuits/HelloWorld/circuit_final.zkey");

        // print the first value of the publicSignals, is the result of the circuit
        console.log('1x2 =',publicSignals[0]);

        // gets the signals in big int format
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // gets the proof in big int format
        const editedProof = unstringifyBigInts(proof);
        // gets the calldata string with the signals and the proof
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        
        // gets from the calldata the proof and the public signals in big int format
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
    
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        // performs the verification with the variables above and expects to be true
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        // examples that are gonna fail the verification
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        // expects to be false
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {
    let Verifier;
    let verifier;

    // before each test, deploy the contract
    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("Multiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });


    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        // it performs groth16.fullProve with input {"a": "1", "b": "2"},
        // wasm file "./contracts/circuits/Multiplier3Verifier.wasm",
        // and zkey file "./contracts/circuits/Multiplier3Verifier.zkey"
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2","c":"3"}, 
        "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm",
        "contracts/circuits/Multiplier3/circuit_final.zkey");

        // print the first value of the publicSignals, is the result of the circuit
        console.log('1x2x3 =',publicSignals[0]);

        // gets the signals in big int format
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // gets the proof in big int format
        const editedProof = unstringifyBigInts(proof);
        // gets the calldata string with the signals and the proof
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        
        // gets from the calldata the proof and the public signals in big int format
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
    
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        // performs the verification with the variables above and expects to be true
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        // examples that are gonna fail the verification
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        // expects to be false
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {
    let Verifier;
    let verifier;

    // before each test, deploy the contract
    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("_plonkMultiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });
    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        // it performs groth16.fullProve with input {"a": "1", "b": "2"},
        // wasm file "./contracts/circuits/_plonkMultiplier3Verifier.wasm",
        // and zkey file "./contracts/circuits/_plonkMultiplier3Verifier.zkey"
        const { proof, publicSignals } = await plonk.fullProve({"a":"1","b":"2", "c":"4"}, 
        "contracts/circuits/_plonkMultiplier3/Multiplier3_js/Multiplier3.wasm",
        "contracts/circuits/_plonkMultiplier3/circuit_final.zkey");

        // print the first value of the publicSignals, is the result of the circuit
        console.log('1x2x4 =',publicSignals[0]);

        // gets the signals in big int format
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // gets the proof in big int format
        const editedProof = unstringifyBigInts(proof);
        // gets the calldata string with the signals and the proof
        const calldata = await plonk.exportSolidityCallData(editedProof, editedPublicSignals);
        
        // gets from the calldata the proof and the public signals in big int format
        // as the first input in this case is bytes, we will only transform the content after first element
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map((x, counter) => {
            if(counter>0) 
                return BigInt(x).toString(); 
            else return x
        });
    
        // values to verify
        let proof_to_verify = argv[0];
        let signal = [argv[1]];

        // performs the verification with the variables above and expects to be true
        expect(await verifier.verifyProof(proof_to_verify, signal)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        // examples that are gonna fail the verification
        let proof_to_verify = "0x00";
        let signal = [0]
        // expects to be false
        expect(await verifier.verifyProof(proof_to_verify, signal)).to.be.false;

    });
});