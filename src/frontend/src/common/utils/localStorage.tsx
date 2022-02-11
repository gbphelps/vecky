class LocalStorageValue<T> {
  ls: Storage;

  key: string;

  constructor(key: string) {
    this.key = key;
    this.ls = localStorage;
  }

  get(): T | null {
    const str = this.ls.getItem(this.key);
    if (!str) return null;
    return JSON.parse(str);
  }

  set(value: T) {
    this.ls.setItem(this.key, JSON.stringify(value));
  }

  unset() {
    this.ls.removeItem(this.key);
  }
}

export default LocalStorageValue;
