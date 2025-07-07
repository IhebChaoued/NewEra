export interface IJob {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salaryRange: string;
  howToApply: string;
  blurry: boolean;
  companyId: string;
}
