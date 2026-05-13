import { test, expect, Page } from "@playwright/test";

/**
 * Happy Path: Search → Route Detail → Book → Confirm (success card)
 *
 * Prerequisites:
 *  - Dev server running on http://localhost:3000
 *  - At least one route with stops and pricing seeded in the DB
 *  - An EMPLOYEE account exists (set via env vars below)
 *
 * Auth: We log in via the login form before the test so the session cookie
 * is available for the protected /book page.
 */

const EMPLOYEE_EMAIL = process.env.TEST_EMPLOYEE_EMAIL ?? "employee@test.com";
const EMPLOYEE_PASSWORD = process.env.TEST_EMPLOYEE_PASSWORD ?? "password123";

async function loginAsEmployee(page: Page) {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(EMPLOYEE_EMAIL);
  await page.getByLabel(/password/i).fill(EMPLOYEE_PASSWORD);
  await page.getByRole("button", { name: /sign in|log in/i }).click();
  // Wait until redirected away from /login
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), {
    timeout: 10_000,
  });
}

/** Click a Radix UI <Select> trigger and pick an option by visible text */
async function selectOption(page: Page, triggerPlaceholder: string, optionText: string) {
  await page.getByRole("combobox", { name: new RegExp(triggerPlaceholder, "i") }).click();
  await page.getByRole("option", { name: new RegExp(optionText, "i") }).click();
}

test.describe("Happy Path: Search → Book → Confirm", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsEmployee(page);
  });

  test("employee can search a route, book it, and see the success confirmation", async ({
    page,
  }) => {
    // ── Step 1: Go to home page ──────────────────────────────────────────────
    await page.goto("/");
    await expect(page).toHaveTitle(/bus|transport/i);

    // ── Step 2: Scroll to search section and pick stops ──────────────────────
    await page.locator("#search").scrollIntoViewIfNeeded();

    // Select "From" stop — pick the first available option
    const fromTrigger = page.getByRole("combobox").first();
    await fromTrigger.click();
    const firstFromOption = page.getByRole("option").first();
    const fromStopName = await firstFromOption.textContent();
    await firstFromOption.click();

    // Select "To" stop — pick the second available option (first non-disabled)
    const toTrigger = page.getByRole("combobox").nth(1);
    await toTrigger.click();
    const firstToOption = page
      .getByRole("option")
      .filter({ hasNot: page.locator('[aria-disabled="true"]') })
      .first();
    const toStopName = await firstToOption.textContent();
    await firstToOption.click();

    // ── Step 3: Click Search ─────────────────────────────────────────────────
    await page.getByRole("button", { name: /^search$/i }).click();

    // Wait for results
    await expect(page.getByText(/route.*found|no routes/i)).toBeVisible({
      timeout: 10_000,
    });

    // ── Step 4: Click "Book Now" on the first result ─────────────────────────
    const bookNowLink = page.getByRole("link", { name: /book now/i }).first();
    await expect(bookNowLink).toBeVisible();
    await bookNowLink.click();

    // ── Step 5: Route detail page — click "Proceed to Booking" ───────────────
    await page.waitForURL(/\/routes\/.+\?from=/, { timeout: 10_000 });
    const proceedBtn = page.getByRole("link", { name: /proceed to booking/i });
    await expect(proceedBtn).toBeVisible({ timeout: 8_000 });
    await proceedBtn.click();

    // ── Step 6: Book page — fill start date and submit ────────────────────────
    await page.waitForURL(/\/routes\/.+\/book/, { timeout: 10_000 });
    await expect(
      page.getByRole("heading", { name: /complete your booking/i })
    ).toBeVisible();

    // Set a start date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD
    await page.locator('input[type="date"]').fill(dateStr);

    await page.getByRole("button", { name: /confirm booking/i }).click();

    // ── Step 7: Assert success card ───────────────────────────────────────────
    await expect(
      page.getByRole("heading", { name: /booking requested/i })
    ).toBeVisible({ timeout: 10_000 });

    await expect(page.getByText(/redirecting to dashboard/i)).toBeVisible();
  });
});
