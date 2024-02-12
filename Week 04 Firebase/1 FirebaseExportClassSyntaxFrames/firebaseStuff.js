// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, onValue, update, set, push, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { reactToFirebase } from './mainClass.js';



const firebaseConfig = {
    apiKey: "AIzaSyAvM1vaJ3vcnfycLFeb8RDrTN7O2ToEWzk",
    authDomain: "shared-minds.firebaseapp.com",
    projectId: "shared-minds",
    storageBucket: "shared-minds.appspot.com",
    messagingSenderId: "258871453280",
    appId: "1:258871453280:web:4c103da9b230e982544505",
    measurementId: "G-LN0GNWFZQQ"
};

const app = initializeApp(firebaseConfig);
let appName = "SharedMindsFramesExample";
let folder = "/1/frameInfo/";

let db = getDatabase();

export function setFolder(newFolder) {
    folder = newFolder;
}

export function getStuffFromFirebase() {
    const dbRef = ref(db, appName + folder);
    onValue(dbRef, (snapshot) => {
        reactToFirebase("everyThing", snapshot.val());
        //callback(snapshot.val());
    });
}

export function addNewThingToFirebase(data) {
    //firebase will supply the key,  this will trigger "onChildAdded" below
    const dbRef = ref(db, appName + folder);
    const newKey = push(dbRef, data).key;
    return newKey; //useful for later updating
}

export function updateJSONFieldInFirebase(key, data) {
    console.log(appName + '/' + folder + key)
    const dbRef = ref(db, appName + folder + key);
    update(dbRef, data);
}

export function deleteFromFirebase(key) {
    console.log("deleting", appName + folder + key);
    const dbRef = ref(db, appName + folder + key);
    set(dbRef, null);
}

export function subscribeToData() {
    //get callbacks when there are changes either by you locally or others remotely
    const commentsRef = ref(db, appName + folder);
    onChildAdded(commentsRef, (data) => {
        reactToFirebase("added", data.val(), data.key);
    });
    onChildChanged(commentsRef, (data) => {
        reactToFirebase("changed", data.val(), data.key)
    });
    onChildRemoved(commentsRef, (data) => {
        reactToFirebase("removed", data.val(), data.key)
    });
}

export function setDataInFirebase(data) {
    //if it doesn't exist, it adds (pushes) with you providing the key
    //if it does exist, it overwrites
    const dbRef = ref(db, appName + folder)
    set(dbRef, data);
}