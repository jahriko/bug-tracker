import {
  type Issue,
  type IssueLabel,
  type Label,
  type Project,
  type User,
} from '@prisma/client';
import { type IssueActivityList, type IssueByProject } from './_data/issue';

export type ActivityType =
  | 'CommentActivity'
  | 'StatusActivity'
  | 'PriorityActivity'
  | 'TitleActivity'
  | 'DescriptionActivity'
  | 'AssignedActivity'
  | 'LabelActivity'
  | 'ProjectActivity'
  | 'None';

export interface LastActivity {
  activityType: ActivityType;
  activityId: number;
}

export interface IssuePageParams {
  slug: string[];
  workspaceId: string;
}

export interface IssueDesktopSidebarProps {
  issue: IssueByProject;
  activities: IssueActivityList;
  labels: Label[];
  issueLabels: IssueLabel[];
  projects: Project[];
  lastActivityInfo: LastActivity;
  workspaceId: string;
}

export type Status = 'BACKLOG' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type Priority = 'NO_PRIORITY' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface AssignedUser {
  id: string;
  name: string;
  image: string | null;
}

export interface PropertyProps<T> {
  issueId: number;
  value?: T | null;
  lastActivity: LastActivity;
}

export interface AssigneePropertyProps extends PropertyProps<string> {
  projectMembers: {
    user: {
      id: string;
      name: string;
      image: string | null;
    };
  }[];
}

export interface ProjectPropertyProps extends PropertyProps<number> {
  projects: Project[];
}

export type { Issue, IssueLabel, Label, Project, User };
