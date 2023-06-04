import { SType } from "./set-types/s-type.js";
import { ZType } from "./set-types/z-type.js";

export class SetTypeFactory {
    static getType(setType, setTypeData) {
        switch (setType) {
            case 's':
                return new SType(setTypeData);
            case 'z':
                return new ZType(setTypeData);
        }
    }
}