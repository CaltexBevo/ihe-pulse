export const EDITIONS = {
  "edition-20": {
    "sha256": "d7d53ef83b36797eb5644d8f8f3c67194448d6eca429d29391b039a8448019bf",
    "subject": "The Innovation Pulse: Edition 20",
    "storyCount": 9,
    "paragraphCount": 59
  },
  "edition-21": {
    "sha256": "0954b0d6565146146d6d48609746b3516e040543c1e9504c8f05e55805653865",
    "subject": "The Innovation Pulse: Edition 21",
    "storyCount": 10,
    "paragraphCount": 55
  }
} as const;
export type Edition = keyof typeof EDITIONS;
export function isEdition(value: unknown): value is Edition { return typeof value === "string" && Object.prototype.hasOwnProperty.call(EDITIONS, value); }
