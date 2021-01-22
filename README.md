# sideline-log-to-firebase

Firebase Function to log user activity in [sideline binder demo](https://github.com/LuisKolb/subplots-binder-demo) to Firestore for later analysis.  
Deploy functions with `firebase deploy --only functions`.  

Also provides an npm script to downlaod data from firestore to `/user_data`. Call it like `npm run download <userID from firestore>`. User data will then be found under `./user_data/<userID from firestore>/actions.txt` and `./user_data/<userID from firestore>/nb.ipynb`.  
