import { Schema, model, Types } from "mongoose";
const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  _id: Schema.Types.ObjectId,
  role: {
    type: String,
    required:true
  },
  coursesEnrolled: [{ type: Schema.Types.ObjectId, ref: "Course" }],
});

UserSchema.methods.enrollCourse = function (id: string) {
  const courseId = new Types.ObjectId(id);

  if (this.coursesEnrolled && this.coursesEnrolled.length > 0) {
    this.coursesEnrolled.push(courseId);
  } else {
    this.coursesEnrolled = [courseId];
  }
  return this.save();
};

UserSchema.methods.unEnrollCourse = function (id: string) {
  const courseId = new Types.ObjectId(id);
  let newCourses: any = [];

  if (this.coursesEnrolled && this.coursesEnrolled.length > 0) {
    newCourses = this.coursesEnrolled.filter(
      (enrolledId: any) => enrolledId.toString() != courseId.toString()
    );
  }
  this.coursesEnrolled = newCourses;
  return this.save();
};

export default model("User", UserSchema);
