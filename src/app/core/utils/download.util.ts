export function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export function downloadFileFromResponse(response: any, filename: string): void {
  const blob = response instanceof Blob ? response : new Blob([response]);
  downloadFile(blob, filename);
}
