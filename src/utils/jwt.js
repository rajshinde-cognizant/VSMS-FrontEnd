export function decodeJWT(token) {
    if (!token) return null;
    try {
      const base64Payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      return decodedPayload;
    } catch (err) {
      console.error('Failed to decode JWT', err);
      return null;
    }
  }