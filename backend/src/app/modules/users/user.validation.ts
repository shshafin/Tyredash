import { z } from "zod";

// Define the User name schema
const UserName = z.object({
  firstName: z.string({ required_error: "First name is required" }),
  lastName: z.string({ required_error: "Last name is required" }),
  surname: z.string().optional(),
});

// define gender schema
const GenderSchema = z.enum(["male", "female", "other"]);

// blood group schema
const BloodGroupSchema = z.enum([
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
]);

// marital status schema
const MaritalStatusSchema = z.enum([
  "single",
  "married",
  "widowed",
  "divorced",
]);

// addresses status schema
const AddressSchema = z.object({
  street: z.string({ required_error: "street is required" }),
  city: z.string({ required_error: "city is required" }),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string({ required_error: "country is required" }),
});

// Define the Guardian schema
const GuardianSchema = z.object({
  fatherName: z.string({ required_error: "Father's name is required" }),
  fatherOccupation: z.string({ required_error: "Mother's name is required" }),
  fatherContactNo: z.string({
    required_error: "Father's contact number is required",
  }),
  motherName: z.string({ required_error: "Mother's name is required" }),
  motherOccupation: z.string({
    required_error: "Mother'sOccupation is required",
  }),
  motherContactNo: z.string({
    required_error: "Mother's contact number is required",
  }),
  address: z.string({ required_error: "Address is required" }),
});

// Define the Student  schema
const createStudent = z.object({
  body: z.object({
    password: z.string({ required_error: "Password is required" }),
    student: z.object({
      studentId: z.string().optional(),
      name: UserName,
      gender: GenderSchema,
      email: z.string().email("Invalid email address"),
      role: z.literal("student"),
      dateOfBirth: z.string({ required_error: "Date of birth is required" }),
      birthCertificateNo: z.string({
        required_error: "Birth certificate number is required",
      }),
      guardian: GuardianSchema,
      bloodGroup: BloodGroupSchema.optional(),
      grade: z.string().optional(),
      class: z.string({ required_error: "Class is required" }),
      nationality: z.string({ required_error: "Nationality is required" }),
      presentAddress: z.string({
        required_error: "Present Address is required",
      }),
      permanentAddress: z.string({
        required_error: "Permanent Address is required",
      }),
      profileImage: z.string({ required_error: "Profile Image is required" }),
    }),
  }),
});

// define teacher schmema
const createTeacher = z.object({
  body: z.object({
    password: z.string({ required_error: "Password is required" }),
    teacher: z.object({
      teacherId: z.string().optional(),
      name: UserName,
      fatherName: z.string({ required_error: "father Name is required" }),
      motherName: z.string({ required_error: "mother Name is required" }),
      gender: GenderSchema,
      role: z.literal("teacher"),
      email: z.string({ required_error: "email is required" }).email(),
      dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      }),
      birthCertificateNo: z.string({
        required_error: "birth certificate is required",
      }),
      nationalIdNo: z.string({ required_error: "National Id is required" }),
      qualification: z.string({ required_error: "Qualification is required" }),
      addEducation: z.string({ required_error: "add education is required" }),
      experience: z.string({ required_error: "experience is required" }),
      subject: z.string({ required_error: "subject is required" }),
      contactNo: z.string({ required_error: "contact No is required" }),
      nationality: z.string({ required_error: "Nationality is required" }),
      presentAddress: AddressSchema,
      permanentAddress: AddressSchema,
      maritalStatus: MaritalStatusSchema,
      religion: z.string({ required_error: "religon is required" }),
      bloodGroup: BloodGroupSchema.optional(),
      profileImage: z.string().url().optional(),
    }),
  }),
});

// define admin schema
const createAdmin = z.object({
  body: z.object({
    password: z.string({ required_error: "Password is required" }),
    admin: z.object({
      name: UserName,
      fatherName: z.string(),
      motherName: z.string(),
      gender: GenderSchema,
      role: z.literal("admin"),
      email: z.string().email(),
      dateOfBirth: z.string(), // For stricter validation, consider using zod-date
      birthCertificateNo: z.string(),
      nationalIdNo: z.string(),
      qualification: z.string(),
      contactNo: z.string(),
      nationality: z.string(),
      presentAddress: AddressSchema,
      permanentAddress: AddressSchema,
      maritalStatus: MaritalStatusSchema,
      religion: z.string(),
      bloodGroup: BloodGroupSchema.optional(),
      profileImage: z.string().url().optional(),
    }),
  }),
});

export const Uservalidation = {
  createStudent,
  createTeacher,
  createAdmin,
};
