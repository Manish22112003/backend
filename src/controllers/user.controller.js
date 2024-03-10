import { User } from "../models/User.js";

// Function to generate a random 4-letter string
export const generateRandomLetters = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
};

// Function to check if the generated certificate number is unique
export const isCertificateNumberUnique = async (certificateNumber, User) => {
  const existingDocument = await User.findOne({ certificateNumber });
  return !existingDocument;
};

// Function to generate a unique certificate number
export const generateUniqueCertificateNumber = async (User) => {
  let certificateNumber;
  do {
    certificateNumber = generateRandomLetters();
  } while (!(await isCertificateNumberUnique(certificateNumber, User)));

  return certificateNumber;
};

// Usage example
// Assuming User is your Mongoose model
// Replace User with your actual model name

export const addUser = async (req, res) => {
  try {
    const data = req.body;
    console.log("user-data" + data);

    await createNewUser(data);

    res.json({
      status: 200,
      success: true,
      data: { user: newUser },
    });
  } catch (error) {
    console.log(error);

    res.json({
      status: 500,
      success: false,
      message: "internal server error",
    });
  }
};

export async function createNewUser(user) {
  const certificateNumber = await generateUniqueCertificateNumber(User);
  const newUser = new User({
    certificate_num: certificateNumber,
    transaction_id: user.transaction_id,
    name: user.name,
    email: user.email,
    phone_number: user.phone_number,
    category: user.category,
    company_name: user.company_name,
    gst_no: user.gst_no,
  });

  await newUser.save();
}
