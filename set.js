import { SetTypeFactory } from './set-type-factory.js'

export class FuzzySet {
    constructor(setType, setTypeData) {
        this.setType = SetTypeFactory.getType(setType, setTypeData);
    }

    getMembershipFor(value) {
        return this.setType.getMembershipFor(value);
    }
}