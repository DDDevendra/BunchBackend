import bunch from "../model/bunch.model.js";
import user from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import message from '../model/message.model.js'

export async function test(req, res) {
  try {
    return res.status(201).send({ msg: "Test successfull" });
  } catch (e) {
    return res.status(500).send({ error: "faild to run api " + e });
  }
}

export async function addbunch(req, res) {
  try {
    const { email, title, disc } = req.body;

    const a = await user.findOne({ email: email });

    const newbunch = new bunch({ title: req.body.title, disc: req.body.disc });

    await newbunch
      .save()
      .then(async () => {
        a.bunch.push(newbunch);
        await a
          .save()
          .then(() => {
            return res.status(200).send({ msg: "Bunch Saved successfuly" });
          })
          .catch((e) => {
            return res.status(500).send({ error: "faild to save " + e });
          });
      })
      .catch((e) => {
        return res.status(500).send({ error: "faild to save " + e });
      });
  } catch (e) {
    return res.status(500).send({ error: "Faild to add buncg " + e });
  }
}

export async function register(req, res) {
  try {
    const { UserName, Email, Password, bio } = req.body;
    const profileImg = req.file ? req.file.path : "";

    const a = await user.findOne({ email: Email });
    const b = await user.findOne({ UserName: UserName });

    if (b) {
      return res.status(500).send({ error: "UserName in Use " });
    }

    if (a) {
      return res.status(500).send({ error: "Email in Use " });
    }

    const newUser = new user({
      UserName: UserName,
      email: Email,
      password: Password,
      bio: bio,
      profileImg: profileImg,
    });

    await newUser
      .save()
      .then(() => {
        return res.status(201).send({ msg: "SignUp Successfully " });
      })
      .catch((e) => {
        return res.status(500).send({ error: "Faild to Signup " });
      });
  } catch (e) {
    return res.status(500).send({ error: "Faild to Signup " });
  }
}

export async function login(req, res) {
  try {
    const { UserName, password } = req.body;

    const data = await user.findOne({ UserName: UserName });

    if (!data) {
      return res.status(400).send({ error: "user Not Found !" });
    }

    bcrypt.compare(password, data.password, (err, isMatch) => {
      if (err) {
        return res.status(501).send({ error: "unable to match password " });
      }

      if (isMatch) {
        const token = jwt.sign({ email: data.email }, "secret123");

        return res.status(201).send({ user: token });
      } else {
        return res.status(400).send({ error: "Password Don't Match " });
      }
    });
  } catch (error) {
    return res.status(501).send({ error: "Failed To Login" + error });
  }
}

export async function follow(req, res) {
  try {
    const { Uemail } = req.body;

    const token = req.headers["x-access-token"];
    const decode = await jwt.verify(token, "secret123");
    const Iemail = decode.email;

    const a = await user.findOne({ email: Iemail });
    const b = await user.findOne({ UserName: Uemail });

    if (!a || !b) {
      return res.status(500).send({ error: "User Not Found " });
    }

    const doi = a.followings.includes(b._id);

    if (doi) {
      return res
        .status(400)
        .send({ error: "You are already following this user" });
    }

    a.followings.push(b);
    b.followers.push(a);

    await a
      .save()
      .then(async () => {
        await b
          .save()
          .then(() => {
            return res.status(201).send({ error: "Followed Successfully" });
          })
          .catch((e) => {
            return res.status(500).send({ error: "Failed to update " + e });
          });
      })
      .catch((e) => {
        return res.status(500).send({ error: "Failed to update " + e });
      });
  } catch (e) {
    return res.status(500).send({ error: "Failed to update " + e });
  }
}

export async function unfollow(req, res) {
  try {
    const { Uemail } = req.body;

    const token = req.headers["x-access-token"];
    const decode = await jwt.verify(token, "secret123");
    const Iemail = decode.email;

    const a = await user.findOne({ email: Iemail });
    const b = await user.findOne({  UserName: Uemail });

    if (!a || !b) {
      return res.status(500).send({ error: "User Not Found " });
    }

    await a.followings.pull(b);
    await b.followers.pull(a);

    await a
      .save()
      .then(async () => {
        await b
          .save()
          .then(() => {
            return res.status(201).send({ error: "Unfollowed Successfully" });
          })
          .catch((e) => {
            return res.status(500).send({ error: "Failed to update " + e });
          });
      })
      .catch((e) => {
        return res.status(500).send({ error: "Failed to update " + e });
      });
  } catch (e) {
    return res.status(500).send({ error: "Failed to update " + e });
  }
}

export async function like(req, res) {
  try {
    const { bid } = req.body;

    const token = req.headers["x-access-token"];
    const decode = await jwt.verify(token, "secret123");
    const email = decode.email;

    const a = await user.findOne({email});
    const b = await bunch.findById(bid);

    const doi = b.like.includes(a._id);

    if (doi) {
      return res.status(201).send({ error: "Aldredy liked " });
    }

    b.like.push(a);
    b.save()
      .then(() => {
        return res.status(201).send({ msg: "liked bunch " });
      })
      .catch((e) => {
        return res.status(500).send({ error: "faild to Like " });
      });
  } catch (error) {
    return res.status(500).send({ error: "failed to like " + error });
  }
}

export async function unlike(req, res) {
  try {
    const { email, bid } = req.body;
    const a = await user.findOne({ email: email });
    const b = await bunch.findById(bid);

    const doi = b.like.includes(a._id);

    if (!doi) {
      return res.status(500).send({ error: "Aldredy unliked " });
    }

    b.like.pull(a);

    b.save()
      .then(() => {
        return res.status(201).send({ msg: "Unliked bunch " });
      })
      .catch((e) => {
        return res.status(500).send({ error: "faild to UnLike " });
      });
  } catch (error) {
    return res.status(500).send({ error: "Faild to Unlike " + error });
  }
}

export async function sendUserName(req, res) {
  try {
    const token = req.headers["x-access-token"];
    const decode = await jwt.verify(token, "secret123");
    const email = decode.email;

    const a = await user.findOne({ email: email });

    if (a) {
      return res.status(201).send({ UserName: a.UserName });
    }

    return res.status(201).send({ error: "Faild to Get Data" });
  } catch (error) {
    return res.status(500).send({ error: "Faild at APi " + error });
  }
}

export async function Newbunch(req, res) {
  try {
    const { bunchName, bunchSubheader, bunchDescription } = req.body;
    const bunchImage = req.file ? req.file.path : "";

    const token = req.headers["x-access-token"];
    const decode = jwt.verify(token, "secret123");
    const email = decode.email;

    const a = await user.findOne({ email: email });

    const newBunch = new bunch({
      bunchName,
      bunchSubheader,
      bunchDescription,
      bunchImage,
      MyUser: a,
    });

    await newBunch.save();
    a.bunch.push(newBunch._id);

    a.save()
      .then(() => {
        return res.status(201).json({ message: "Bunch created successfully" });
      })
      .catch((e) => {
        return res.status(500).send({ error: "Failed to save" });
      });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function givebunch(req, res) {
  try {
    const bunches = await bunch.find();

    const profileImgLinks = await Promise.all(bunches.map(async (bunch) => {
      if (bunch.MyUser) {
        const a = await user.findById(bunch.MyUser);
        if (a) {
          const b = a.profileImg;
          return b;
        }
      }
      return null;
    }));

    const names = await Promise.all(bunches.map(async (bunch)=>{
      if (bunch.MyUser) {
        const a = await user.findById(bunch.MyUser);
        if (a) {
          const b = a.UserName
          return b;
        }
      }
      return null;
    }))


    return res.status(201).send({ data: bunches, links: profileImgLinks  , names:names});
  } catch (e) {
    return res.status(501).send({ error: "Failed to load data" });
  }
}

export async function giveOtherdata(req, res) {
  try {
    const token = req.headers["x-access-token"];
    const decode = await jwt.verify(token, "secret123");

    const i = await user.findOne({ email: decode.email });

    const UserName = req.body.UserName;
    const a = await user.findOne({ UserName: UserName });

    const is = await a.followers.includes(i._id);

    const bunchPromises = a.bunch.map(async (obj) => {
      const t = await bunch.findById(obj);
      return t;
    });

    const bunchData = await Promise.all(bunchPromises);

    return res.status(201).send({
      UserName: a.UserName,
      follow: a.followers.length,
      followg: a.followings.length,
      bunch: bunchData,
      bio: a.bio,
      is: is,
      img:a.profileImg
    });
  } catch (error) {
    return res.status(500).send("Failed to get data " + error);
  }
}

export async function givedata(req, res) {
  try {
    const token = req.headers["x-access-token"];
    const decode = await jwt.verify(token, "secret123");

    const a = await user.findOne({ email: decode.email });

    const bunchPromises = a.bunch.map(async (obj) => {
      const t = await bunch.findById(obj);
      return t;
    });


    const bunchData = await Promise.all(bunchPromises);

    return res.status(201).send({
      UserName: a.UserName,
      follow: a.followers.length,
      followg: a.followings.length,
      bunch: bunchData,
      bio: a.bio,
      profileImg:a.profileImg
      
    });
  } catch (error) {
    return res.status(500).send("Failed to get data " + error);
  }
}

export async function getlikes(req,res){
  try{ 

    const {id} = req.body;
    const b = await bunch.findOne({_id:id});

    if(!b)
    {
      return res.status(500).send({error:"Bunch not found "});
    }

    const count = b.like.length;

    return res.status(201).send({count:count});

  }catch(error){
    return res.status(500).send({error:"Failed to load likes "+error});
  }
}

export async function givefollowings(req,res){

  try{
    const token = req.headers["x-access-token"];
    const decode = await jwt.verify(token, "secret123");
    const a = await user.findOne({ email: decode.email });

   const list = await Promise.all(a.followings.map(async(a)=>{
    const b  = await user.findOne({_id:a})
    return b.UserName;
   }));

   const plist = await Promise.all(a.followings.map(async(a)=>{
    const b  = await user.findOne({_id:a})
    return b.profileImg;
   }))

    return res.status(201).send({list:list,plist:plist});
  }catch(error)
  {
    return res.status(500).send({error:"Failed to load followings "+error}); 
  }
}

export async function sendmessage(req,res){

  try{  

    const token = req.headers["x-access-token"];
    const decode = await jwt.verify(token, "secret123");
    const i = await user.findOne({ email: decode.email });

    const { to , text } = req.body;
    
    const u = await user.findOne({'UserName':to});
    
    const nm = new message({from:i._id , to:u._id , text:text});
    await nm.save();

    i.isend.push(nm);
    u.igot.push(nm);

    i.save();
    u.save();

    return res.status(201).send({msg:"Message Send Successfuly"});

  }catch(error){
     return res.status(501).send({error:"Failed to Send Message "+error});
  }
}


export async function givefollowers(req,res){

  try{
    const token = req.headers["x-access-token"];
    const decode = await jwt.verify(token, "secret123");
    const a = await user.findOne({ email: decode.email });

   const list = await Promise.all(a.followers.map(async(a)=>{
    const b  = await user.findOne({_id:a})
    return b.UserName;
   }));

   const plist = await Promise.all(a.followers.map(async(a)=>{
    const b  = await user.findOne({_id:a})
    return b.profileImg;
   }))

    return res.status(201).send({list:list,plist:plist});
  }catch(error)
  {
    return res.status(500).send({error:"Failed to load followings "+error}); 
  }
}