import { Admin } from "../admin/admin.model";
import { Student } from "../student/student.model";
import { Teacher } from "../teacher/teacher.model";

// defalult student set
export const findLastStudentId = async () => {
  const lastStudent = await Student.findOne(
    { role: "student" },
    { studentId: 1, class: 1, _id: 0 }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  const currentYear: number = new Date().getFullYear();
  return lastStudent?.studentId
    ? `${lastStudent.studentId}`.substring(10)
    : undefined;
};
export const generateStudentId = async (className: string): Promise<string> => {
  const currentYear = new Date().getFullYear().toString().substring(2);
  const currentId =
    (await findLastStudentId()) || (0).toString().padStart(3, "0"); //00000

  //increment by 1
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(3, "0");

  //20 25
  incrementedId = `S-${currentYear}-${className}-${incrementedId}`;

  return incrementedId;
};

// default create teacher id
export const findLastTeacherId = async () => {
  const lastTeacher = await Teacher.findOne(
    { role: "teacher" },
    { teacherId: 1, _id: 0 }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  console.log(
    "teacher Id",
    lastTeacher?.teacherId ? `${lastTeacher.teacherId}`.substring(2) : undefined
  );
  return lastTeacher?.teacherId
    ? `${lastTeacher.teacherId}`.substring(2)
    : undefined;
};
export const generateTeacherId = async (): Promise<string> => {
  // const currentId =
  //   (await findLastTeacherId()) || (0).toString().padStart(4, "0"); //00000

  // //increment by 1
  // let incrementedId = (parseInt(currentId) + 1).toString().padStart(4, "0");

  const currentId =
    (await findLastTeacherId()) || (0).toString().padStart(4, "0");
  const incrementedId = `T-${(parseInt(currentId) + 1).toString().padStart(4, "0")}`;

  // incrementedId = `T-${incrementedId}`;

  return incrementedId;
};

// set default admin id
export const findLastAdminId = async () => {
  const lastAdmin = await Admin.findOne(
    { role: "admin" },
    { adminId: 1, _id: 0 }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.adminId ? `${lastAdmin.adminId}`.substring(2) : undefined;
};
export const generateAdminId = async (): Promise<string> => {
  const currentId =
    (await findLastAdminId()) || (0).toString().padStart(4, "0"); //00000

  //increment by 1
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(4, "0");

  //20 25
  incrementedId = `A-${incrementedId}`;

  return incrementedId;
};
