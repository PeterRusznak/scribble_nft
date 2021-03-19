import React, { useRef } from 'react';
import CanvasDraw from "react-canvas-draw";
import metadata from './metadata.js'

//Declare IPFS
//const ipfsClient = require('ipfs-http-client')
//const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

const ipfsAPI = require('ipfs-api')
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

const INFURA_HTTPS = "https://ipfs.infura.io/ipfs/";
const WIDTH = 600;
const HEIGHT = 400;

const CanvasComponent = ({ deployedContract, account }) => {
    const canvasRef = useRef();
    const download = () => {
        let canvas = canvasRef.current.canvasContainer.children[1];
        let dataUrl = canvas.toDataURL("image/png");
        console.log(typeof dataUrl)
        const buffer = Buffer(dataUrl.split(",")[1], 'base64');
        ipfs.files.add(buffer, (error, result) => {
            if (result) {
                metadata.image = INFURA_HTTPS + result[0].hash;
                console.log("image uploaded to IPFS image URI:" + metadata.image)
                console.log(metadata)
                let buf = Buffer.from(JSON.stringify(metadata));
                ipfs.files.add(buf, (error, secondResult) => {
                    if (secondResult) {
                        const tokenURI = INFURA_HTTPS + secondResult[0].hash;
                        console.log("Metadata uploaded to IPFS image as JSON URI:" + tokenURI)
                        deployedContract.methods.createCollectible(tokenURI).send({ from: account }).on('transactionHash', (hash) => {
                            console.log("success, transction hash: ", hash);
                        })
                    }
                    if (error) {
                        console.log(error)
                    }
                })
            }
            if (error) {
                console.log(error)
            }
        })
    }

    return (
        <div>
            <CanvasDraw
                canvasWidth={WIDTH}
                canvasHeight={HEIGHT}
                ref={canvasRef}
            />
            <button
                onClick={download}
                className="button">
                Download
            </button>
        </div>
    )
}

export default CanvasComponent


