/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from '@faker-js/faker';
import { type Priority, type Status } from '@prisma/client';
import { type SupabaseClient, createClient } from '@supabase/supabase-js';
import { hash } from 'bcrypt';
import dotenv from 'dotenv';
import { env } from '@/env';
import prisma from '@/lib/prisma';

const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/ /g, '-') // Replace space with dash
    .replace(/[^a-z0-9-]/g, '') // no special characters
    .replace(/-{2,}/g, '-') // Prevent more than one dash between letters/numbers
    .replace(/^-/, ''); // Remove dash if it's the first character
};

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

async function createUserInSupabase(
  email: string,
  password: string,
  avatarUrl: string,
) {
  console.log(`Attempting to create user in Supabase: ${email}`);

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        avatarUrl,
      },
    });

    if (error) {
      console.error(
        'Supabase createUser error:',
        JSON.stringify(error, null, 2),
      );
      throw error;
    }

    if (!data.user) {
      console.error('User data is undefined:', JSON.stringify(data, null, 2));
      throw new Error('User data is undefined');
    }

    console.log(`Successfully created user in Supabase: ${data.user.id}`);
    return data.user;
  } catch (error) {
    console.error('Error in createUserInSupabase:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

async function createUserInPrismaAndSupabase(userData: {
  email: string;
  name: string;
  image: string;
}) {
  const password = '12345678';
  let supabaseUser;

  try {
    // Create user in Supabase auth
    supabaseUser = await createUserInSupabase(
      userData.email,
      password,
      userData.image,
    );

    // Create user in Prisma-managed database
    const prismaUser = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email: userData.email,
        name: userData.name,
        image: userData.image,
        hashedPassword: await hash(password, 13),
      },
    });

    return prismaUser;
  } catch (error) {
    // If Prisma user creation fails, delete the Supabase user
    if (supabaseUser) {
      await supabase.auth.admin.deleteUser(supabaseUser.id);
    }
    throw error;
  }
}

async function updateSupabaseUserMetadata(
  userId: string,
  lastWorkspaceUrl: string,
) {
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { lastWorkspaceUrl },
  });
  if (error) {
    console.error(
      `Failed to update Supabase user metadata for user ${userId}:`,
      error,
    );
  }
}

async function deleteAllSupabaseUsers(supabase: SupabaseClient) {
  const { data: users, error: listError } =
    await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('Failed to list Supabase users:', listError);
    return;
  }

  for (const user of users.users) {
    try {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        user.id,
      );
      if (deleteError) {
        console.error(
          `Failed to delete Supabase user ${user.id}:`,
          deleteError,
        );
      } else {
        console.log(`Successfully deleted user ${user.id}`);
      }
    } catch (error) {
      console.error(`Error deleting user ${user.id}:`, error);
    }
  }

  console.log('Finished processing all Supabase users');
}

async function main() {
  try {
    console.log('Deleting all Supabase auth users');
    await deleteAllSupabaseUsers(supabase);

    console.log('Starting database operations');
    await prisma.$transaction(
      async (tx) => {
        console.log('Clearing existing data');
        await tx.discussionLike.deleteMany();
        await tx.discussionPost.deleteMany();
        await tx.discussion.deleteMany();
        await tx.discussionCategory.deleteMany();
        await tx.issueLabel.deleteMany();
        await tx.issueActivity.deleteMany();
        await tx.issue.deleteMany();
        await tx.projectMember.deleteMany();
        await tx.project.deleteMany();
        await tx.workspaceMember.deleteMany();
        await tx.workspace.deleteMany();
        await tx.label.deleteMany();
        await tx.user.deleteMany();

        console.log('Creating labels');
        const labels = await tx.label
          .createManyAndReturn({
            data: [
              { name: 'Bug', color: 'red' },
              { name: 'Feature', color: 'green' },
              { name: 'Documentation', color: 'blue' },
              { name: 'Improvement', color: 'yellow' },
              { name: 'Help Wanted', color: 'purple' },
              { name: 'Good First Issue', color: 'orange' },
            ],
            select: {
              id: true,
            },
          })
          .then((labels) => labels.map((l) => l.id));

        console.log('Creating users');
        for (let i = 0; i < 6; i++) {
          try {
            const email = faker.internet.email();
            const password = '12345678';
            const name = faker.person.fullName();
            const image = faker.image.avatarGitHub();

            const user = await createUserInPrismaAndSupabase({
              email,
              name,
              image,
            });
            console.log(`Created user: ${user.id}`);
          } catch (error) {
            console.error(`Failed to create user ${i + 1}:`, error);
          }
        }

        const validUsers = await tx.user.findMany();
        const userIds = validUsers.map((u) => u.id);

        console.log('Creating workspaces and projects');
        const workspaceOwner = await createUserInPrismaAndSupabase({
          email: faker.internet.exampleEmail(),
          name: faker.person.fullName(),
          image: faker.image.avatar(),
        });

        const workspaceName = faker.company.name();
        const workspace = await tx.workspace.create({
          data: {
            name: workspaceName,
            ownerId: workspaceOwner.id,
            url: slugify(workspaceName),
            members: {
              create: userIds.map((userId) => ({
                userId,
                role: 'MEMBER',
              })),
            },
          },
        });

        console.log('Updating users lastWorkspaceUrl');
        const workspaceMembers = await tx.workspaceMember.findMany({
          where: { workspaceId: workspace.id },
          select: { userId: true },
        });

        for (const member of workspaceMembers) {
          await tx.user.update({
            where: { id: member.userId },
            data: { lastWorkspaceUrl: workspace.url },
          });

          // Add lastWorkspaceUrl to each user's metadata
          await updateSupabaseUserMetadata(member.userId, workspace.url);
        }

        console.log('Updating 3 added members to admins');
        const adminIds = faker.helpers.arrayElements(userIds, 3);
        console.log(`Selected admin IDs: ${adminIds.join(', ')}`);

        // Check if all selected adminIds are valid workspace members
        const existingMembers = await tx.workspaceMember.findMany({
          where: { userId: { in: adminIds }, workspaceId: workspace.id },
          select: { userId: true },
        });
        console.log(
          `Existing members: ${existingMembers.map((m) => m.userId).join(', ')}`,
        );

        if (existingMembers.length < 3) {
          console.warn(
            `Only ${existingMembers.length} of the selected admin IDs are valid workspace members`,
          );
        }

        const updateResult = await tx.workspaceMember.updateMany({
          where: { userId: { in: adminIds }, workspaceId: workspace.id },
          data: { role: 'ADMIN' },
        });
        console.log(
          `Update result: ${updateResult.count} members updated to ADMIN`,
        );

        // Verify the update
        const updatedAdmins = await tx.workspaceMember.findMany({
          where: {
            userId: { in: adminIds },
            workspaceId: workspace.id,
            role: 'ADMIN',
          },
          select: { userId: true, role: true },
        });
        console.log(`Updated admins: ${JSON.stringify(updatedAdmins)}`);

        // If we still don't have 3 admins, try to add more
        if (updatedAdmins.length < 3) {
          console.log('Attempting to add more admins to reach 3');
          const remainingMembers = await tx.workspaceMember.findMany({
            where: {
              workspaceId: workspace.id,
              role: 'MEMBER',
              userId: { notIn: updatedAdmins.map((a) => a.userId) },
            },
            take: 3 - updatedAdmins.length,
            select: { userId: true },
          });

          if (remainingMembers.length > 0) {
            const additionalUpdateResult = await tx.workspaceMember.updateMany({
              where: {
                userId: { in: remainingMembers.map((m) => m.userId) },
                workspaceId: workspace.id,
              },
              data: { role: 'ADMIN' },
            });
            console.log(
              `Additional update result: ${additionalUpdateResult.count} more members updated to ADMIN`,
            );
          }
        }

        // Final verification
        const finalAdmins = await tx.workspaceMember.findMany({
          where: { workspaceId: workspace.id, role: 'ADMIN' },
          select: { userId: true, role: true },
        });
        console.log(`Final admins: ${JSON.stringify(finalAdmins)}`);

        console.log('Creating projects and adding project members');
        const workspaceIds = [workspace.id];
        for (const workspaceId of workspaceIds) {
          const projects = await tx.project.createMany({
            data: Array.from({ length: 2 }, () => {
              const projectTitle = faker.company.name();
              return {
                title: projectTitle,
                identifier: projectTitle.substring(0, 3).toUpperCase(),
                workspaceId,
              };
            }),
            skipDuplicates: true,
          });

          const projectIds = (
            await tx.project.findMany({
              where: { workspaceId },
              select: { id: true },
            })
          ).map((p) => p.id);

          for (const projectId of projectIds) {
            // Add 3-4 members to each project
            const memberCount = faker.number.int({ min: 3, max: 4 });
            await tx.projectMember.createMany({
              data: faker.helpers
                .arrayElements(userIds, memberCount)
                .map((userId) => ({
                  userId,
                  projectId,
                })),
              skipDuplicates: true,
            });
          }
        }

        console.log('Creating issues');
        const priorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'NO_PRIORITY'];
        const statuses: Status[] = [
          'BACKLOG',
          'IN_PROGRESS',
          'DONE',
          'CANCELLED',
        ];

        const projectIds = await tx.project
          .findMany({
            where: { workspaceId: workspace.id },
            select: { id: true },
          })
          .then((projects) => projects.map((p) => p.id));

        for (const projectId of projectIds) {
          const projectMembers = await tx.projectMember.findMany({
            where: { projectId },
            select: { userId: true },
          });
          const projectMemberIds = projectMembers.map(
            (member) => member.userId,
          );

          if (projectMemberIds.length === 0) {
            console.warn(
              `Project ${projectId} has no members. Skipping issue creation.`,
            );
            continue;
          }

          const issues = await tx.issue.createMany({
            data: Array.from({ length: 15 }, () => ({
              title: faker.hacker.phrase(),
              description: generateMarkdownDescription(),
              priority: faker.helpers.arrayElement(priorities),
              status: faker.helpers.arrayElement(statuses),
              projectId,
              ownerId: faker.helpers.arrayElement(projectMemberIds),
            })),
            skipDuplicates: true,
          });
        }

        console.log('Assigning labels to issues');
        const issueIds = (
          await tx.issue.findMany({
            where: { projectId: { in: projectIds } },
            select: { id: true },
          })
        ).map((i) => i.id);
        await tx.issueLabel.createMany({
          data: issueIds.flatMap((issueId) =>
            faker.helpers
              .arrayElements(labels, faker.number.int({ min: 0, max: 4 }))
              .map((labelId) => ({ issueId, labelId })),
          ),
          skipDuplicates: true,
        });

        console.log('Creating discussion categories');
        const discussionCategories = await tx.discussionCategory.createMany({
          data: projectIds.flatMap((projectId) =>
            Array.from({ length: 3 }, () => ({
              name: faker.lorem.word(),
              description: faker.lorem.sentence(),
              emoji: faker.internet.emoji(),
              projectId,
            })),
          ),
          skipDuplicates: true,
        });

        console.log('Creating discussions and posts');
        const categoryIds = (
          await tx.discussionCategory.findMany({ select: { id: true } })
        ).map((c) => c.id);
        for (const projectId of projectIds) {
          const discussions = await tx.discussion.createMany({
            data: Array.from({ length: 5 }, () => ({
              title: faker.lorem.sentence(),
              content: faker.lorem.paragraphs(),
              projectId,
              authorId: faker.helpers.arrayElement(userIds),
              categoryId: faker.helpers.arrayElement(categoryIds),
              isResolved: faker.datatype.boolean(),
              viewCount: faker.number.int({ min: 0, max: 100 }),
              likeCount: faker.number.int({ min: 0, max: 50 }),
              workspaceId: workspace.id,
            })),
            skipDuplicates: true,
          });

          const discussionIds = (
            await tx.discussion.findMany({
              where: { projectId },
              select: { id: true },
            })
          ).map((d) => d.id);

          console.log('Creating discussion posts');
          for (const discussionId of discussionIds) {
            await tx.discussionPost.createMany({
              data: Array.from(
                { length: faker.number.int({ min: 1, max: 10 }) },
                () => ({
                  content: faker.lorem.paragraph(),
                  discussionId,
                  authorId: faker.helpers.arrayElement(userIds),
                  isAccepted: faker.datatype.boolean(),
                }),
              ),
              skipDuplicates: true,
            });
          }

          console.log('Creating discussion likes');
          await tx.discussionLike.createMany({
            data: discussionIds.flatMap((discussionId) =>
              faker.helpers
                .arrayElements(userIds, faker.number.int({ min: 0, max: 10 }))
                .map((userId) => ({ discussionId, userId })),
            ),
            skipDuplicates: true,
          });
        }
      },
      {
        maxWait: 60000, // 1 minute
        timeout: 180000, // 3 minutes
      },
    );

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error in main function:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

function generateMarkdownDescription() {
  const title = faker.lorem.sentence();
  const summary = faker.lorem.paragraph();
  const stepsToReproduce = Array.from(
    { length: faker.number.int({ min: 2, max: 5 }) },
    () => faker.lorem.sentence(),
  );
  const expectedBehavior = faker.lorem.paragraph();
  const actualBehavior = faker.lorem.paragraph();
  const additionalNotes = faker.lorem.paragraph();
  const environmentDetails = `- OS: ${faker.helpers.arrayElement(['Windows', 'macOS', 'Linux'])}\n- Browser: ${faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'])}\n- Version: ${faker.system.semver()}`;

  return `
## Summary

${summary}

## Steps to Reproduce

${stepsToReproduce.map((step, index) => `${index + 1}. ${step}`).join('\n')}

## Expected Behavior

${expectedBehavior}

## Actual Behavior

${actualBehavior}

## Additional Notes

${additionalNotes}
  `.trim();
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
