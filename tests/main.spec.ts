import { type Page, expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test('Should create and verify new workspace and project', async ({ page }) => {
  // Click the workspace dropdown
  await page.click('button[id^="headlessui-menu-button-"]');

  // Wait for the dropdown menu to be visible
  await page.waitForSelector('[role="menu"]', { state: 'visible' });

  // Click the "New workspace" option
  await page.click('text=New workspace');

  // Wait for the create workspace page to load
  await page.waitForURL('/create-workspace');

  // Fill in the workspace details
  await page.fill('input[name="name"]', 'Test Workspace');
  await page.fill('input[name="url"]', 'test-workspace');

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for navigation to complete
  await page.waitForURL('/test-workspace/issues');

  // Verify we're on the workspace page
  expect(page.url()).toContain('/test-workspace');

  // Navigate to create project page
  await page.click('text=Projects');

  // Fill in project details
  await page.fill('input[name="title"]', 'Test Project');

  // Submit the project creation form
  await page.click('button[type="submit"]');

  // Wait for the project to be created
  await page.waitForSelector('text=Test Project');

  // Verify the project is listed
  const projectElement = page.locator('text=Test Project').first();
  expect(await projectElement.isVisible()).toBeTruthy();
});

test('Should create a new issue', async ({ page }) => {
  // Navigate to the project page
  await page.goto('/test-workspace/projects/test-project');

  // Click the "New issue" button
  await page.click('text=New issue');

  // Fill in the issue details
  await page.fill('input[name="title"]', 'Test Issue');
  await page.fill('textarea[name="description"]', 'This is a test issue');

  // Submit the issue creation form
  await page.click('button[type="submit"]');

  // Wait for the issue to be created
  await page.waitForSelector('text=Test Issue');

  // Verify the issue is listed
  const issueElement = page.locator('text=Test Issue').first();
  expect(await issueElement.isVisible()).toBeTruthy();
});

test('Should create a new discussion', async ({ page }) => {
  // Navigate to the project page
  await page.goto('/test-workspace/projects/test-project');

  // Click the "Discussions" tab
  await page.click('text=Discussions');

  // Click the "New discussion" button
  await page.click('text=New discussion');

  // Fill in the discussion details
  await page.fill('input[name="title"]', 'Test Discussion');
  await page.fill('textarea[name="content"]', 'This is a test discussion');

  // Select a category (assuming there's a dropdown for categories)
  await page.selectOption('select[name="category"]', { label: 'General' });

  // Submit the discussion creation form
  await page.click('button[type="submit"]');

  // Wait for the discussion to be created
  await page.waitForSelector('text=Test Discussion');

  // Verify the discussion is listed
  const discussionElement = page.locator('text=Test Discussion').first();
  expect(await discussionElement.isVisible()).toBeTruthy();
});

test('Should create a reply to a discussion', async ({ page }) => {
  // Navigate to the project page
  await page.goto('/test-workspace/projects/test-project');

  // Click the "Discussions" tab
  await page.click('text=Discussions');

  // Click on an existing discussion (assuming "Test Discussion" exists from the previous test)
  await page.click('text=Test Discussion');

  // Wait for the discussion page to load
  await page.waitForSelector('text=Reply');

  // Click the "Reply" button
  await page.click('text=Reply');

  // Fill in the reply content
  await page.fill('textarea[name="replyContent"]', 'This is a test reply');

  // Submit the reply
  await page.click('button[type="submit"]');

  // Wait for the reply to be posted
  await page.waitForSelector('text=This is a test reply');

  // Verify the reply is visible
  const replyElement = page.locator('text=This is a test reply').first();
  expect(await replyElement.isVisible()).toBeTruthy();
});

test.describe('Updating an issue', () => {
  test("Should update an issue's status", async ({ page }) => {
    // Navigate to the project page
    await page.goto('/test-workspace/projects/test-project');

    // Click on an existing issue (assuming "Test Issue" exists from a previous test)
    await page.click('text=Test Issue');

    // Wait for the issue details page to load
    await page.waitForSelector('button[aria-label="Status"]');

    // Click the status dropdown
    await page.click('button[aria-label="Status"]');

    // Select a new status (e.g., "In Progress")
    await page.click('text=In Progress');

    // Wait for the status to update
    await page.waitForSelector(
      'button[aria-label="Status"]:has-text("In Progress")',
    );

    // Verify the status has been updated
    const statusElement = page.locator(
      'button[aria-label="Status"]:has-text("In Progress")',
    );
    expect(await statusElement.isVisible()).toBeTruthy();
  });

  // test('Should assign a user to an issue', async ({ page }) => {
  //   await page.goto('/test-workspace/projects/test-project');

  //   await page.click('text=Test Issue');

  //   await page.waitForSelector('button[aria-label="Assigned to"]');

  //   await page.click('button[aria-label="Assigned to"]');

  //   await page.click('text=John Doe');

  //   await page.waitForSelector(
  //     'button[aria-label="Assigned to"]:has-text("John Doe")',
  //   );

  //   const assigneeElement = page.locator(
  //     'button[aria-label="Assigned to"]:has-text("John Doe")',
  //   );
  //   expect(await assigneeElement.isVisible()).toBeTruthy();
  // });
});
