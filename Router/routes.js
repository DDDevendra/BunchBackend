import { Router } from "express";
import * as controller from '../controller/controller.js'
const router =  Router();


import multer from "multer";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Set the folder where files will be saved
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const upload = multer({ storage });


router.route('/test').get(controller.test);
router.route('/addbunch').post(controller.addbunch);

router.route('/Signup').post(upload.single("profileImg"),controller.register);
router.route('/login').post(controller.login);

router.route('/follow').patch(controller.follow);
router.route('/unfollow').patch(controller.unfollow);
router.route('/like').patch(controller.like);
router.route('/unlike').patch(controller.unlike);


router.route('/sendUserName').get(controller.sendUserName);
router.route('/newbunch').post(upload.single("bunchImage"),controller.Newbunch);
router.route('/getdata').get(controller.givebunch);
router.route('/getUserdata').get(controller.givedata);

router.route('/getOtherdata').post(controller.giveOtherdata);
router.route('/getlikes').post(controller.getlikes);

router.route('/giveflwg').get(controller.givefollowings);
router.route('/giveflwer').get(controller.givefollowers);


router.route('/sendMessage').post(controller.sendmessage);
export default  router;
