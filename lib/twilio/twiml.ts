export function createSmsReply(message: string) {
    const escapedMessage = message
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  
    return `<?xml version="1.0" encoding="UTF-8"?>
  <Response>
    <Message>${escapedMessage}</Message>
  </Response>`;
  }
  