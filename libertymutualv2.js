// ==UserScript==
// @name         LibertyMutualV2
// @namespace    https://github.com/spartanoah/LibertyMutualV2/
// @license      GPL-3.0
// @version      2.0
// @author       spartanoah
// @description  Fed up of a popular script injecting ads into your game? Need a simple script to modify or use? FOSS ESP, Tracers and Aimbot. Hold right mouse button to aimlock.
// @match        https://yolk.life/*
// @grant        none
// @run-at       document-start
// @icon         https://github.com/spartanoah/LibertyMutualV2/blob/main/scripticon.jpg?raw=true
// @require      https://raw.githubusercontent.com/spartanoah/LibertyMutualV2/main/crypto-js.min.js
// @downloadURL https://raw.githubusercontent.com/spartanoah/LibertyMutualV2/main/libertymutualv2.js
// @updateURL 
// ==/UserScript==

//Usage: Hold right mouse button to aimlock
//This script is more of a template than a functioning tool. If you're modifying this, you can add a GUI to start!

(function () {
    //Config: if you want to turn off esp, you can.

    const enableESP=true; //turn to false for off
    const enableTracers=true; //turn to false for off

    //Credit for script injection code: AI. ChatGPT prompt: "tampermonkey script. how can i make it grab a javascript file as it's loaded. if it detects the javascript file, make it apply modifications to it via regex? using XMLHttpRequest"
    //Credit for idea to use XMLHttpRequest: A3+++
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRGetResponse = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response');
    let shellshockjs
    XMLHttpRequest.prototype.open = function(...args) {
        const url = args[1];
        if (url && url.includes("js/shellshock.js")) {
            shellshockjs = this;
        };
        originalXHROpen.apply(this, args);
    };
    Object.defineProperty(XMLHttpRequest.prototype, 'response', {
        get: function() {
            if (this===shellshockjs) {
                return applyLibertyMutual(originalXHRGetResponse.get.call(this));
            };
            return originalXHRGetResponse.get.call(this);
        }
    });
    //VAR STUFF
    let F=[];
    let H={};
    let functionNames=[];
    let ESPArray=[];
    let RMB=false;

    //Credit: AI. ChatGPT prompt: "make javascript tampermonkey code that sets a variable RMB to true while right mouse button is being held"
    document.addEventListener('keydown', function(event) {
        if (event.key === 'c') {
            RMB = true;
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'c') {
            RMB = false;
        }
    });

    //scrambled... geddit????
    const getScrambled=function(){return Array.from({length: 10}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')}
    const createAnonFunction=function(name,func){
        const funcName=getScrambled();
        window[funcName]=func;
        F[name]=window[funcName];
        functionNames[name]=funcName
    };
    const findKeyWithProperty = function(obj, propertyToFind) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key === propertyToFind) {
                    return [key];
                } else if (
                    typeof obj[key] === 'object' &&
                    obj[key] !== null &&
                    obj[key].hasOwnProperty(propertyToFind)
                ) {
                    return key;
                };
            };
        };
        // Property not found
        return null;
    };
    const fetchTextContent = function(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false); // Make the request synchronous
        xhr.send();
        if (xhr.status === 200) {
            return xhr.responseText;
        } else {
            console.error("Error fetching text content. Status:", xhr.status);
            return null;
        };
    };

    const applyLibertyMutual = function(js) {

        let hash = CryptoJS.SHA256(js).toString(CryptoJS.enc.Hex);
        let clientKeys;
        onlineClientKeys = fetchTextContent("https://raw.githubusercontent.com/StateFarmNetwork/client-keys/main/libertymutual_"+hash+".json"); //credit: me :D

        if (onlineClientKeys == "value_undefined" || onlineClientKeys == null) {
            let userInput = prompt('Valid keys could not be retrieved online. Enter keys if you have them. Join the StateFarm Network Discord server to generate keys! https://discord.gg/HYJG3jXVJF', '');
            if (userInput !== null && userInput !== '') {
                alert('Aight, let\'s try this. If it is invalid, it will just crash.');
                clientKeys = JSON.parse(userInput);
            } else {
                alert('You did not enter anything, this is gonna crash lmao.');
            };
        } else {
            clientKeys = JSON.parse(onlineClientKeys);
        };

        H = clientKeys.vars;

        let injectionString="";
        
        const modifyJS = function(find,replace) {
            let oldJS = js;
            js = js.replace(find,replace);
            if (oldJS !== js) {
                console.log("%cReplacement successful! Injected code: "+replace, 'color: green; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
            } else {
                console.log("%cReplacement failed! Attempted to replace "+find+" with: "+replace, 'color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
            };
        };

        console.log('%cATTEMPTING TO START LIBERTYMUTUAL', 'color: magenta; font-weight: bold; font-size: 1.5em; text-decoration: underline;');
        for (let name in H) {
            deobf = H[name];
            injectionString=`${injectionString}${name}: (() => { try { return ${deobf}; } catch (error) { return "value_undefined"; } })(),`;
        };
        console.log(injectionString);
        console.log('%cLIBERTYMUTUAL INJECTION: INJECT VAR RETRIEVAL FUNCTION AND MAIN LOOP', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
        modifyJS(H.SCENE+'.render',`window["${functionNames.retrieveFunctions}"]({${injectionString}},true)||${H.SCENE}.render`);
        console.log('%cSuccess! Variable retrieval and main loop hooked.', 'color: green; font-weight: bold;');
        modifyJS(`{if(${H.CULL})`,`{if(true)`);
        console.log('%cSuccess! Cull inhibition hooked.', 'color: green; font-weight: bold;');
        modifyJS("Not playing in iframe", "LIBERTYMUTUAL ACTIVE!");
        // console.log(js);
        console.log(H);
        return js;
    };

    createAnonFunction("retrieveFunctions",function(vars) { ss=vars ; F.LIBERTYMUTUAL() });

    createAnonFunction("LIBERTYMUTUAL",function() {
        globalSS = ss;

        ss.BABYLONJS.Vector3 = ss.MYPLAYER.constructor.v1.constructor;
        H.actor = findKeyWithProperty(ss.MYPLAYER,H.mesh);

        let TARGETED;
        let CROSSHAIRS=new ss.BABYLONJS.Vector3();
        CROSSHAIRS.copyFrom(ss.MYPLAYER[H.actor][H.mesh].position);
        const horizontalOffset = Math.sin(ss.MYPLAYER[H.actor][H.mesh].rotation.y);
        const verticalOffset = Math.sin(-ss.MYPLAYER[H.pitch]);
        CROSSHAIRS.x+=horizontalOffset;
        CROSSHAIRS.y+=verticalOffset+0.4;
        CROSSHAIRS.z+=Math.cos(ss.MYPLAYER[H.actor][H.mesh].rotation.y);

        const timecode=Date.now();
        let minValue=99999;
        ss.PLAYERS.forEach(PLAYER=>{
            if (PLAYER) {
                PLAYER.timecode=timecode;
                //Partial credit for enemy player filtering: PacyTense. Also just common sense.
                if ((PLAYER!==ss.MYPLAYER) && ((ss.MYPLAYER.team==0)||(PLAYER.team!==ss.MYPLAYER.team))) {
                    //ESP CODE
                    if ((!PLAYER.generatedESP)) {
                        //Credit for box from lines code: AI. ChatGPT prompt: "how can i create a box out of lines in babylon.js?"
                        //ESP BOXES
                        const boxSize = {width: 0.4, height: 0.65, depth: 0.4};
                        const vertices = [
                            new ss.BABYLONJS.Vector3(-boxSize.width / 2, 0, -boxSize.depth / 2),
                            new ss.BABYLONJS.Vector3(boxSize.width / 2, 0, -boxSize.depth / 2),
                            new ss.BABYLONJS.Vector3(boxSize.width / 2, 0 + boxSize.height, -boxSize.depth / 2),
                            new ss.BABYLONJS.Vector3(-boxSize.width / 2, 0 + boxSize.height, -boxSize.depth / 2),
                            new ss.BABYLONJS.Vector3(-boxSize.width / 2, 0, boxSize.depth / 2),
                            new ss.BABYLONJS.Vector3(boxSize.width / 2, 0, boxSize.depth / 2),
                            new ss.BABYLONJS.Vector3(boxSize.width / 2, 0 + boxSize.height, boxSize.depth / 2),
                            new ss.BABYLONJS.Vector3(-boxSize.width / 2, 0 + boxSize.height, boxSize.depth / 2),
                        ];
                        const lines = [];
                        for (let i = 0; i < 4; i++) {
                            lines.push([vertices[i], vertices[(i + 1) % 4]]);
                            lines.push([vertices[i + 4], vertices[(i + 1) % 4 + 4]]);
                            lines.push([vertices[i], vertices[i + 4]]);
                        };
                        const box = ss.BABYLONJS[H.MeshBuilder].CreateLineSystem(getScrambled(), { lines }, PLAYER[H.actor].scene);
                        //ChatGPT prompt: "how can i make an object anchored to another object, change its color, and have it render on top of everything else? babylon.js"
                        box.color = new ss.BABYLONJS.Color3(1, 1, 1);
                        box.renderingGroupId = 1;
                        box.parent=PLAYER[H.actor][H.mesh];
                        //TRACER LINES
                        const tracers=ss.BABYLONJS[H.MeshBuilder][H.CreateLines]('lines', { points: [PLAYER[H.actor][H.mesh].position, CROSSHAIRS] }, PLAYER[H.actor].scene);
                        tracers.color=new ss.BABYLONJS.Color3(1, 1, 1);
                        tracers.alwaysSelectAsActiveMesh = true;
                        tracers.renderingGroupId=1;
                        
                        PLAYER.box=box;
                        PLAYER.tracers=tracers;
                        PLAYER.generatedESP=true;
                        ESPArray.push([box,tracers,PLAYER]);
                    };
                    //update the lines
                    PLAYER.tracers.setVerticesData(ss.BABYLONJS.VertexBuffer.PositionKind, [CROSSHAIRS.x, CROSSHAIRS.y, CROSSHAIRS.z, PLAYER[H.actor][H.mesh].position.x, PLAYER[H.actor][H.mesh].position.y, PLAYER[H.actor][H.mesh].position.z]);
                    console.log(CROSSHAIRS)
                    PLAYER.box.visibility=enableESP;
                    PLAYER.tracers.visibility=(PLAYER[H.playing]&&enableTracers);

                    //AIMBOT CODE
                    //Credit: This section is mostly common sense, and could be made by most decent programmers. It is still worth mentioning PacyTense used a functionally equivalent thing similar to this this before me 4 years ago.
                    const distance=Math.hypot(PLAYER[H.x]-ss.MYPLAYER[H.x], PLAYER[H.y]-ss.MYPLAYER[H.y], PLAYER[H.z]-ss.MYPLAYER[H.z]);

                    if (RMB) {console.log(PLAYER.name, PLAYER.team, Date.now())}

                    if (distance<minValue) {
                        TARGETED=PLAYER;
                        minValue=distance;
                    };
                };
            };
            if (RMB && TARGETED && TARGETED[H.playing]) {
                //3D maths
                const directionVector={
                    [H.x]: TARGETED[H.x]-ss.MYPLAYER[H.x],
                    [H.y]: TARGETED[H.y]-ss.MYPLAYER[H.y]-0.05,
                    [H.z]: TARGETED[H.z]-ss.MYPLAYER[H.z],
                };
                ss.MYPLAYER[H.yaw]=F.calculateYaw(directionVector);
                ss.MYPLAYER[H.pitch]=F.calculatePitch(directionVector);
            };
        });
        for ( let i=0;i<ESPArray.length;i++) {
            if (ESPArray[i][2] && ESPArray[i][2].timecode==timecode) { //still exists
            } else {
                //Credit for info: AI. ChatGPT prompt: "how can i delete an object in babylon.js?"
                ESPArray[i][0].dispose();
                ESPArray[i][1].dispose();
                ESPArray.splice(i,1);
            };
        };
    });
    createAnonFunction("setPrecision",function (value) { return Math.floor(value * 8192) / 8192 }); //required precision
    createAnonFunction("calculateYaw",function (pos) {
        return F.setPrecision(Math.mod(Math.atan2(pos[H.x],pos[H.z]), Math.PI2));
    });
    createAnonFunction("calculatePitch",function (pos) {
        return F.setPrecision(-Math.atan2(pos[H.y],Math.hypot(pos[H.x],pos[H.z]))%1.5);
    });
})();
