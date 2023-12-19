import config from "../../config/mainConfig.js";
import Users from "../../models/user/users.js";
import Enroll from "../../models/enrollment/enrollments.js";
const moduleExport = {
  /* *
   * @api {post} /api/user/enroll/
   * @apiDescription enroll method
   * */
  async enrollForm(req, res) {
    // res.status(200).json({ message: "Enroll"}); return;

    try {
      const { id, payNow, batch, enrollDate } = req.body;

      const Months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const d = new Date(enrollDate);
      let monthName = Months[d.getMonth()];

      //   console.log(id);

      let user = await Users.findById(id);
      if (!user)
        return res.status(404).json({ message: "User doesn`t exists" });
      // have to check users age is between 18-65 or not, if yes then allow to enroll
      if (user.Age < 18 || user.Age > 65)
        return res.status(400).json({ message: "Age not applicable" });
      // return res.status(200).json({ message: user.Age });

      let checkEnrollment = await Enroll.findOne({
        author: id,
        month: monthName,
      });

      if (checkEnrollment)
        return res
          .status(400)
          .json({ message: `Already Enrolled for month ${monthName}` });

      let paymentID = null,
        paymentStatus = 0,
        paymentDate = null;
      if (payNow) {
        /* if wants to pay now, do payment then proceed based on payment status
                    get payment ID, if failed return with error
                */

        /*
                    This function has been implemented just to assume that the functionality of payment has been implemented
                */
        paymentStatus = 1;
        paymentID = "123SBSB";
        paymentDate = new Date();

        // return res.status(200).json({ message: "Paid Successfully" });
      }

      /*
        Incase the user does not pays now then enrollment will be saved with paymentID = null,
        paymentStatus = 0 and paymentDate = null
      */
      const result = await Enroll.create({
        author: id,
        payNow: payNow,
        paymentStatus: paymentStatus,
        paymentID: paymentID,
        paymentDate: paymentDate,
        enrollDate: enrollDate,
        month: monthName,
        batch: batch,
      });

      return res
        .status(201)
        .json({ message: "Enrolled Successfully", res: result });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong", Error: err });
    }
  },

  /* *
   * @api {post} /api/user/enroll/payLater
   * @apiDescription pay later for enrolled month
   * */
  async payLater(req, res) {
    // return res.status(200).json({ message: "Enroll pay later" });

    try {
      const { enrollID } = req.body;

      // console.log(enrollID);

      let checkEnroll = await Enroll.findById(enrollID);
      if (!checkEnroll)
        return res.status(400).json({ message: "Invalid Enroll ID" });

      // console.log(checkEnroll);

      // No need of this as this is the functionality for paying later
      // if (payNow) {
      //   /* if wants to pay now, do payment then proceed based on payment status
      //               get payment ID, if failed return with error
      //           */
      //   // return res.status(200).json({ message: "Paid Successfully" });
      // }

      // Assumed payment details
      let paymentID, paymentStatus;
      paymentStatus = 1;
      paymentID = "123SBSB";

      checkEnroll.paymentStatus = paymentStatus;
      checkEnroll.paymentID = paymentID;
      checkEnroll.paymentDate = new Date();

      // console.log(checkEnroll);

      checkEnroll = await checkEnroll.save();

      // console.log(checkEnroll);

      return res
        .status(200)
        .json({ message: "Paid Successfully", res: checkEnroll });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong", Error: err });
    }
  },
  /* *
   * @api {post} /api/user/enroll/getAll
   * @apiDescription api to get all enrollments of user
   * */
  async getAllEnrollments(req, res) {
    try {
      const { id } = req.body;

      let enrollments = await Enroll.find({ author: id });
      let user = await Users.findById(id);
      if (!user)
        return res.status(404).json({ message: "User doesn`t exists" });

      return res.status(200).json({ message: "success", res: enrollments });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong", Error: err });
    }
  },
};

export default moduleExport;
