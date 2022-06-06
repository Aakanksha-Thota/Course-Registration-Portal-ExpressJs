
// import { getDb } from "./database";
import {Schema,model} from 'mongoose';
const CourseSchema= new Schema({
  _id: Schema.Types.ObjectId,
  title: String,
  author: String,
  duration: String,
  level: String,
});


export default model('Course',CourseSchema);
