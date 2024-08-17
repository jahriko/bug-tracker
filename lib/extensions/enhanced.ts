/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable guard-for-in */
import prisma from '@/lib/prisma';
import { enhance } from '@zenstackhq/runtime';
import 'server-only';

const enhanced = enhance(prisma);

export const db = enhanced.$extends({
  query: {
    issue: {
      async update({ args }) {
        await prisma.$transaction(async () => {
          const updateIssue = await enhanced.issue.update(args);

          for (const field in args.data) {
            switch (field) {
              case 'title':
                await enhanced.titleActivity.create({
                  data: {
                    userId: args.data.ownerId as string,
                    issueId: args.where.id!,
                    title: args.data[field] as string,
                  },
                });
                break;
              case 'description':
                console.log('Description updated:', args.data[field]);
                break;
              case 'priority':
                await enhanced.priorityActivity.create({
                  data: {
                    userId: args.data.ownerId as string,
                    issueId: args.where.id!,
                    name: args.data[field] as string,
                  },
                });
                break;
              case 'status':
                await enhanced.statusActivity.create({
                  data: {
                    userId: args.data.ownerId as string,
                    issueId: args.where.id!,
                    name: args.data[field] as string,
                  },
                });
                break;
              default:
                break;
            }
          }
          return updateIssue;
        });
      },
    },
  },
});
