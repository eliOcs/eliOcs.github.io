import { test, expect } from "@playwright/test";

test("resume image gallery opens, navigates, and closes", async ({ page }) => {
  await page.goto("/resume/");

  const firstGallery = page.locator(".image-gallery").first();
  const firstImage = firstGallery.locator("img").first();
  const secondImage = firstGallery.locator("img").nth(1);
  const modal = page.locator("#imageModal");
  const modalImage = page.locator("#modalImage");
  const caption = page.locator("#imageCaption");

  await firstImage.click();

  await expect(modal).toBeVisible();
  await expect(modalImage).toHaveAttribute(
    "src",
    /great-customer-satisfaction/,
  );
  await expect(caption).toHaveText(await firstImage.getAttribute("alt"));

  await page.keyboard.press("ArrowRight");

  await expect(modalImage).toHaveAttribute("src", /reduction-incomming-bugs/);
  await expect(caption).toHaveText(await secondImage.getAttribute("alt"));

  await page.keyboard.press("ArrowLeft");

  await expect(modalImage).toHaveAttribute(
    "src",
    /great-customer-satisfaction/,
  );

  await page.keyboard.press("Escape");

  await expect(modal).toBeHidden();
});
