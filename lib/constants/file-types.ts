// Supported file types by Claude and other AI models
export const SUPPORTED_FILE_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  // Documents
  "application/pdf",
  // Text files
  "text/plain",
  "text/html",
  "text/csv",
  "text/markdown",
  "text/x-markdown",
  // Office documents
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
  // Code files
  "application/json",
  "application/xml",
  "text/xml",
  "application/javascript",
  "text/javascript",
  "text/x-python",
  "text/x-java",
  "text/x-c",
  "text/x-c++",
  "text/x-csharp",
  "text/x-ruby",
  "text/x-go",
  "text/x-rust",
  "text/x-typescript",
] as const;

export type SupportedFileType = (typeof SUPPORTED_FILE_TYPES)[number];

// File type categories for UI display
export const FILE_TYPE_CATEGORIES = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  document: ["application/pdf"],
  text: ["text/plain", "text/html", "text/csv", "text/markdown", "text/x-markdown"],
  office: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ],
  code: [
    "application/json",
    "application/xml",
    "text/xml",
    "application/javascript",
    "text/javascript",
    "text/x-python",
    "text/x-java",
    "text/x-c",
    "text/x-c++",
    "text/x-csharp",
    "text/x-ruby",
    "text/x-go",
    "text/x-rust",
    "text/x-typescript",
  ],
} as const;

// Helper function to get file type category
export function getFileTypeCategory(mimeType: string): keyof typeof FILE_TYPE_CATEGORIES | "unknown" {
  for (const [category, types] of Object.entries(FILE_TYPE_CATEGORIES)) {
    if (types.includes(mimeType as never)) {
      return category as keyof typeof FILE_TYPE_CATEGORIES;
    }
  }
  return "unknown";
}

// File extensions mapping for accept attribute
export const FILE_ACCEPT_STRING = [
  // Images
  ".jpg", ".jpeg", ".png", ".gif", ".webp",
  // Documents
  ".pdf",
  // Text files
  ".txt", ".html", ".csv", ".md", ".markdown",
  // Office documents
  ".doc", ".docx", ".xls", ".xlsx",
  // Code files
  ".json", ".xml", ".js", ".ts", ".tsx", ".jsx", ".py", ".java", ".c", ".cpp", ".cs", ".rb", ".go", ".rs",
].join(",");
