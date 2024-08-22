import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  await prisma.$transaction([
    prisma.discussionLike.deleteMany(),
    prisma.discussionPost.deleteMany(),
    prisma.discussion.deleteMany(),
    prisma.discussionCategory.deleteMany(),
    prisma.issueLabel.deleteMany(),
    prisma.issueActivity.deleteMany(),
    prisma.issue.deleteMany(),
    prisma.projectMember.deleteMany(),
    prisma.project.deleteMany(),
    prisma.workspaceMember.deleteMany(),
    prisma.workspace.deleteMany(),
    prisma.label.deleteMany(),
    prisma.user.deleteMany(),
  ]);
};
