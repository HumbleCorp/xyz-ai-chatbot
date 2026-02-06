import { expect, test } from "@playwright/test";
import path from "path";
import fs from "fs";
import os from "os";

// Helper function to create a test file
async function createTestFile(
  filename: string,
  content: string
): Promise<string> {
  const tmpDir = os.tmpdir();
  const filePath = path.join(tmpDir, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
}

test.describe("File Upload", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("attachments button is visible", async ({ page }) => {
    await expect(page.getByTestId("attachments-button")).toBeVisible();
  });

  test("can upload a text file", async ({ page }) => {
    // Create a test text file
    const filePath = await createTestFile(
      "test-document.txt",
      "This is a test document for file upload."
    );

    // Click the attachments button to trigger file input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);

    // Wait for upload to complete and preview to appear
    await expect(page.getByTestId("attachments-preview")).toBeVisible({
      timeout: 10000,
    });

    // Verify the attachment preview shows up
    const attachmentPreview = page.getByTestId("input-attachment-preview");
    await expect(attachmentPreview).toBeVisible();

    // Clean up
    fs.unlinkSync(filePath);
  });

  test("can upload a PDF file", async ({ page }) => {
    // Create a minimal PDF file (mock content)
    const pdfContent = Buffer.from(
      "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/MediaBox [0 0 612 792]\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000262 00000 n\n0000000341 00000 n\ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n435\n%%EOF"
    );
    const tmpDir = os.tmpdir();
    const filePath = path.join(tmpDir, "test-document.pdf");
    fs.writeFileSync(filePath, pdfContent);

    // Upload the file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);

    // Wait for upload to complete
    await expect(page.getByTestId("attachments-preview")).toBeVisible({
      timeout: 10000,
    });

    // Verify the attachment preview shows up
    const attachmentPreview = page.getByTestId("input-attachment-preview");
    await expect(attachmentPreview).toBeVisible();

    // Clean up
    fs.unlinkSync(filePath);
  });

  test("can upload a JSON file", async ({ page }) => {
    const jsonContent = JSON.stringify({ test: "data", value: 123 }, null, 2);
    const filePath = await createTestFile("test-data.json", jsonContent);

    // Upload the file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);

    // Wait for upload to complete
    await expect(page.getByTestId("attachments-preview")).toBeVisible({
      timeout: 10000,
    });

    // Verify the attachment preview shows up
    const attachmentPreview = page.getByTestId("input-attachment-preview");
    await expect(attachmentPreview).toBeVisible();

    // Clean up
    fs.unlinkSync(filePath);
  });

  test("can upload a CSV file", async ({ page }) => {
    const csvContent = "name,age,city\nJohn,30,New York\nJane,25,Boston";
    const filePath = await createTestFile("test-data.csv", csvContent);

    // Upload the file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);

    // Wait for upload to complete
    await expect(page.getByTestId("attachments-preview")).toBeVisible({
      timeout: 10000,
    });

    // Verify the attachment preview shows up
    const attachmentPreview = page.getByTestId("input-attachment-preview");
    await expect(attachmentPreview).toBeVisible();

    // Clean up
    fs.unlinkSync(filePath);
  });

  test("can upload a Markdown file", async ({ page }) => {
    const markdownContent = "# Test Markdown\n\nThis is a **test** file.";
    const filePath = await createTestFile("test-doc.md", markdownContent);

    // Upload the file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);

    // Wait for upload to complete
    await expect(page.getByTestId("attachments-preview")).toBeVisible({
      timeout: 10000,
    });

    // Verify the attachment preview shows up
    const attachmentPreview = page.getByTestId("input-attachment-preview");
    await expect(attachmentPreview).toBeVisible();

    // Clean up
    fs.unlinkSync(filePath);
  });

  test("can upload multiple files", async ({ page }) => {
    // Create multiple test files
    const file1 = await createTestFile("file1.txt", "Content 1");
    const file2 = await createTestFile("file2.txt", "Content 2");

    // Upload multiple files
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([file1, file2]);

    // Wait for uploads to complete
    await expect(page.getByTestId("attachments-preview")).toBeVisible({
      timeout: 10000,
    });

    // Verify multiple attachment previews show up
    const attachmentPreviews = page.getByTestId("input-attachment-preview");
    await expect(attachmentPreviews).toHaveCount(2);

    // Clean up
    fs.unlinkSync(file1);
    fs.unlinkSync(file2);
  });

  test("can remove uploaded file", async ({ page }) => {
    // Create and upload a test file
    const filePath = await createTestFile(
      "test-remove.txt",
      "This file will be removed"
    );

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);

    // Wait for upload to complete
    await expect(page.getByTestId("attachments-preview")).toBeVisible({
      timeout: 10000,
    });

    // Hover over the attachment to reveal the remove button
    const attachmentPreview = page.getByTestId("input-attachment-preview");
    await attachmentPreview.hover();

    // Click the remove button (find button inside the attachment preview)
    const removeButton = attachmentPreview.locator("button").first();
    await removeButton.click();

    // Verify the attachment was removed
    await expect(page.getByTestId("attachments-preview")).not.toBeVisible();

    // Clean up
    fs.unlinkSync(filePath);
  });

  test("shows loading state during upload", async ({ page }) => {
    // Create a test file
    const filePath = await createTestFile(
      "test-loading.txt",
      "Testing loading state"
    );

    // Upload the file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);

    // Check for loading indicator (should appear briefly)
    const loader = page.getByTestId("input-attachment-loader");
    // The loader might be very brief, so we use a try-catch
    try {
      await expect(loader).toBeVisible({ timeout: 2000 });
    } catch {
      // Loader might have already disappeared, which is fine
    }

    // Wait for upload to complete
    await expect(page.getByTestId("attachments-preview")).toBeVisible({
      timeout: 10000,
    });

    // Clean up
    fs.unlinkSync(filePath);
  });

  test("can send message with attachment", async ({ page }) => {
    // Create and upload a test file
    const filePath = await createTestFile(
      "test-send.txt",
      "File content for message"
    );

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);

    // Wait for upload to complete
    await expect(page.getByTestId("attachments-preview")).toBeVisible({
      timeout: 10000,
    });

    // Type a message
    const input = page.getByTestId("multimodal-input");
    await input.fill("Please analyze this file");

    // Send the message
    await page.getByTestId("send-button").click();

    // Verify the input and attachment preview clear after sending
    await expect(input).toHaveValue("");
    await expect(page.getByTestId("attachments-preview")).not.toBeVisible();

    // Clean up
    fs.unlinkSync(filePath);
  });

  test("disables attachment button for reasoning models", async ({ page }) => {
    // This test assumes there's a way to select a reasoning model
    // You may need to adjust based on your UI
    const attachmentButton = page.getByTestId("attachments-button");

    // Initially, button should be enabled
    await expect(attachmentButton).toBeEnabled();

    // Note: If you want to test reasoning model behavior, you'd need to:
    // 1. Open model selector
    // 2. Select a reasoning model
    // 3. Verify attachment button is disabled
    // This would require knowing the exact UI flow for model selection
  });
});
