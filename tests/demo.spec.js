import { test, expect } from "@playwright/test";

const DEMO_URL = "/blog/permission-systems-for-enterprise/demo.html";
const DEMO_IMPLEMENTATIONS = ["Naive", "RBAC"];

test.describe("Permission Demo - Mode Switching & Data Sync", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    // Wait for SQLite initialization (starts in Naive mode)
    await page.waitForSelector(".tree-item");
  });

  test("switching from Naive to RBAC preserves users", async ({ page }) => {
    // Start in Naive mode (default)
    await expect(page.getByRole("radio", { name: "Naive" })).toBeChecked();

    // Create additional users (wait for each one to be created)
    await page.getByRole("button", { name: "+ Add User" }).click();
    await expect(page.getByRole("button", { name: "User 2" })).toBeVisible();
    await page.getByRole("button", { name: "+ Add User" }).click();
    await expect(page.getByRole("button", { name: "User 3" })).toBeVisible();

    // Switch to RBAC
    await page.getByRole("radio", { name: "RBAC" }).click();
    await expect(page.getByRole("radio", { name: "RBAC" })).toBeChecked();

    // All users should still be visible
    await expect(page.getByRole("button", { name: "User 1" })).toBeVisible();
    await expect(page.getByRole("button", { name: "User 2" })).toBeVisible();
    await expect(page.getByRole("button", { name: "User 3" })).toBeVisible();
  });

  test("switching from Naive to RBAC preserves folders and files", async ({
    page,
  }) => {
    // Create folder structure in Naive mode
    await page.getByRole("button", { name: "+ Add Folder" }).click();
    await page.getByText("Folder 2").click();
    await page.getByRole("button", { name: "+ Add File" }).click();
    await page.getByRole("button", { name: "+ Add File" }).click();

    // Verify structure exists
    await expect(page.getByText("User 1's Root Folder")).toBeVisible();
    await expect(page.getByText("Folder 2")).toBeVisible();
    await expect(page.getByText("File 1")).toBeVisible();
    await expect(page.getByText("File 2")).toBeVisible();

    // Switch to RBAC
    await page.getByRole("radio", { name: "RBAC" }).click();

    // All resources should still be visible
    await expect(page.getByText("User 1's Root Folder")).toBeVisible();
    await expect(page.getByText("Folder 2")).toBeVisible();
    await expect(page.getByText("File 1")).toBeVisible();
    await expect(page.getByText("File 2")).toBeVisible();
  });

  test("switching from Naive to RBAC preserves sharing relationships", async ({
    page,
  }) => {
    // Create a folder and share it with a new user
    await page.getByRole("button", { name: "+ Add Folder" }).click();
    await page.getByText("Folder 2").click();
    await page.getByRole("button", { name: "Share" }).click();
    await page.getByText("+ New User").click();

    // Verify sharing badge
    await expect(page.getByText("shared with: User 2")).toBeVisible();

    // Switch to RBAC
    await page.getByRole("radio", { name: "RBAC" }).click();

    // Sharing relationship should be preserved
    await expect(page.getByText("shared with: User 2")).toBeVisible();

    // Switch to User 2 and verify they can see the shared folder
    await page.getByRole("button", { name: "User 2" }).click();
    await expect(page.getByText("Folder 2")).toBeVisible();
    await expect(page.getByText("shared", { exact: true })).toBeVisible();
  });

  test("switching back to Naive preserves data from RBAC", async ({ page }) => {
    // Switch to RBAC first
    await page.getByRole("radio", { name: "RBAC" }).click();
    await expect(page.getByRole("radio", { name: "RBAC" })).toBeChecked();

    // Create structure in RBAC mode
    await page.getByRole("button", { name: "+ Add User" }).click();
    await expect(page.getByRole("button", { name: "User 2" })).toBeVisible();

    // Switch to User 1 and wait for their tree to load
    await page.getByRole("button", { name: "User 1" }).click();
    await expect(page.getByRole("button", { name: "User 1" })).toHaveClass(
      /active/,
    );
    await expect(page.getByText("User 1's Root Folder")).toBeVisible();

    // Click on User 1's Root Folder to ensure it's selected, then add a folder
    await page.getByText("User 1's Root Folder").click();
    await page.getByRole("button", { name: "+ Add Folder" }).click();
    await expect(page.getByText("Folder 2")).toBeVisible();

    // Select Folder 2 and share with User 2
    await page.getByText("Folder 2").click();
    await page.getByRole("button", { name: "Share" }).click();
    await page.locator(".share-option").getByText("User 2").click();
    await expect(page.getByText("shared with: User 2")).toBeVisible();

    // Switch back to Naive
    await page.getByRole("radio", { name: "Naive" }).click();
    await expect(page.getByRole("radio", { name: "Naive" })).toBeChecked();

    // All data should be preserved
    await expect(page.getByRole("button", { name: "User 1" })).toBeVisible();
    await expect(page.getByRole("button", { name: "User 2" })).toBeVisible();
    await expect(page.getByText("Folder 2")).toBeVisible();
    await expect(page.getByText("shared with: User 2")).toBeVisible();
  });

  test("permissions work correctly after switching to RBAC", async ({
    page,
  }) => {
    // Set up complex scenario in Naive mode
    // User 1 creates Folder 2 > File 1, shares Folder 2 with User 2
    await page.getByRole("button", { name: "+ Add Folder" }).click();
    await page.getByText("Folder 2").click();
    await page.getByRole("button", { name: "+ Add File" }).click();
    await page.getByRole("button", { name: "Share" }).click();
    await page.getByText("+ New User").click();

    // Switch to RBAC
    await page.getByRole("radio", { name: "RBAC" }).click();

    // User 2 should see shared content with correct permissions
    await page.getByRole("button", { name: "User 2" }).click();

    // Should see ancestor (User 1's Root Folder), shared folder, and descendant file
    await expect(page.getByText("User 1's Root Folder")).toBeVisible();
    await expect(page.getByText("Folder 2")).toBeVisible();
    await expect(page.getByText("File 1")).toBeVisible();

    // Select the shared folder - buttons should be disabled (read-only)
    await page.getByText("Folder 2").click();
    await expect(
      page.getByRole("button", { name: "+ Add Folder" }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "+ Add File" }),
    ).toBeDisabled();
    await expect(page.getByRole("button", { name: "Share" })).toBeDisabled();

    // Select ancestor - also should be disabled
    await page.getByText("User 1's Root Folder").click();
    await expect(
      page.getByRole("button", { name: "+ Add Folder" }),
    ).toBeDisabled();

    // User 2's own folder should have full permissions
    await page.getByText("User 2's Root Folder").click();
    await expect(
      page.getByRole("button", { name: "+ Add Folder" }),
    ).toBeEnabled();
    await expect(
      page.getByRole("button", { name: "+ Add File" }),
    ).toBeEnabled();
    await expect(page.getByRole("button", { name: "Share" })).toBeEnabled();
  });

  test("admin status is preserved when switching modes", async ({ page }) => {
    // Make User 1 an admin
    await page.getByRole("checkbox", { name: "Admin" }).click();
    await expect(page.getByRole("checkbox", { name: "Admin" })).toBeChecked();

    // Create User 2 with their own folder (User 2's tab becomes active)
    await page.getByRole("button", { name: "+ Add User" }).click();
    await expect(page.getByRole("button", { name: "User 2" })).toBeVisible();
    await expect(page.getByText("User 2's Root Folder")).toBeVisible();

    // User 2 creates a folder inside their root folder
    // (folder_count stays at 1 when adding user, so next is Folder 2)
    await page.getByRole("button", { name: "+ Add Folder" }).click();
    await expect(page.getByText("Folder 2")).toBeVisible();

    // Switch back to User 1 (admin)
    await page.getByRole("button", { name: "User 1" }).click();
    await expect(page.getByRole("checkbox", { name: "Admin" })).toBeChecked();

    // Admin can see User 2's resources
    await expect(page.getByText("User 2's Root Folder")).toBeVisible();
    await expect(page.getByText("Folder 2")).toBeVisible();

    // Switch to RBAC
    await page.getByRole("radio", { name: "RBAC" }).click();

    // Admin status should be preserved
    await expect(page.getByRole("checkbox", { name: "Admin" })).toBeChecked();

    // Admin should still see all resources
    await expect(page.getByText("User 2's Root Folder")).toBeVisible();
    await expect(page.getByText("Folder 2")).toBeVisible();
  });

  test("selected user is preserved when switching modes", async ({ page }) => {
    // Create User 2 and stay on their tab
    await page.getByRole("button", { name: "+ Add User" }).click();
    await expect(page.getByRole("button", { name: "User 2" })).toHaveClass(
      /active/,
    );

    // Switch to RBAC
    await page.getByRole("radio", { name: "RBAC" }).click();

    // User 2 should still be the active tab
    await expect(page.getByRole("button", { name: "User 2" })).toHaveClass(
      /active/,
    );
    await expect(page.getByText("User 2's Root Folder")).toBeVisible();
  });
});

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

      // User type is standard by default (admin checkbox unchecked)
      await expect(page.getByRole("checkbox", { name: "Admin" })).not.toBeChecked();

      // Root folder is visible and selected
      const rootFolder = page.getByText("User 1's Root Folder");
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
      await expect(page.getByText("User 2's Root Folder")).toBeVisible();
    });

    test("add folder and file creates resources under selected folder", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "+ Add Folder" }).click();
      await expect(page.getByText("Folder 2")).toBeVisible();

      await page.getByRole("button", { name: "+ Add File" }).click();
      await expect(page.getByText("File 1")).toBeVisible();
    });

    test("owner sees 'shared with' but recipient sees just 'shared'", async ({
      page,
    }) => {
      // Create a file and share it
      await page.getByRole("button", { name: "+ Add File" }).click();
      await page.getByText("File 1").click();
      await expect(page.getByText("File 1").locator("..")).toHaveClass(
        /selected/,
      );
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
      await expect(page.getByText("User 2's Root Folder")).toHaveCount(0);
      await expect(page.getByText("Folder 2")).toHaveCount(0);
    });

    test("admin user sees all resources", async ({ page }) => {
      // Create User 2
      await page.getByRole("button", { name: "+ Add User" }).click();
      await expect(page.getByText("User 2's Root Folder")).toBeVisible();

      // User 2 creates a folder
      await page.getByRole("button", { name: "+ Add Folder" }).click();
      await expect(page.getByText("Folder 2")).toBeVisible();

      // Switch to User 1 and make them admin
      await page.getByRole("button", { name: "User 1" }).click();
      await page.getByRole("checkbox", { name: "Admin" }).click();

      // User 1 should now see User 2's resources
      await expect(page.getByText("User 2's Root Folder")).toBeVisible();
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
      await expect(page.getByText("Folder 2").locator("..")).toHaveClass(
        /selected/,
      );
      await expect(
        page.getByRole("button", { name: "+ Add Folder" }),
      ).toBeDisabled();
      await expect(
        page.getByRole("button", { name: "+ Add File" }),
      ).toBeDisabled();
      await expect(page.getByRole("button", { name: "Share" })).toBeDisabled();
    });

    test("sharing file shows ancestor path, hides siblings, disables buttons on ancestors", async ({
      page,
    }) => {
      // Create: Folder 2 > File 1, File 2
      await page.getByRole("button", { name: "+ Add Folder" }).click();
      await page.getByText("Folder 2").click();
      await page.getByRole("button", { name: "+ Add File" }).click(); // File 1
      await page.getByRole("button", { name: "+ Add File" }).click(); // File 2

      // Share only File 1 with new user
      await page.getByText("File 1").click();
      await expect(page.getByText("File 1").locator("..")).toHaveClass(
        /selected/,
      );
      await page.getByRole("button", { name: "Share" }).click();
      await page.getByText("+ New User").click();

      // Switch to User 2
      await page.getByRole("button", { name: "User 2" }).click();

      // User 2 should see ancestor path and File 1
      await expect(page.getByText("User 1's Root Folder")).toBeVisible();
      await expect(page.getByText("Folder 2")).toBeVisible();
      await expect(page.getByText("File 1")).toBeVisible();

      // But NOT File 2 (sibling)
      await expect(page.getByText("File 2")).toHaveCount(0);

      // Buttons should be disabled on ancestor folders
      await page.getByText("User 1's Root Folder").click();
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
      await expect(page.getByText("User 2's Root Folder")).toBeVisible();
      await page.getByRole("button", { name: "+ Add File" }).click();
      await expect(page.getByText("File 1")).toBeVisible();

      // Switch to User 1
      await page.getByRole("button", { name: "User 1" }).click();

      // Should see User 1's folder, not User 2's
      await expect(page.getByText("User 1's Root Folder")).toBeVisible();
      await expect(page.getByText("User 2's Root Folder")).toHaveCount(0);

      // Switch back to User 2
      await page.getByRole("button", { name: "User 2" }).click();

      // Should see User 2's folder and file
      await expect(page.getByText("User 2's Root Folder")).toBeVisible();
      await expect(page.getByText("File 1")).toBeVisible();
    });
  });
}
