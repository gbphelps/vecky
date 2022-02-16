class DomEntry {
  static manifest: Map<
    SVGElement,
    Record<string, DomEntry>
  > = new Map();

  private static idCounter = 0;

  static lookup(root: SVGElement, id: string): DomEntry | null {
    return DomEntry.manifest.get(root)?.[id] ?? null;
  }

  id: string;

  constructor({ root }: {root: SVGElement}) {
    this.id = String(DomEntry.idCounter++);
    const rootEntry = DomEntry.manifest.get(root) || {};
    rootEntry[this.id] = this;
    DomEntry.manifest.set(root, rootEntry);
  }
}

export default DomEntry;
