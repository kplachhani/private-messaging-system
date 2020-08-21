
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as crypto from 'crypto-browserify';
import { Buffer } from 'Buffer';
import * as aes256 from 'aes256';

import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})

export class E2eEncryptionService {

  private E2EActivatedSubject = new BehaviorSubject<boolean>(false);
  public E2EActivated = this.E2EActivatedSubject.asObservable();

  private party: any;

  constructor(private localStorage: LocalstorageService) {
  }

  generatePublicKey() {
    this.party = crypto.createECDH('secp256k1');
    this.party.generateKeys();
    const key = this.party.getPublicKey().toString('base64');
    this.localStorage.set({ key: 'public-key', value: key });
  }

  computeSecretKey(relyingPartyPublicKeyBase64: string) {
    const key = this.party.computeSecret(relyingPartyPublicKeyBase64, 'base64', 'hex');
    this.localStorage.set({ key: 'shared-key', value: key });
    this.E2EActivatedSubject.next(true);
  }

  encrypt(payload: any) {
    const sharedKey = this.localStorage.get('shared-key');
    if (!sharedKey) {
      throw new Error('shared key is not computed');
    }
    const IV = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      Buffer.from(sharedKey, 'hex'),
      IV
    );

    let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const auth_tag = cipher.getAuthTag().toString('hex');

    console.table({
      IV: IV.toString('hex'),
      encrypted: encrypted,
      auth_tag: auth_tag
    });

    const encryptedPayload = IV.toString('hex') + encrypted + auth_tag;

    const payload64 = Buffer.from(encryptedPayload, 'hex').toString('base64');
    console.log(`payload return ${payload64}`);
    return payload64;

  }

  decrypt(DecryptedPayload: any) {
    const sharedKey = this.localStorage.get('shared-key');
    if (!sharedKey) {
      throw new Error('shared key is not computed');
    }

    const payload = Buffer.from(DecryptedPayload, 'base64').toString('hex');
    const iv = payload.substr(0, 32);
    const encrypted = payload.substr(32, payload.length - 32 - 32);
    const auth_tag = payload.substr(payload.length - 32, 32);

    console.table({ iv, encrypted, auth_tag });

    try {
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(sharedKey, 'hex'),
        Buffer.from(iv, 'hex')
      );

      decipher.setAuthTag(Buffer.from(auth_tag, 'hex'));

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      console.table({ DecyptedMessage: decrypted });
      return JSON.parse(decrypted);
    } catch (error) {
      console.log(error.message);
    }


  }

}


