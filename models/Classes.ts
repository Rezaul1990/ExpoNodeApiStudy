import { CoachModel } from "./Coach";
import { User } from "./User";

export interface ClassModel {
   _id: string;
  name: string;
  description?: string;
  cost: number;
  date: string;
  startTime: string; 
  endTime: string;
  coaches: CoachModel[];
 enrolledUsers: User[];
  
}