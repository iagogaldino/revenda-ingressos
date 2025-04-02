export function currentUser(): string | null {
    return localStorage.getItem('currentUser');
  }
  