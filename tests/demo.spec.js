import { test, expect } from "@playwright/test";

const DEMO_URL = "/blog/permission-systems-for-enterprise/demo.html";
const DEMO_IMPLEMENTATIONS = ["Naive", "RBAC"];

for (const impl of DEMO_IMPLEMENTATIONS) {
  test.describe(`Permission Demo - ${impl}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(DEMO_URL);
      // Select the implementation mode via toggle
      await page.getByRole("radio", { name: impl }).click();
      // Wait for SQLite initialization
      await page.waitForSelector(".tree-item");
    });

    test("initial state has one user tab with root folder selected", async ({
      page,
    }) => {
      // One user tab visible
      await expect(page.getByRole("button", { name: "User 1" })).toBeVisible();

      // User type is standard by default
      await expect(page.getByRole("radio", { name: "Standard" })).toBeChecked();

      // Root folder is visible and selected
      const rootFolder = page.getByText("User 1's Folder");
      await expect(rootFolder).toBeVisible();
      await expect(rootFolder.locator("..")).toHaveClass(/selected/);
    });

    test("add user creates new user tab with root folder", async ({ page }) => {
      await page.getByRole("button", { name: "+ Add User" }).click();

      // Two user tabs now visible
      await expect(page.getByRole("button", { name: "User 1" })).toBeVisible();
      await expect(page.getByRole("button", { name: "User 2" })).toBeVisible();

      // Switched to User 2's tab (active)
      await expect(page.getByRole("button", { name: "User 2" })).toHaveClass(
        /active/,
      );

      // User 2's root folder is visible
      await expect(page.getByText("User 2's Folder")).toBeVisible();
    });

    test("add folder creates folder under selected folder", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "+ Add Folder" }).click();

      // New folder appears in tree
      await expect(page.getByText("Folder 2")).toBeVisible();
    });

    test("add file creates file under selected folder", async ({ page }) => {
      await page.getByRole("button", { name: "+ Add File" }).click();

      // New file appears in tree
      await expect(page.getByText("File 1")).toBeVisible();
    });

    test("share resource with new user", async ({ page }) => {
      // Create a file to share
      await page.getByRole("button", { name: "+ Add File" }).click();
      await page.getByText("File 1").click();
      await expect(page.getByText("File 1").locator("..")).toHaveClass(/selected/);

      // Share with new user
      await page.getByRole("button", { name: "Share" }).click();
      await page.getByText("+ New User").click();

      // New user tab created
      await expect(page.getByRole("button", { name: "User 2" })).toBeVisible();

      // Owner sees "shared with: User 2"
      await expect(page.getByText("shared with: User 2")).toBeVisible();
    });

    test("owner sees 'shared with' but recipient sees just 'shared'", async ({
      page,
    }) => {
      // Create a file and share it
      await page.getByRole("button", { name: "+ Add File" }).click();
      await page.getByText("File 1").click();
      await expect(page.getByText("File 1").locator("..")).toHaveClass(/selected/);
      await page.getByRole("button", { name: "Share" }).click();
      await page.getByText("+ New User").click();

      // Owner (User 1) sees "shared with: User 2"
      await page.getByRole("button", { name: "User 1" }).click();
      await expect(page.getByText("shared with: User 2")).toBeVisible();

      // Recipient (User 2) sees just "shared"
      await page.getByRole("button", { name: "User 2" }).click();
      await expect(page.getByText("shared", { exact: true })).toBeVisible();
      await expect(page.getByText("shared with:")).toHaveCount(0);
    });

    test("standard user only sees owned and shared resources", async ({
      page,
    }) => {
      // Create User 2
      await page.getByRole("button", { name: "+ Add User" }).click();

      // User 2 creates a folder
      await page.getByRole("button", { name: "+ Add Folder" }).click();

      // Switch back to User 1
      await page.getByRole("button", { name: "User 1" }).click();

      // User 1 should not see User 2's folder
      await expect(page.getByText("User 2's Folder")).toHaveCount(0);
      await expect(page.getByText("Folder 2")).toHaveCount(0);
    });

    test("admin user sees all resources", async ({ page }) => {
      // Create User 2
      await page.getByRole("button", { name: "+ Add User" }).click();
      await expect(page.getByText("User 2's Folder")).toBeVisible();

      // User 2 creates a folder
      await page.getByRole("button", { name: "+ Add Folder" }).click();
      await expect(page.getByText("Folder 2")).toBeVisible();

      // Switch to User 1 and make them admin
      await page.getByRole("button", { name: "User 1" }).click();
      await page.getByRole("radio", { name: "Admin" }).click();

      // User 1 should now see User 2's resources
      await expect(page.getByText("User 2's Folder")).toBeVisible();
      await expect(page.getByText("Folder 2")).toBeVisible();
    });

    test("shared folder gives access to descendants", async ({ page }) => {
      // Create nested structure: Folder 2 > File 1
      await page.getByRole("button", { name: "+ Add Folder" }).click();
      await page.getByText("Folder 2").click();
      await expect(page.getByText("Folder 2").locator("..")).toHaveClass(
        /selected/,
      );
      await page.getByRole("button", { name: "+ Add File" }).click();
      await expect(page.getByText("File 1")).toBeVisible();

      // Share Folder 2 with new user (Folder 2 is still selected)
      await page.getByRole("button", { name: "Share" }).click();
      await page.getByText("+ New User").click();

      // Switch to User 2
      await page.getByRole("button", { name: "User 2" }).click();

      // User 2 should see Folder 2 and File 1 inside it
      await expect(page.getByText("Folder 2")).toBeVisible();
      await expect(page.getByText("File 1")).toBeVisible();

      // Select the shared folder - buttons should be disabled (read-only access)
      await page.getByText("Folder 2").click();
      await expect(page.getByText("Folder 2").locator("..")).toHaveClass(/selected/);
      await expect(page.getByRole("button", { name: "+ Add Folder" })).toBeDisabled();
      await expect(page.getByRole("button", { name: "+ Add File" })).toBeDisabled();
      await expect(page.getByRole("button", { name: "Share" })).toBeDisabled();
    });

    test("sharing file shows ancestor path but not siblings", async ({
      page,
    }) => {
      // Create: Folder 2 > File 1, File 2
      await page.getByRole("button", { name: "+ Add Folder" }).click();
      await page.getByText("Folder 2").click();
      await page.getByRole("button", { name: "+ Add File" }).click(); // File 1
      await page.getByRole("button", { name: "+ Add File" }).click(); // File 2

      // Share only File 1 with new user
      await page.getByText("File 1").click();
      await expect(page.getByText("File 1").locator("..")).toHaveClass(/selected/);
      await page.getByRole("button", { name: "Share" }).click();
      await page.getByText("+ New User").click();

      // Switch to User 2
      await page.getByRole("button", { name: "User 2" }).click();

      // User 2 should see ancestor path and File 1
      await expect(page.getByText("User 1's Folder")).toBeVisible();
      await expect(page.getByText("Folder 2")).toBeVisible();
      await expect(page.getByText("File 1")).toBeVisible();

      // But NOT File 2 (sibling)
      await expect(page.getByText("File 2")).toHaveCount(0);
    });

    test("buttons disabled on ancestor-only folders", async ({ page }) => {
      // Create: Folder 2 > File 1
      await page.getByRole("button", { name: "+ Add Folder" }).click();
      await page.getByText("Folder 2").click();
      await page.getByRole("button", { name: "+ Add File" }).click();

      // Share File 1 with new user
      await page.getByText("File 1").click();
      await expect(page.getByText("File 1").locator("..")).toHaveClass(/selected/);
      await page.getByRole("button", { name: "Share" }).click();
      await page.getByText("+ New User").click();

      // Switch to User 2
      await page.getByRole("button", { name: "User 2" }).click();

      // Select ancestor folder (User 1's Folder)
      await page.getByText("User 1's Folder").click();

      // Buttons should be disabled
      await expect(
        page.getByRole("button", { name: "+ Add Folder" }),
      ).toBeDisabled();
      await expect(
        page.getByRole("button", { name: "+ Add File" }),
      ).toBeDisabled();
      await expect(page.getByRole("button", { name: "Share" })).toBeDisabled();
    });

    test("switching tabs updates visible resources", async ({ page }) => {
      // Create User 2 with a file
      await page.getByRole("button", { name: "+ Add User" }).click();
      await expect(page.getByText("User 2's Folder")).toBeVisible();
      await page.getByRole("button", { name: "+ Add File" }).click();
      await expect(page.getByText("File 1")).toBeVisible();

      // Switch to User 1
      await page.getByRole("button", { name: "User 1" }).click();

      // Should see User 1's folder, not User 2's
      await expect(page.getByText("User 1's Folder")).toBeVisible();
      await expect(page.getByText("User 2's Folder")).toHaveCount(0);

      // Switch back to User 2
      await page.getByRole("button", { name: "User 2" }).click();

      // Should see User 2's folder and file
      await expect(page.getByText("User 2's Folder")).toBeVisible();
      await expect(page.getByText("File 1")).toBeVisible();
    });

    test("cannot share a resource that was shared with you", async ({
      page,
    }) => {
      // User 1 creates a file and shares it with new user
      await page.getByRole("button", { name: "+ Add File" }).click();
      await page.getByText("File 1").click();
      await expect(page.getByText("File 1").locator("..")).toHaveClass(/selected/);
      await page.getByRole("button", { name: "Share" }).click();
      await page.getByText("+ New User").click();

      // Switch to User 2
      await page.getByRole("button", { name: "User 2" }).click();

      // Select the shared file
      await page.getByText("File 1").click();

      // Share button should be disabled
      await expect(page.getByRole("button", { name: "Share" })).toBeDisabled();
    });
  });
}
