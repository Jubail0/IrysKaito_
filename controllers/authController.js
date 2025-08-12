import axios from "axios";
import crypto from "crypto";
import { twitterConfig } from "../config/twitterConfig.js";
import { generateCodeChallenge, generateCodeVerifier } from "../utils/twitterUtils.js";
import dotenv from "dotenv";
dotenv.config();

 export const redirectToTwitter = (req, res) => {
  const state = crypto.randomUUID();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Save PKCE verifier & state in session
  req.session.codeVerifier = codeVerifier;
  req.session.state = state;

  const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${twitterConfig.clientId}&redirect_uri=${encodeURIComponent(
    twitterConfig.callbackUrl
  )}&scope=tweet.read%20users.read%20offline.access&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  
req.session.save((err) => {
  if (err) {
    console.error("Session save error:", err);
    return res.status(500).send("Internal Server Error");
  }
   res.redirect(authUrl);
});
};

 export const handleTwitterCallback = async (req, res) => {
  const { code, state } = req.query;
  const storedState = req.session.state;
  const codeVerifier = req.session.codeVerifier;

  if (!codeVerifier) {
    return res.status(400).send("Missing PKCE code verifier in session");
  }
  if (state !== storedState) {
    return res.status(400).send("State mismatch");
  }

  try {
    // Build token request body
    const body = new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: twitterConfig.callbackUrl,
      code_verifier: codeVerifier,
    });

    // If public app → send client_id in body
    if (!twitterConfig.clientSecret) {
      body.append("client_id", twitterConfig.clientId);
    }

    // Build headers
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };

    // If confidential app → add Basic Auth
    if (twitterConfig.clientSecret) {
      const basicAuth = Buffer.from(
        `${twitterConfig.clientId}:${twitterConfig.clientSecret}`
      ).toString("base64");
      headers["Authorization"] = `Basic ${basicAuth}`;
    }

    // Exchange code for token
    const tokenRes = await axios.post(
      "https://api.twitter.com/2/oauth2/token",
      body,
      { headers }
    );

    const { access_token } = tokenRes.data;

    // Fetch user profile
    const userRes = await axios.get("https://api.twitter.com/2/users/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // Store username in session
    req.session.username = userRes.data.data.username;
     req.session.save((err) => {
  if (err) {
    console.error("Session save error:", err);
    return res.status(500).send("Internal Server Error");
  }});

    // Redirect to frontend
    res.redirect(process.env.FRONT_END_URL);
  } catch (err) {
    console.error("Twitter Auth Error:", err.response?.data || err.message);
    res.status(500).send("Auth failed");
  }
};


export const saveWalletAddress = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) return res.status(400).send({ error: "No wallet address" });

    // Save wallet address to session
    req.session.wallet = walletAddress;

    // Save session before responding
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).send({ error: "Failed to save session" });
      }
      res.status(200).send({ message: "Wallet Connected" });
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Issue" });
  }
};

export const disconnectWallet = (req, res) => {
  // If you only want to remove wallet but keep user logged in:
  delete req.session.wallet;


  req.session.save(err => {
    if (err) {
      console.error("Session save error:", err);
      return res.status(500).send("Failed to disconnect wallet");
    }
    res.status(200).send("Wallet disconnected");
  });
};

export default {
  handleTwitterCallback,
  redirectToTwitter,
  saveWalletAddress,
  disconnectWallet
  
};
