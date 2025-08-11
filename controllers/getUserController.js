// Step 3 - Provide username to frontend
const fetchSession = async(req,res,) => {
if (req.session.username || req.session.wallet) {

    res.json({ username: req.session.username, walletAddress:req.session.wallet });
  } else {
    res.status(401).json({ error: "Not Login" });
  }

}


export default fetchSession;

