const fs = require("fs");
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

var download_and_save = function () {
    if (!fs.existsSync("./user_data/")) {
        fs.mkdirSync("./user_data/");
    }

    var userID = process.argv[2];
    console.log("Downloading data from user " + userID + "...");
    const userRef = db.collection("logs").doc(userID);

    userRef.get().then(async function (doc) {
        var path = "./user_data/" + userID;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        const nbRef = userRef.collection("notebooks");
        nbRef.get().then(async function (querySnapshot) {
            querySnapshot.forEach((nbDoc) => {
                nbPath = path + "/" + nbDoc.id.split(".")[0];
                if (!fs.existsSync(nbPath)) {
                    fs.mkdirSync(nbPath);
                }
                fs.writeFileSync(nbPath + "/nb.ipynb", JSON.stringify(nbDoc.data().nbJSON));
                nbRef
                    .doc(nbDoc.id)
                    .collection("actions")
                    .orderBy("time", "asc")
                    .get()
                    .then(async (snapshot) => {
                        if (fs.existsSync(nbPath + "/actions.txt")) {
                            fs.unlinkSync(nbPath + "/actions.txt");
                        }
                        await snapshot.forEach((doc) => {
                            var actionStr = doc.data().time.toDate().toString() + "," + doc.data().action + "\n";
                            fs.writeFileSync(nbPath + "/actions.txt", actionStr, { flag: "a" });
                        });
                        console.log(nbDoc.id + " ✔");
                    });
            });
        });
    });
};

download_and_save();
