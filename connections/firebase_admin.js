require("dotenv").config();
const firebaseAdmin = require("firebase-admin");

const serviceAccount = {
    type: process.env.FIREBASE_ADMIN_TYPE,
    project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
    private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL_ID,
    client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
    auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
    token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
    auth_provider_x509_cert_url:
        process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL
};

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_ADMIN_DATABASE_URL
});

const db = firebaseAdmin.database();

module.exports = db;
