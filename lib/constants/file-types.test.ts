import { describe, expect, it } from "vitest";
import {
  SUPPORTED_FILE_TYPES,
  FILE_TYPE_CATEGORIES,
  getFileTypeCategory,
  FILE_ACCEPT_STRING,
} from "./file-types";

describe("file-types", () => {
  describe("SUPPORTED_FILE_TYPES", () => {
    it("should include common image types", () => {
      expect(SUPPORTED_FILE_TYPES).toContain("image/jpeg");
      expect(SUPPORTED_FILE_TYPES).toContain("image/png");
      expect(SUPPORTED_FILE_TYPES).toContain("image/gif");
      expect(SUPPORTED_FILE_TYPES).toContain("image/webp");
    });

    it("should include PDF", () => {
      expect(SUPPORTED_FILE_TYPES).toContain("application/pdf");
    });

    it("should include text file types", () => {
      expect(SUPPORTED_FILE_TYPES).toContain("text/plain");
      expect(SUPPORTED_FILE_TYPES).toContain("text/html");
      expect(SUPPORTED_FILE_TYPES).toContain("text/csv");
      expect(SUPPORTED_FILE_TYPES).toContain("text/markdown");
    });

    it("should include office document types", () => {
      expect(SUPPORTED_FILE_TYPES).toContain(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      expect(SUPPORTED_FILE_TYPES).toContain("application/msword");
      expect(SUPPORTED_FILE_TYPES).toContain(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      expect(SUPPORTED_FILE_TYPES).toContain("application/vnd.ms-excel");
    });

    it("should include code file types", () => {
      expect(SUPPORTED_FILE_TYPES).toContain("application/json");
      expect(SUPPORTED_FILE_TYPES).toContain("text/javascript");
      expect(SUPPORTED_FILE_TYPES).toContain("text/x-python");
    });
  });

  describe("FILE_TYPE_CATEGORIES", () => {
    it("should categorize image types correctly", () => {
      expect(FILE_TYPE_CATEGORIES.image).toContain("image/jpeg");
      expect(FILE_TYPE_CATEGORIES.image).toContain("image/png");
    });

    it("should categorize document types correctly", () => {
      expect(FILE_TYPE_CATEGORIES.document).toContain("application/pdf");
    });

    it("should categorize text types correctly", () => {
      expect(FILE_TYPE_CATEGORIES.text).toContain("text/plain");
      expect(FILE_TYPE_CATEGORIES.text).toContain("text/html");
    });

    it("should categorize office types correctly", () => {
      expect(FILE_TYPE_CATEGORIES.office).toContain(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      expect(FILE_TYPE_CATEGORIES.office).toContain("application/msword");
    });

    it("should categorize code types correctly", () => {
      expect(FILE_TYPE_CATEGORIES.code).toContain("application/json");
      expect(FILE_TYPE_CATEGORIES.code).toContain("text/x-python");
    });
  });

  describe("getFileTypeCategory", () => {
    it("should return 'image' for image MIME types", () => {
      expect(getFileTypeCategory("image/jpeg")).toBe("image");
      expect(getFileTypeCategory("image/png")).toBe("image");
      expect(getFileTypeCategory("image/gif")).toBe("image");
      expect(getFileTypeCategory("image/webp")).toBe("image");
    });

    it("should return 'document' for PDF", () => {
      expect(getFileTypeCategory("application/pdf")).toBe("document");
    });

    it("should return 'text' for text MIME types", () => {
      expect(getFileTypeCategory("text/plain")).toBe("text");
      expect(getFileTypeCategory("text/html")).toBe("text");
      expect(getFileTypeCategory("text/csv")).toBe("text");
      expect(getFileTypeCategory("text/markdown")).toBe("text");
    });

    it("should return 'office' for office document MIME types", () => {
      expect(
        getFileTypeCategory(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
      ).toBe("office");
      expect(getFileTypeCategory("application/msword")).toBe("office");
      expect(
        getFileTypeCategory(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      ).toBe("office");
      expect(getFileTypeCategory("application/vnd.ms-excel")).toBe("office");
    });

    it("should return 'code' for code file MIME types", () => {
      expect(getFileTypeCategory("application/json")).toBe("code");
      expect(getFileTypeCategory("text/javascript")).toBe("code");
      expect(getFileTypeCategory("text/x-python")).toBe("code");
      expect(getFileTypeCategory("text/x-java")).toBe("code");
    });

    it("should return 'unknown' for unsupported MIME types", () => {
      expect(getFileTypeCategory("application/octet-stream")).toBe("unknown");
      expect(getFileTypeCategory("video/mp4")).toBe("unknown");
      expect(getFileTypeCategory("audio/mpeg")).toBe("unknown");
    });
  });

  describe("FILE_ACCEPT_STRING", () => {
    it("should be a non-empty string", () => {
      expect(FILE_ACCEPT_STRING).toBeTruthy();
      expect(typeof FILE_ACCEPT_STRING).toBe("string");
    });

    it("should contain common file extensions", () => {
      expect(FILE_ACCEPT_STRING).toContain(".jpg");
      expect(FILE_ACCEPT_STRING).toContain(".png");
      expect(FILE_ACCEPT_STRING).toContain(".pdf");
      expect(FILE_ACCEPT_STRING).toContain(".txt");
      expect(FILE_ACCEPT_STRING).toContain(".doc");
      expect(FILE_ACCEPT_STRING).toContain(".docx");
      expect(FILE_ACCEPT_STRING).toContain(".json");
    });

    it("should be comma-separated", () => {
      expect(FILE_ACCEPT_STRING.split(",").length).toBeGreaterThan(1);
    });
  });
});
