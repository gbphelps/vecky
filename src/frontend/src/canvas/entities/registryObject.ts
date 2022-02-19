import Registry from './registry';

class RegistryObject<T> {
  id: string;
  registry: Registry<RegistryObject<T>>;

  constructor({ registry }: {registry: Registry<RegistryObject<T>>}) {
    this.id = registry.register(this);
    this.registry = registry;
  }

  destroy() {
    this.registry.unregister(this.id);
  }
}

export default RegistryObject;
