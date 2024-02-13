import passport from 'passport';

import { PassportStrategy } from '../interfaces';
import { Strategy } from 'passport-oauth2';

export default class PassportConfig {
    constructor(strategies: PassportStrategy[]) {
        this._addStrategies(strategies);
    } 
    
    private _addStrategies(strategies: PassportStrategy[]): void {
        strategies.forEach((passportStrategy: PassportStrategy) => {
            passport.use(passportStrategy.name, passportStrategy.strategy);
        });
    }
}
