import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async store(storageKey: string, value: any) {
    const valor = JSON.stringify(value);
    await Storage.set({
      key: storageKey,
      value: valor
    });
  }

  async get(storageKey: string) {
    const ret = await Storage.get({ key: storageKey });
    return ret.value ? JSON.parse(ret.value) : null;
  }
    
  async removeStorageItem(storageKey: string) {
    await Storage.remove({ key: storageKey });  
  }

  async clear() {
    await Storage.clear();
  }
}
