const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp({
    apiKey: "AIzaSyBUv2C-h8oWiYbUX1F-RvY-gqiHjdq5HWU",
    authDomain: "sideline-302116.firebaseapp.com",
    projectId: "sideline-302116",
    storageBucket: "sideline-302116.appspot.com",
    messagingSenderId: "1070539112262",
    appId: "1:1070539112262:web:cd5fdc2b4307c56e9d6f47",
});
const db = admin.firestore();

exports.addLogLine = functions.https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    const userRef = db.collection("logs").doc(req.body.split(",")[0]);
    userRef.get().then(async function (doc) {
        if (!doc.exists) {
            await userRef.set({ createdAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true }); // ensure user exists
        }
        const nbRef = userRef.collection("notebooks").doc(req.body.split(",")[1]);
        nbRef.get().then(async function (nbDoc) {
            if (!nbDoc.exists) {
                await nbRef.set({ createdAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
            }
            await nbRef.collection("actions").add({
                time: admin.firestore.FieldValue.serverTimestamp(),
                action: req.body.split(",")[2],
            });
            res.end();
        });
    });
});

exports.addNotebookJSON = functions.https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    const userRef = db.collection("logs").doc(req.body.split(",")[0]);
    userRef.get().then(async function (doc) {
        if (!doc.exists) {
            await userRef.set({ createdAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true }); // ensure user exists
        }
        const nbRef = userRef.collection("notebooks").doc(req.body.split(",")[1]);
        nbRef.get().then(async function (nbDoc) {
            if (!nbDoc.exists) {
                await nbRef.set({ createdAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
            }
            await nbRef.set({ nbJSON: JSON.parse(req.body.substring(req.body.indexOf(".ipynb") + 7)) }, { merge: true });
            res.end();
        });
    });
});
