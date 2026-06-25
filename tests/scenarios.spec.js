import { test, expect } from '@playwright/test';

const testUsername = `user_${Date.now()}`;
const testEmail = `${testUsername}@example.com`;
const testPassword = 'Password123!';

test.describe('Kresh Major Capabilities Scenarios', () => {
  // Scenario 1: User Registration
  test('Scenario 1: User can sign up successfully', async ({ page }) => {
    const testUsername = `user1_${Date.now()}`;
    const testEmail = `${testUsername}@example.com`;
    const testPassword = 'Password123!';

    await page.goto('/signup');
    await page.fill('input[name="username"]', testUsername);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  // Scenario 2: User Login
  test('Scenario 2: User can log in successfully', async ({ page }) => {
    const testUsername = `user2_${Date.now()}`;
    const testEmail = `${testUsername}@example.com`;
    const testPassword = 'Password123!';

    // Sign up first
    await page.goto('/signup');
    await page.fill('input[name="username"]', testUsername);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/');

    // Log out (optional, we can just clear cookies or rely on isolated context)
    await page.context().clearCookies();

    // Now Sign in
    await page.goto('/signin');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // Verify user is authenticated by visiting the dashboard
    await page.goto('/dashboard');
    // The dashboard page redirects to /@username
    await expect(page).toHaveURL(new RegExp(`http://localhost:3000/@${testUsername}`));
  });

  // Scenario 3: Publishing a Skill
  test('Scenario 3: User can publish a new skill from dashboard', async ({ page }) => {
    const testUsername = `user3_${Date.now()}`;
    const testEmail = `${testUsername}@example.com`;
    const testPassword = 'Password123!';

    // Sign up
    await page.goto('/signup');
    await page.fill('input[name="username"]', testUsername);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/');

    // Go to publish
    await page.goto('/dashboard/publish');
    
    const skillName = `Test Skill ${Date.now()}`;
    await page.fill('input[name="name"]', skillName);
    
    const descInput = await page.$('input[name="description"]');
    if (descInput) {
      await descInput.fill('A cool test skill.');
    } else {
      const descTextarea = await page.$('textarea[name="description"]');
      if (descTextarea) await descTextarea.fill('A cool test skill.');
    }

    const markdownInput = await page.$('textarea[name="skillMarkdown"]');
    if (markdownInput) {
      await markdownInput.fill('# Test Skill\n\nThis is a test.');
    }

    await page.click('button[type="submit"]');
    
    // Check for error messages
    const errorLocator = page.locator('.text-red-300');
    if (await errorLocator.isVisible({ timeout: 1000 }).catch(() => false)) {
      const errorText = await errorLocator.textContent();
      throw new Error(`Publish failed with UI error: ${errorText}`);
    }

    // Since it doesn't redirect on publish, look for success message
    await expect(page.locator('text=Skill published successfully.')).toBeVisible({ timeout: 10000 });
    
    // Check if the skill name appears on the dashboard
    await page.goto('/dashboard');
    await expect(page.locator(`text=${skillName}`).first()).toBeVisible();
  });

  // Scenario 4: Skills API response
  test('Scenario 4: Skills API returns valid data', async ({ request }) => {
    const response = await request.get('/api/skills');
    expect(response.ok()).toBeTruthy();
  });
});
