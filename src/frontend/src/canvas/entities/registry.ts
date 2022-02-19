class Registry<T> {
  manifest: Record<string, T>;
  static idCounter = 0;

  constructor() {
    this.manifest = {};
  }

  register(item: T) {
    const id = String(Registry.idCounter++);
    this.manifest[id] = item;
    return id;
  }

  get(id: string) {
    return this.manifest[id] || null;
  }

  unregister(id: string) {
    delete this.manifest[id];
  }
}

export default Registry;
