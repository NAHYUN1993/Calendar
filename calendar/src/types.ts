export interface Participant {
  id: string;
  name: string;
  submitted: boolean;
}

export interface Contest {
  id:string;
  poster: string;
  name: string;
  link: string;
  startDate: string;
  deadline: string;
  announcementDate?: string;
  prize: string;
  submissionType: string;
  participants: Participant[];
  notes?: string;
}