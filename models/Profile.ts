export interface Profile {
  _id: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  address?: string;
  notes?: string;
  gender?: 'Male' | 'Female' | 'Other';
  agree?: boolean;
  role: string;
  profilePhoto?: string;
}